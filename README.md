![Vector](vector.png)

## Project Status

https://groups.google.com/d/msg/vector-users/MWF8nnj1WHw/1EelNPOBAwAJ

> Today we are sharing with the community that we have contributed our latest developments in this space to the PCP project and are retiring Vector as a standalone web application. Specifically, we have contributed a data source for Grafana as well as some template dashboards that we use internally. This has been picked up by the PCP team and wrapped into a formal product. This splits what Vector is and how it is used into two pieces. The bulk of the monitoring moves into a more familiar stack with Grafana, which also includes the components to collect and display performance data including BCC-based flame graphs. Additional Netflix-specific flame-graphs and related functionality has been pulled into a new internal tool called FlameCommander.
> 
> We have decided to lean into the Grafana stack. Grafana is widely used, well supported, and has an extensible framework for developing visualisations and including new sources of data for processing.
> 
> 
> Specifically in terms of the community around Vector, we will transition it as follows:
> 
> - Code will remain up and online in Github. Issues and support will be best effort.
> - The vector slack and mailing lists will disappear over time. We encourage users to move across to the PCP support channels listed at https://pcp.io/community.html.
> - For slack, you’ll want to be sure to hop in to the #grafana channel on the PCP slack.
> - Vector.io will stay up for a period and then be decommissioned.



[![License](https://img.shields.io/github/license/Netflix/vector.svg)](http://www.apache.org/licenses/LICENSE-2.0)


Vector is an open source on-host performance monitoring framework which exposes hand picked high resolution system and application metrics to every engineer’s browser. Having the right metrics available on-demand and at a high resolution is key to understand how a system behaves and correctly troubleshoot performance issues.

## Getting Started

See the [Getting Started Guide](http://getvector.io/docs/getting-started.html) for documentation on how to get started.

## Developing

Specific configuration for your environment can be set up at the following locations:
```
src/config.js               # app-wide configuration
src/charts/*                # set up chart widgets
src/bundles/*               # configure the high level groups
help/*                      # and the help panels for the charts
```

After you are set up, standard npm package.json commands can be used:
```
nvm use
npm install
npm run build
npm run serve
```

At a high level, the remaining directories contain:
```
src/components/*            # all of the React components that compose the page
src/components/Pollers/*    # the React components that talk to the PCP backend
processors/*                # pcp to graph data fetch and transform components
```

## Issues

For bugs, questions and discussions please use the [GitHub Issues](https://github.com/Netflix/vector/issues).

## Questions

Join Vector on [Slack](https://vectoross.slack.com/) for support and discussion. If you don't have an invite yet, [request one](http://slack.getvector.io/) now!

You can also ask questions to other Vector users and contributors on [Google Groups](https://groups.google.com/forum/#!forum/vector-users) or [Stack Overflow](http://stackoverflow.com/questions/tagged/vectoross).

## Versioning

For transparency and insight into our release cycle, and for striving to maintain backward compatibility, Vector will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit [http://semver.org/](http://semver.org/).

## License

Copyright 2016 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
