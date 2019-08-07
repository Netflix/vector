![Vector](vector.png)

[![TravisCI](https://img.shields.io/travis/Netflix/vector.svg)](https://travis-ci.org/Netflix/vector)
[![Slack Status](http://slack.getvector.io/badge.svg)](http://slack.getvector.io/)
[![NetflixOSS Lifecycle](https://img.shields.io/osslifecycle/Netflix/vector.svg)]()
[![License](https://img.shields.io/github/license/Netflix/vector.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![Docker Pulls](https://img.shields.io/docker/pulls/netflixoss/vector.svg)](https://hub.docker.com/r/netflixoss/vector/)


Vector is an open source on-host performance monitoring framework which exposes hand picked high resolution system and application metrics to every engineer’s browser. Having the right metrics available on-demand and at a high resolution is key to understand how a system behaves and correctly troubleshoot performance issues.

## Disclaimer

Vector is under development and new features are added constantly. Bugs and issues are expected. We count on your support to find and report them! **Use releases for stable code.**

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
