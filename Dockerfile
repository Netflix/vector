# Copyright 2016 Netflix, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM alpine:latest
MAINTAINER Martin Spier <mspier@netflix.com>

RUN mkdir -p /usr/share/nginx/html
COPY /dist /usr/share/nginx/html
RUN apk add --update curl && \
    curl --silent --show-error --fail --location \
      --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" -o - \
      "https://caddyserver.com/download/build?os=linux&arch=amd64" \
      | tar --no-same-owner -C /usr/bin/ -xz caddy && \
    chmod 0755 /usr/bin/caddy && \
    /usr/bin/caddy -version && \
    apk del curl && \    
    rm -rf /root/.cache /root/.config /root/.local /root/.ash_history \
      /usr/share/man /var/cache/apk/* 
          
EXPOSE 80
CMD ["/usr/bin/caddy", "-root", "/usr/share/nginx/html", "-port", "80"]
VOLUME ["/usr/share/nginx/html"]
