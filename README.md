# Vector

Vector is an Instance-Level, On-Demand, High-Resolution Monitoring Framework. It's a web-base UI that leverages Performance Co-Pilot (PCP) in the backend.

## Disclaimer

This is the first release of Vector. As such, expect to find bugs and issues. We count on your support to find and document them! 

Vector is under constant development and new versions should be released often. 

## Getting Started

In order to get started, you should first install Performance Co-Pilot (PCP) on each instance you plan to monitor. PCP will collect the metrics and make them available via API for Vector.

Optional monitoring agents can also be installed in order to collect specific metrics that are not supported by PCP's system agent.

Once PCP is intalled, you should be able to run Vector and connect to the target instance.

### Performance Co-Pilot (PCP)

Vector depends on Peformance Co-Pilot (PCP) to collect metrics on each instance you plan to monitor. 

Since Vector depends on version 3.10 or higher, the current packages available on most Linux distro repositories would not suffice. Until newer versions are available in the repositories, you should be able to install PCP from binary packages made available by the PCP development team on:

```
ftp.pcp.io
````

Or building it from source. To do so, get the current version of the source code: 

```
$ git clone git://git.pcp.io/pcp
```

Then build and install:

```
$ cd pcp
$ ./configure --prefix=/usr --sysconfdir=/etc --localstatedir=/var
$ make
# make install
```

More information on how to install Performance Co-Pilot can be found at:

[http://pcp.io/docs/installation.html#src](http://pcp.io/docs/installation.html#src)

### Vector Web App

Vector is a simple static web application that runs completely on the client side. It can run locally or deployed to any HTTP server available, like Apache or Nginx.

To run it locally via Python's SimpleHTTPServerm first clone the repo:

```
$ git clone https://github.com/Netflix/Vector.git
```

Run the server:

```
$ cd Vector
$ python -m SimpleHTTPServer 8000
```

And open Vector on your browser:

[http://localhost:8000](http://localhost:8000)

### Configuration

* PCP port
* Default values
	* Window
	* Interval
	* Hostname
* Custom agents

## Issues

For bugs, questions and discussions please use the Github Issues.

## Documentation

For full documentation, please refer to the docs page.

## License

Copyright 2015 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.