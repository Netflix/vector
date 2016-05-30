FROM alpine:latest
MAINTAINER Jan Garaj info@monitoringartist.com

# version = git branch/tag, e.g. master, stable, tags/1.1.0, ...
ENV VECTOR_VERSION=tags/v1.1.0

RUN apk add --update git nodejs curl && \
    cd /tmp && \
    git clone https://github.com/Netflix/vector.git && \
    cd vector && \
    git checkout ${VECTOR_VERSION} && \
    npm install && \
    npm install -g gulp bower && \
    bower install --allow-root && \
    gulp build && \
    mkdir -p /usr/share/nginx/html && \
    mv dist/* /usr/share/nginx/html && \
    cd / && \
    curl --silent --show-error --fail --location \
      --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" -o - \
      "https://caddyserver.com/download/build?os=linux&arch=amd64" \
      | tar --no-same-owner -C /usr/bin/ -xz caddy && \
    chmod 0755 /usr/bin/caddy && \
    /usr/bin/caddy -version && \
    npm uninstall -g gulp bower && \
    apk del git nodejs curl && \    
    rm -rf /root/.npm /root/.cache /root/.config /root/.local /root/.ash_history \
      /root/.v8flags* /usr/share/man /tmp/* /var/cache/apk/* \
      /usr/local/{lib/node{,/.npm,_modules},bin,share/man}/npm*
          
EXPOSE 80
CMD ["/usr/bin/caddy", "-root", "/usr/share/nginx/html", "-port", "80"]
VOLUME ["/usr/share/nginx/html"]    
