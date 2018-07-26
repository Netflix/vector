import simpleModel from '../processors/simpleModel'
import {
  divideByOnlyMetric,
  timesliceCalculations,
  customTitleAndKeylabel,
  kbToGb,
  combineValuesByTitle,
  toPercentage,
  mapInstanceDomains,
  defaultTitleAndKeylabel,
  divideBy,
  cumulativeTransform,
  fixContainerNames,
} from '../processors/transforms'

import {
  firstValueInObject,
} from '../processors/utils'

export default [
  // TODO need to remove containers that do not actually exist
  {
    group: 'Container',
    title: 'Per-Container CPU Utilization',
    processor: simpleModel,
    config: {
      metricNames: [
        'cgroup.cpuacct.usage',
      ],
      transforms: [
        // TODO check for container filter in ConfigPanel
        mapInstanceDomains,
        fixContainerNames,
        defaultTitleAndKeylabel,
        cumulativeTransform,
        // TODO is average the right approach here, or should we exclude duplicates?
        // it seems like the result set includes data for multiple copies of the same container and so the
        // cpu for a container is double counted
        combineValuesByTitle((a, b) => (a + b)/2),
        divideBy(1000 * 1000 * 1000),
        toPercentage,
      ],
    },
  },

  {
    group: 'Container',
    title: 'Per-Container Memory Usage (Mb)',
    processor: simpleModel,
    config: {
      metricNames: [
        'cgroup.memory.usage',
      ],
      transforms: [
        // TODO check for container filter in ConfigPanel
        mapInstanceDomains,
        fixContainerNames,
        defaultTitleAndKeylabel,
        // TODO is average the right approach here, or should we exclude duplicates?
        // it seems like the result set includes data for multiple copies of the same container and so the
        // cpu for a container is double counted
        combineValuesByTitle((a, b) => (a + b)/2),
        kbToGb,
      ],
    },
  },

  {
    group: 'Container',
    title: 'Total Container Memory Usage (Mb)',
    processor: simpleModel,
    config: {
      lineType: 'stackedarea',
      metricNames: [
        'cgroup.memory.usage',
        'mem.util.used',
        'mem.util.free',
      ],
      transforms: [
        // make sure that all the cgroup memory uses the same metric and then add them together
        // this sums all the values across the cgroup (map + fix are so that the cgroup size is calculated only on containers)
        mapInstanceDomains,
        fixContainerNames,
        customTitleAndKeylabel(metric => metric),
        combineValuesByTitle((a, b) => a + b),
        divideByOnlyMetric(1024, 'mem.util.used'),
        divideByOnlyMetric(1024, 'mem.util.free'),
        divideByOnlyMetric(1024 * 1024 * 2, 'cgroup.memory.usage'), // TODO why double counted (*2)
        // extra transform for cgroup memory usage
        // apply some mathsy stuff, note this wipes title and keylabel
        timesliceCalculations({
          'host used': (values) => ({ '-1': values['mem.util.used']['-1'] - firstValueInObject(values['cgroup.memory.usage']) }),
          'free (unused)': (values) => ({ '-1': values['mem.util.free']['-1'] }),
          'container used': (values) => ({ '-1': firstValueInObject(values['cgroup.memory.usage']) }),
        }),
        // add back a title and keylabel
        defaultTitleAndKeylabel,
      ],
    },
  },

  {
    group: 'Container',
    title: 'Per-Container Memory Headroom (Mb)',
    processor: simpleModel,
    config: {
      metricNames: [
        'cgroup.memory.usage', // bytes
        'cgroup.memory.limit', // bytes
        'mem.physmem', // kilobytes
      ],
      transforms: [
        mapInstanceDomains,
        fixContainerNames,
        divideByOnlyMetric(1024, 'mem.physmem'),
        divideByOnlyMetric(1024*1024*2, 'cgroup.memory.usage'),
        divideByOnlyMetric(1024*1024*2, 'cgroup.memory.limit'),
        timesliceCalculations({
          // TODO this calculation is substantially different from the old vector calculation
          'headroom': (slice) => {
            console.log(slice)
            let containerNames = Object.keys(slice['cgroup.memory.usage'])
            let headrooms = containerNames.map(cname => ({
              cname,
              headroomMb: Math.min(slice['cgroup.memory.limit'][cname], slice['mem.physmem']['-1']) - slice['cgroup.memory.usage'][cname]
            }))
            return headrooms.reduce((acc, { cname, headroomMb }) => { acc[cname] = headroomMb; return acc; }, {})
          }
        }),
        defaultTitleAndKeylabel,
      ],
    },
  },
]

/*

Container Disk IOPS
Container Disk Throughput (Bytes)
Container Disk IOPS (Throttled)
Container Disk Throughput (Throttled) (Bytes)

Per-Container CPU Scheduler
Per-Container CPU Headroom
Per-Container Throttled CPU
Per-Container Memory Utilization
*/
