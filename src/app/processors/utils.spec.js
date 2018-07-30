import * as utils from './utils'
import { expect } from 'chai'

describe('createTimestampFromDataset', () => {
  it('creates the correct timestamp', () => {
    const dataset = {
      timestamp: {
        s: 1531869878,
        us: 882804,
      }
    }
    let result = utils.createTimestampFromDataset(dataset)
    expect(result.toISOString()).to.equal('2018-07-17T23:24:38.882Z')
  })
})

describe('extractInstancesForMetric', () => {
  let datasets
  describe('with full datasets', () => {
    beforeEach(() => {
      datasets = require('../../../test/datasets.json')
    })

    describe('looking for a single instance item (pswitch)', () => {
      it('finds { pswitch, -1 }', () => {
        let result = utils.extractInstancesForMetric(datasets, [ 'kernel.all.pswitch' ])
        expect(result.length).to.equal(1)
        expect(result).to.have.deep.members([
            { metric: 'kernel.all.pswitch', instance: -1 },
          ])
      })
    })

    describe('looking for multiple instances (pswitch, runnable)', () => {
      it('finds [{ pswitch, -1 }, { runnable, -1 }]', () => {
        let result = utils.extractInstancesForMetric(datasets, [ 'kernel.all.pswitch', 'kernel.all.runnable' ])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
            { metric: 'kernel.all.runnable', instance: -1 },
            { metric: 'kernel.all.pswitch', instance: -1 },
          ])
      })
    })

    describe('looking for a multiple instance item (load avg)', () => {
      it('finds [{ load, 1 }, { load, 5 }, { load, 15 }]', () => {
        let result = utils.extractInstancesForMetric(datasets, [ 'kernel.all.load' ])
        expect(result.length).to.equal(3)
        expect(result).to.have.deep.members([
            { metric: 'kernel.all.load', instance: 1 },
            { metric: 'kernel.all.load', instance: 5 },
            { metric: 'kernel.all.load', instance: 15 },
          ])
      })
    })

    describe('looking for a mix', () => {
      it('finds all', () => {
        let result = utils.extractInstancesForMetric(datasets, [ 'kernel.all.pswitch', 'kernel.all.runnable', 'kernel.all.load' ])
        expect(result.length).to.equal(5)
        expect(result).to.have.deep.members([
            { metric: 'kernel.all.runnable', instance: -1 },
            { metric: 'kernel.all.pswitch', instance: -1 },
            { metric: 'kernel.all.load', instance: 1 },
            { metric: 'kernel.all.load', instance: 5 },
            { metric: 'kernel.all.load', instance: 15 },
          ])
      })
    })
  })
})

describe('combineValuesAtTimestampReducer', () => {
  describe('with a sum combiner', () => {
    const sum = (a, b) => (a + b)
    describe('with no timestamps', () => {
      const data = []
      it('produces an empty array', () => {
        const result = data.reduce(utils.combineValuesAtTimestampReducer(sum), [])
        expect(result.length).to.equal(0)
      })
    })

    describe('with no matching timestamps', () => {
      const data = [
        { ts: new Date(1234), value: 1 },
        { ts: new Date(4567), value: 3 },
      ]
      it('produces a concat result', () => {
        const result = data.reduce(utils.combineValuesAtTimestampReducer(sum), [])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
          { ts: new Date(1234), value: 1 },
          { ts: new Date(4567), value: 3 },
        ])
      })
    })

    describe('with two matching timestamps', () => {
      const data = [
        { ts: new Date(1234), value: 1 },
        { ts: new Date(1234), value: 3 },
      ]
      it('produces a single output with combined result', () => {
        const result = data.reduce(utils.combineValuesAtTimestampReducer(sum), [])
        expect(result.length).to.equal(1)
        expect(result).to.have.deep.members([
          { ts: new Date(1234), value: 4 },
        ])
      })
    })

    describe('with four matching timestamps', () => {
      const data = [
        { ts: new Date(1234), value: 1 },
        { ts: new Date(1234), value: 3 },
        { ts: new Date(1234), value: 5 },
        { ts: new Date(1234), value: 9 },
      ]
      it('produces a single output with combined result', () => {
        const result = data.reduce(utils.combineValuesAtTimestampReducer(sum), [])
        expect(result.length).to.equal(1)
        expect(result).to.have.deep.members([
          { ts: new Date(1234), value: 18 },
        ])
      })
    })

    describe('with two timestamps and four values each', () => {
      const data = [
        { ts: new Date(1234), value: 1 },
        { ts: new Date(1234), value: 3 },
        { ts: new Date(1234), value: 5 },
        { ts: new Date(1234), value: 9 },
        { ts: new Date(5678), value: 101 },
        { ts: new Date(5678), value: 103 },
        { ts: new Date(5678), value: 105 },
        { ts: new Date(5678), value: 109 },
      ]
      it('produces two timestamps with correct combined result', () => {
        const result = data.reduce(utils.combineValuesAtTimestampReducer(sum), [])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
          { ts: new Date(1234), value: 18 },
          { ts: new Date(5678), value: 418 },
        ])
      })
    })
  })
})

describe('combineValuesByTitleReducer', () => {
  describe('with a sum combiner', () => {
    const sum = (a, b) => (a + b)
    describe('with empty input', () => {
      const data = []
      it('returns an empty array', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(0)
      })
    })
    describe('with no overlap at same time', () => {
      const data = [
        { metric: 'cpu', instance: 'cpu0', title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
        { metric: 'iops', instance: 0, title: 'disk', keylabel: 'disk', data: [ { ts: new Date(1234), value: 1 } ] },
      ]
      it('returns unique titles', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
          { metric: 'cpu', instance: 'cpu0', title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
          { metric: 'iops', instance: 0, title: 'disk', keylabel: 'disk', data: [ { ts: new Date(1234), value: 1 } ] },
        ])
      })
    })

    describe('with no overlap at different time', () => {
      const data = [
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
        { title: 'disk', keylabel: 'disk', data: [ { ts: new Date(5678), value: 1 } ] },
      ]
      it('returns unique titles', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
          { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
          { title: 'disk', keylabel: 'disk', data: [ { ts: new Date(5678), value: 1 } ] },
        ])
      })
    })

    describe('with overlap at different time', () => {
      const data = [
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(5678), value: 7 } ] },
      ]
      it('returns a single timeline', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(1)
        expect(result).to.have.deep.members([
          { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 }, { ts: new Date(5678), value: 7 } ] },
        ])
      })
    })

    describe('with a single title and multiple lines', () => {
      const data = [
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 }, { ts: new Date(5678), value: 5 } ] },
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(5678), value: 50 } ] },
      ]
      it('combines to a single title', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(1)
        expect(result).to.have.deep.members([
          { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 11 }, { ts: new Date(5678), value: 55 } ] },
        ])
      })
    })

    describe('with a mix of titles with multiple lines', () => {
      const data = [
        { metric: 'cpu', title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 }, { ts: new Date(5678), value: 5 } ] },
        { metric: 'cpu', title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(5678), value: 50 } ] },
        { metric: 'iops', title: 'disk', keylabel: 'disk', data: [ { ts: new Date(5678), value: 1 } ] },
        { metric: 'netbytes', title: 'network', keylabel: 'network', data: [ { ts: new Date(1234), value: 5 } ] },
        { metric: 'netbytes', title: 'network', keylabel: 'network', data: [ { ts: new Date(5678), value: 7 } ] },
      ]
      it('combines to the correct mix', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(3)
        expect(result).to.have.deep.members([
          { metric: 'cpu', title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 11 }, { ts: new Date(5678), value: 55 } ] },
          { metric: 'iops', title: 'disk', keylabel: 'disk', data: [ { ts: new Date(5678), value: 1 } ] },
          { metric: 'netbytes', title: 'network', keylabel: 'network', data: [ { ts: new Date(1234), value: 5 }, { ts: new Date(5678), value: 7 } ] },
        ])
      })
    })
  })
})

describe('findCgroupId', () => {
  describe('with titus sample dataset', () => {
    let data = {
      '/': null,
      '/containers.slice': null,
      '/containers.slice/5eb50578-4298-408f-93bc-2b6358f5e399': '5eb50578-4298-408f-93bc-2b6358f5e399',
      '/containers.slice/5eb50578-4298-408f-93bc-2b6358f5e399/b7634827117ffd3aa989931c34dac3806621ca5e96ffae04e8b41df93b70d42f': 'b7634827117ffd3aa989931c34dac3806621ca5e96ffae04e8b41df93b70d42f',
      '/containers.slice/67592816-7265-42ca-ab0c-e9bd562c27a8': '67592816-7265-42ca-ab0c-e9bd562c27a8',
      '/containers.slice/67592816-7265-42ca-ab0c-e9bd562c27a8/2c317fec6f0ec37b2293b3940fb158cffee7b3cc27e017f8bfd8ce492d1ab806': '2c317fec6f0ec37b2293b3940fb158cffee7b3cc27e017f8bfd8ce492d1ab806',
      '/containers.slice/ada1370b-b805-4b9a-8f2a-2e1343a2c68c': 'ada1370b-b805-4b9a-8f2a-2e1343a2c68c',
      '/containers.slice/ada1370b-b805-4b9a-8f2a-2e1343a2c68c/48e1821ff5486d585270435aaf5baedda1863028528a5bfcbd401d18d6e43cca': '48e1821ff5486d585270435aaf5baedda1863028528a5bfcbd401d18d6e43cca',
      '/containers.slice/37231f82-f44a-4bb3-abb5-ffe78a7e0d0f': '37231f82-f44a-4bb3-abb5-ffe78a7e0d0f',
      '/containers.slice/37231f82-f44a-4bb3-abb5-ffe78a7e0d0f/39ff2d3812c00e15191b250397fd4e69b5f3d8108556b5a53ea4efeb26146cc7': '39ff2d3812c00e15191b250397fd4e69b5f3d8108556b5a53ea4efeb26146cc7',
      '/mesos_executors.slice': null,
      '/user.slice': null,
      '/init.scope': null,
      '/system.slice': null,
      '/system.slice/irqbalance.service': null,
      '/system.slice/nfs-config.service': null,
      '/system.slice/titus-darion.service': null,
      '/system.slice/lvm2-lvmetad.service': null,
      '/system.slice/atlas-system-agent.service': null,
      '/system.slice/format-data-volume.service': null,
      '/system.slice/var-lib-titus\x2dinits-fccaec8a\x2d8d8d\x2d43ad\x2d811d\x2d6ec85070e358.mount': null,
      '/system.slice/mnt-docker-10000.10000-containers-39ff2d3812c00e15191b250397fd4e69b5f3d8108556b5a53ea4efeb26146cc7-mounts-shm.mount': null,
      '/system.slice/sys-kernel-debug.mount': null,
      '/system.slice/pmcd.service': null,
      '/system.slice/binfmt-support.service': null,
      '/system.slice/nflx-run-user-data.service': null,
      '/system.slice/run-docker-netns-a861002dc600.mount': null,
      '/system.slice/systemd-random-seed.service': null,
      '/system.slice/grub-common.service': null,
      '/system.slice/mnt.mount': null,
      '/system.slice/systemd-journal-flush.service': null,
      '/system.slice/quitelite-properties.service': null,
      '/system.slice/systemd-user-sessions.service': null,
      '/system.slice/mnt-docker-10000.10000-overlay2-fc3306a63bd0ff45abbf81425f8f90c17663fa3b083b047fb7ac7fd317ea23e6-merged.mount': null,
      '/system.slice/dev-hugepages.mount': null,
      '/system.slice/lvm2-monitor.service': null,
      '/system.slice/run-rpc_pipefs.mount': null,
      '/system.slice/titus-environment-generator.service': null,
      '/system.slice/sys-fs-fuse-connections.mount': null,
      '/system.slice/resolvconf.service': null,
      '/system.slice/dbus.service': null,
      '/system.slice/mnt-docker-10000.10000-containers-48e1821ff5486d585270435aaf5baedda1863028528a5bfcbd401d18d6e43cca-mounts-shm.mount': null,
      '/system.slice/postfix.service': null,
      '/system.slice/var-lib-titus\x2dinits-d0579f3d\x2df274\x2d4692\x2d9435\x2dfd93f841b0e1.mount': null,
      '/system.slice/pmwebd.service': null,
      '/system.slice/systemd-modules-load.service': null,
      '/system.slice/docker-user-ns.service': null,
      '/system.slice/mnt-docker-10000.10000-overlay2-fbfd7bbf339f7a06b03bcbb646014553225ae6dae0e32d3688b5e8f32b957eb9-merged.mount': null,
      '/system.slice/mnt-docker-10000.10000-overlay2-55a295edff3c0f3db27cdfd60a0d16f8d3b69dc06a8f0a18f3ab4dfd77644eaa-merged.mount': null,
      '/system.slice/run-docker-netns-ea801bbeac57.mount': null,
      '/system.slice/dev-mqueue.mount': null,
      '/system.slice/quitelite-discovery.service': null,
      '/system.slice/chrony.service': null,
      '/system.slice/docker.service': null,
      '/system.slice/run-docker-netns-96a21e04d692.mount': null,
      '/system.slice/var-lib-titus\x2dinits-c666fa65\x2df101\x2d4b38\x2d9a5a\x2d9351f1b94aa7.mount': null,
      '/system.slice/mnt-docker-10000.10000-overlay2-a4a1b4d19996bd0ef1472bd6609fbd0a2c4e5fa3c74934b8e43065c7c4768d17-merged.mount': null,
      '/system.slice/system-atlas\x2dtitus\x2dagent.slice': null,
      '/system.slice/ssh.service': null,
      '/system.slice/systemd-tmpfiles-setup.service': null,
      '/system.slice/system-serial\x2dgetty.slice': null,
      '/system.slice/cgroupfs-mount.service': null,
      '/system.slice/systemd-remount-fs.service': null,
      '/system.slice/system-getty.slice': null,
      '/system.slice/nflx-ec2rotatelogs.service': null,
      '/system.slice/systemd-update-utmp.service': null,
      '/system.slice/var-lib-titus\x2dinits-575b7947\x2d8d03\x2d4f3d\x2d9140\x2d7e29ab66e2e8.mount': null,
      '/system.slice/keyboard-setup.service': null,
      '/system.slice/proc-sys-fs-binfmt_misc.mount': null,
      '/system.slice/apparmor.service': null,
      '/system.slice/sysstat.service': null,
      '/system.slice/systemd-logind.service': null,
      '/system.slice/mesos-agent.service': null,
      '/system.slice/rc-local.service': null,
      '/system.slice/nflx-bolt.service': null,
      '/system.slice/docker-tcp-proxy.service': null,
      '/system.slice/titus-setup-networking.service': null,
      '/system.slice/mnt-docker-10000.10000-containers-b7634827117ffd3aa989931c34dac3806621ca5e96ffae04e8b41df93b70d42f-mounts-shm.mount': null,
      '/system.slice/cron.service': null,
      '/system.slice/nflx-ezconfig.service': null,
      '/system.slice/mnt-docker-10000.10000-containers-2c317fec6f0ec37b2293b3940fb158cffee7b3cc27e017f8bfd8ce492d1ab806-mounts-shm.mount': null,
      '/system.slice/systemd-udevd.service': null,
      '/system.slice/acpid.service': null,
      '/system.slice/nflx-init.service': null,
      '/system.slice/mkdir-mnt-titus-scp.service': null,
      '/system.slice/metatron.service': null,
      '/system.slice/rsyslog.service': null,
      '/system.slice/sys-kernel-debug-tracing.mount': null,
      '/system.slice/system-titus\x2dmetadata\x2dproxy.slice': null,
      '/system.slice/networking.service': null,
      '/system.slice/systemd-tmpfiles-setup-dev.service': null,
      '/system.slice/netperf.service': null,
      '/system.slice/snmpd.service': null,
      '/system.slice/aws-s3-proxy.service': null,
      '/system.slice/atd.service': null,
      '/system.slice/systemd-journald.service': null,
      '/system.slice/atlas-redis.service': null,
      '/system.slice/console-setup.service': null,
      '/system.slice/rng-tools.service': null,
      '/system.slice/systemd-journal-gatewayd.service': null,
      '/system.slice/kmod-static-nodes.service': null,
      '/system.slice/atlasd.service': null,
      '/system.slice/ufw.service': null,
      '/system.slice/systemd-sysctl.service': null,
      '/system.slice/systemd-networkd.service': null,
      '/system.slice/run-docker-netns-6df7c86f8395.mount': null,
      '/system.slice/-.mount': null,
      '/system.slice/mdadm.service': null,
      '/system.slice/setvtrgb.service': null,
      '/system.slice/titus-log-shipper.service': null,
      '/system.slice/titus-reaper.service': null,
      '/system.slice/systemd-udev-trigger.service': null,
      '/containers.slice/5e66f6f7-9b13-4cd9-b14a-2ec9f90f718c': '5e66f6f7-9b13-4cd9-b14a-2ec9f90f718c',
      '/containers.slice/5e66f6f7-9b13-4cd9-b14a-2ec9f90f718c/022df928288864f4c3937315d516b1aeb0d8b221790baa91ada35edbf466cdf3': '022df928288864f4c3937315d516b1aeb0d8b221790baa91ada35edbf466cdf3',
      '/system.slice/mnt-docker-10000.10000-overlay2-373e46d75b5902260ac9571cc323b6225d0f027ac7fb45ad279ef702931e5f91-merged.mount': null,
      '/system.slice/var-lib-titus\x2dinits-092ef666\x2df025\x2d43ed\x2db76c\x2d26a84d8b98ed.mount': null,
      '/system.slice/run-docker-netns-9777c7f6750e.mount': null,
      '/system.slice/mnt-docker-10000.10000-containers-022df928288864f4c3937315d516b1aeb0d8b221790baa91ada35edbf466cdf3-mounts-shm.mount': null,
      '/containers.slice/6889511b-f5ba-4b21-9003-833874e7186e': '6889511b-f5ba-4b21-9003-833874e7186e',
      '/containers.slice/6889511b-f5ba-4b21-9003-833874e7186e/ca9836673400bd33df9c2fa1542ee5602b6e606b1e03104c6a160191d2fc356c': 'ca9836673400bd33df9c2fa1542ee5602b6e606b1e03104c6a160191d2fc356c',
      '/system.slice/mnt-docker-10000.10000-containers-ca9836673400bd33df9c2fa1542ee5602b6e606b1e03104c6a160191d2fc356c-mounts-shm.mount': null,
      '/system.slice/mnt-docker-10000.10000-overlay2-f821d201821845692d9446da595abc4acf759bd52151480fbd33da4eba430f76-merged.mount': null,
      '/system.slice/var-lib-titus\x2dinits-c4194faf\x2d58f7\x2d4b94\x2dae3a\x2d7f3929199fbe.mount': null,
      '/system.slice/run-docker-netns-9f1be1dfcf73.mount': null,
    }
    it('maps them all correctly', () => {
      Object.keys(data).forEach(k => {
        expect(utils.findCgroupId(k)).to.equal(data[k], `${k} => ${data[k]}`)
      })
    })
  })
})

describe('getAllMetricInstancesAtTs', () => {
  describe('with a single instance', () => {
    let metricInstances = [
      { metric: 'cpu', instance: 'cpu0', data: [ { ts: new Date(1234), value: 0.5 }, { ts: new Date(1235), value: 0.6 }, { ts: new Date(1236), value: 0.5 } ] },
    ]
    it('fetches nothing for missing values', () => {
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1233))).to.deep.equal([ ])
    })
    it('extracts the values', () => {
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1234))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.5 },
      ])
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1235))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.6 },
      ])
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1236))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.5 },
      ])
    })
  })
  describe('with multiple instances', () => {
    let metricInstances = [
      { metric: 'cpu', instance: 'cpu0', data: [ { ts: new Date(1234), value: 0.5 }, { ts: new Date(1235), value: 0.6 }, { ts: new Date(1236), value: 0.5 } ] },
      { metric: 'network', instance: 'eth0', data: [ { ts: new Date(1234), value: 100 }, { ts: new Date(1235), value: 105 }, { ts: new Date(1236), value: 110 } ] }
    ]
    it('fetches nothing for missing values', () => {
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1233))).to.deep.equal([ ])
    })
    it('extracts the values', () => {
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1234))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.5 },
        { metric: 'network', instance: 'eth0', value: 100 },
      ])
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1235))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.6 },
        { metric: 'network', instance: 'eth0', value: 105 },
      ])
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1236))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.5 },
        { metric: 'network', instance: 'eth0', value: 110 },
      ])
    })
  })
  describe('with a zero value', () => {
    let metricInstances = [
      { metric: 'cpu', instance: 'cpu0', data: [ { ts: new Date(1234), value: 0 } ] }
    ]
    it('extracts the values', () => {
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1234))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0 },
      ])
    })
  })
})

describe('transposeToTimeslices', () => {
  describe('with multiple instances', () => {
    let data = [
      { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 90 }, { ts: new Date(1235), value: 85 }, { ts: new Date(1236), value: 70 } ] }
    ]
    it('transposes', () => {
      let transposed = utils.transposeToTimeslices(data)
      expect(transposed.length).to.equal(3)
      expect(transposed).to.have.deep.members([
        { ts: new Date(1234), values: { 'mem.free': { '-1': 10 }, 'mem.used': { '-1': 90 } } },
        { ts: new Date(1235), values: { 'mem.free': { '-1': 15 }, 'mem.used': { '-1': 85 } } },
        { ts: new Date(1236), values: { 'mem.free': { '-1': 30 }, 'mem.used': { '-1': 70 } } },
      ])
    })
  })
  describe('with instance tags of 0', () => {
    let data = [
      { metric: 'mem.free', instance: 0, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 90 }, { ts: new Date(1235), value: 85 }, { ts: new Date(1236), value: 70 } ] }
    ]
    it('transposes', () => {
      let transposed = utils.transposeToTimeslices(data)
      expect(transposed.length).to.equal(3)
      expect(transposed).to.have.deep.members([
        { ts: new Date(1234), values: { 'mem.free': { '0': 10 }, 'mem.used': { '-1': 90 } } },
        { ts: new Date(1235), values: { 'mem.free': { '0': 15 }, 'mem.used': { '-1': 85 } } },
        { ts: new Date(1236), values: { 'mem.free': { '0': 30 }, 'mem.used': { '-1': 70 } } },
      ])
    })
  })
})

describe('applyFunctionsToTimeslices', () => {
  let functions = {
    'sum': slice => ({ '-1': slice['mem.free']['0'] + slice['mem.used']['-1'] }),
    'min': slice => ({ '-1': Math.min(slice['mem.free']['0'], slice['mem.used']['-1']) }),
  }
  let timeslices = [
    { ts: new Date(1234), values: { 'mem.free': { '0': 10 }, 'mem.used': { '-1': 90 } } },
    { ts: new Date(1235), values: { 'mem.free': { '0': 15 }, 'mem.used': { '-1': 85 } } },
    { ts: new Date(1236), values: { 'mem.free': { '0': 30 }, 'mem.used': { '-1': 70 } } },
  ]
  it('applies the functions', () => {
    let applied = utils.applyFunctionsToTimeslices(timeslices, functions)
    expect(applied.length).to.equal(3)
    expect(applied).to.have.deep.members([
      { ts: new Date(1234), values: { 'sum': { '-1': 100 }, 'min': { '-1': 10 } } },
      { ts: new Date(1235), values: { 'sum': { '-1': 100 }, 'min': { '-1': 15 } } },
      { ts: new Date(1236), values: { 'sum': { '-1': 100 }, 'min': { '-1': 30 } } },
    ])
  })
})

describe('untransposeTimeslices', () => {
  describe('with multiple instances', () => {
    let data = [
      { ts: new Date(1234), values: { 'mem.free': { '-1': 10 }, 'mem.used': { '-1': 90 } } },
      { ts: new Date(1235), values: { 'mem.free': { '-1': 15 }, 'mem.used': { '-1': 85 } } },
      { ts: new Date(1236), values: { 'mem.free': { '-1': 30 }, 'mem.used': { '-1': 70 } } },
    ]
    it('untransposes', () => {
      let untransposed = utils.untransposeTimeslices(data)
      expect(untransposed.length).to.equal(2)
      expect(untransposed).to.have.deep.members([
        { metric: 'mem.free', instance: '-1', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'mem.used', instance: '-1', data: [ { ts: new Date(1234), value: 90 }, { ts: new Date(1235), value: 85 }, { ts: new Date(1236), value: 70 } ] }
      ])
    })
  })

  describe('with instance tags of 0', () => {
    let data = [
      { ts: new Date(1234), values: { 'mem.free': { '0': 10, 'foo': 3 }, 'mem.used': { '-1': 90 } } },
      { ts: new Date(1235), values: { 'mem.free': { '0': 15, 'foo': 4 }, 'mem.used': { '-1': 85 } } },
      { ts: new Date(1236), values: { 'mem.free': { '0': 30, 'foo': 5 }, 'mem.used': { '-1': 70 } } },
    ]
    it('transposes', () => {
      let untransposed = utils.untransposeTimeslices(data)
      expect(untransposed.length).to.equal(3)
      expect(untransposed).to.have.deep.members([
        { metric: 'mem.free', instance: '0', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'mem.free', instance: 'foo', data: [ { ts: new Date(1234), value: 3 }, { ts: new Date(1235), value: 4 }, { ts: new Date(1236), value: 5 } ] },
        { metric: 'mem.used', instance: '-1', data: [ { ts: new Date(1234), value: 90 }, { ts: new Date(1235), value: 85 }, { ts: new Date(1236), value: 70 } ] }
      ])
    })
  })

  describe('with an empty first timeslice', () => {
    let data = [
      { ts: new Date(1234), values: { } },
      { ts: new Date(1235), values: { 'mem.free': { '0': 15, 'foo': 4 }, 'mem.used': { '-1': 85 } } },
      { ts: new Date(1236), values: { 'mem.free': { '0': 30, 'foo': 5 }, 'mem.used': { '-1': 70 } } },
    ]
    it('transposes', () => {
      let untransposed = utils.untransposeTimeslices(data)
      expect(untransposed.length).to.equal(3)
      expect(untransposed).to.have.deep.members([
        { metric: 'mem.free', instance: '0', data: [ { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'mem.free', instance: 'foo', data: [ { ts: new Date(1235), value: 4 }, { ts: new Date(1236), value: 5 } ] },
        { metric: 'mem.used', instance: '-1', data: [ { ts: new Date(1235), value: 85 }, { ts: new Date(1236), value: 70 } ] }
      ])
    })
  })
})

