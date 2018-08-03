import React from 'react'
import PropTypes from 'prop-types'
import superagent from 'superagent'

function targetMatches (t1, t2) {
  return t1.hostname === t2.hostname && t1.hostspec === t2.hostspec && t1.containerId === t2.containerId
}

/**
 * ContextPoller accepts a poller as a set of properties, and performs polling for context data.
 *
 * Accepts target (hostname, hostspec, context, containerId)
 * Calls back with updates to metadata (hostname etc)
 */
class ContextPoller extends React.Component {
  state = {
    // an array of
    // { target: { hostname, hostspec, containerId },
    //   contextId, isContainerSet, pmids{name:pmid}, hostnameFromHost, containerList }
    contexts: []
  }

  render () {
    return null
  }

  componentDidMount = () => {
    setTimeout(() => this.pollContexts(), this.props.pollIntervalMs)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // each input target has a corresponding state
    // if there was a state previously, then copy it over
    return {
      contexts: nextProps.targets.map(target => {
        let oldTarget = prevState.contexts.find(context => targetMatches(context.target, target))
        return oldTarget ? { ...oldTarget, target } : { target }
      })
    }
  }

  pollContexts = () => {
    this.state.contexts.forEach(c => this.pollContext(c))
  }

  pollContext = async (existingContext) => {
    try {
      const context = { ...existingContext }
      const pmApi = `http://${context.target.hostname}:7402/pmapi`
      let needsPublish = false

      const TIMEOUTS = { response: 5000, deadline: 10000 }

      // check if a contextId is missing, fetch it
      if (!context.contextId) {
        const contextResponse = await superagent
          .get(`${pmApi}/context`)
          .timeout(TIMEOUTS)
          .query({ exclusive: 1, hostspec: context.target.hostspec, polltimeout: 10 })
        context.contextId = contextResponse.body.context
        needsPublish = true
      }

      // check if pmids is missing, fetch it
      if (!context.pmids) {
        const pmidResponse = await superagent
          .get(`${pmApi}/${context.contextId}/_metric`)
          .timeout(TIMEOUTS)
        context.pmids = {}
        pmidResponse.body.metrics.forEach(m => context.pmids[m.name] = m.pmid)
        needsPublish = true
      }

      // check if hostname is available, fetch it
      if (!context.hostname) {
        const hostnameResponse = await superagent
          .get(`${pmApi}/${context.contextId}/_fetch?names=pmcd.hostname`)
          .timeout(TIMEOUTS)
        context.hostname = hostnameResponse.body.values[0].instances[0].value
        needsPublish = true
      }

      // check if container set
      if (!context.isContainerSet && context.containerId) {
        await superagent
          .get(`${pmApi}/${context.contextId}/_store`)
          .timeout(TIMEOUTS)
          .query({ name: 'pmcd.client.container', value: context.containerId })
        // does this ever fail?
        context.isContainerSet = true
        needsPublish = true
      }

      // publish by copying and replacing the modified context
      if (needsPublish) {
        this.publishContext(context)
      }
    } catch (err) {
      console.warn('could not poll context', err)
    }

    setTimeout(() => this.pollContexts(), this.props.pollIntervalMs)
  }

  publishContext = (context) => {
    this.props.onContextUpdated(context)
    this.setState(state => {
      const newContexts = [...state.contexts]
      const idx = newContexts.findIndex(old => targetMatches(old.target, context.target))
      newContexts[idx] = context
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
  onContextUpdated: PropTypes.func.isRequired,
}

export default ContextPoller
