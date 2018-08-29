import React from 'react'
import PropTypes from 'prop-types'
import superagent from 'superagent'

import { matchesTarget } from '../../utils'

/**
 * ContextPoller accepts a poller as a set of properties, and performs polling for context data.
 *
 * Accepts target (hostname, hostspec, containerId)
 * Calls back with updates to metadata (hostname etc)
 */
class ContextPoller extends React.Component {
  state = {
    // an array of
    // { target: { hostname, hostspec, containerId },
    //   contextId, isContainerSet, pmids{name:pmid}, hostnameFromHost, containerList, errText }
    contexts: null,
    timer: null,
  }

  render () {
    return null
  }

  componentDidMount = () => {
    if (!this.state.timer) {
      this.setState({ timer: setInterval(() => this.pollContexts(), this.props.pollIntervalMs) })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if all the targets already existed then we can skip the state change
    // also check if contexts is null; if contexts is not defined it means we've never set them up (first load)
    if (this.state.contexts !== null && this.props.targets.length === prevProps.targets.length
      && this.props.targets.every(t1 => prevProps.targets.some(t2 => matchesTarget(t1, t2)))) {
      return
    }

    this.setState({
      contexts: (this.props.targets || []).map(target => {
        let oldTarget = (prevState.contexts || []).find(context => matchesTarget(context.target, target))
        return oldTarget ? { ...oldTarget, target } : { target }
      })
    }, this.pollContexts)
  }

  pollContexts = () => {
    this.props.onContextsUpdated(this.state.contexts);
    (this.state.contexts || []).forEach(c => this.pollContext(c))
  }

  pollContext = async (existingContext) => {
    const context = { ...existingContext, errText: null }
    try {
      const pmApi = `http://${context.target.hostname}/pmapi`

      const TIMEOUTS = { response: 5000, deadline: 10000 }

      // check if a contextId is missing, fetch it
      if (!context.contextId) {
        const contextResponse = await superagent
          .get(`${pmApi}/context`)
          .timeout(TIMEOUTS)
          .query({ exclusive: 1, hostspec: context.target.hostspec, polltimeout: 10 })
        context.contextId = contextResponse.body.context
        // set up defaults, required especially for error handling as the error
        // trigger is to empty the context and wait for next poll
        context.pmids = {}
        context.hostname = null
        context.isContainerSet = false
        context.errText = null
        context.containerList = null
        this.publishContext(context)
      }

      // check if pmids is missing, fetch it
      if (Object.keys(context.pmids).length === 0) {
        const pmidResponse = await superagent
          .get(`${pmApi}/${context.contextId}/_metric`)
          .timeout(TIMEOUTS)
        pmidResponse.body.metrics.forEach(m => context.pmids[m.name] = m.pmid)
        this.publishContext(context)
      }

      // check if hostname is available, fetch it
      if (!context.hostname) {
        const hostnameResponse = await superagent
          .get(`${pmApi}/${context.contextId}/_fetch?names=pmcd.hostname`)
          .timeout(TIMEOUTS)
        context.hostname = hostnameResponse.body.values[0].instances[0].value
        this.publishContext(context)
      }

      // check if container set
      if (!context.isContainerSet && context.target.containerId && context.target.containerId !== '_all') {
        await superagent
          .get(`${pmApi}/${context.contextId}/_store`)
          .timeout(TIMEOUTS)
          .query({ name: 'pmcd.client.container', value: context.target.containerId })
        // does this ever fail?
        context.isContainerSet = true
        this.publishContext(context)
      }

      // refresh container list
      const promisedContainerNames = superagent.get(`${pmApi}/${context.contextId}/_fetch?names=containers.name`)
      const promisedCgroups = superagent.get(`${pmApi}/${context.contextId}/_fetch?names=containers.cgroup`)

      let res = await promisedContainerNames
      const containers = res.body.values.length ? res.body.values[0].instances : []
      res = await promisedCgroups
      const cgroups = res.body.values.length ? res.body.values[0].instances : []
      context.containerList = cgroups.map(({ instance, value }) => ({
        instance,
        cgroup: value,
        containerId: containers.find(cont => cont.instance === instance).value
      }))

      this.publishContext(context)
    } catch (err) {
      if (err.response && err.response.badRequest && err.response.text && err.response.text.includes('-12376')) {
        context.errText = 'invalid context, re-establishing context'
        context.contextId = null
        this.publishContext(context)
      } else {
        console.warn('could not poll context', err)
        console.log(err)
        context.errText = JSON.stringify(err)
        this.publishContext(context)
        console.log(JSON.stringify(err))
      }
    }
  }

  publishContext = (context) => {
    this.setState(state => {
      const newContexts = [...state.contexts]
      const idx = newContexts.findIndex(old => matchesTarget(old.target, context.target))
      newContexts[idx] = { ...context }
      this.props.onContextsUpdated(newContexts)
      return { contexts: newContexts }
    })
  }
}

ContextPoller.propTypes = {
  targets: PropTypes.arrayOf(
    PropTypes.shape({
      // these should all be passed in as part of the connection setup
      hostname: PropTypes.string.isRequired,
      hostspec: PropTypes.string.isRequired,
      containerId: PropTypes.string,
    })),
  pollIntervalMs: PropTypes.number.isRequired,
  onContextsUpdated: PropTypes.func.isRequired,
}

export default ContextPoller
