FROM ubuntu:bionic

# need to fetch latest ca-certificates first
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ca-certificates gnupg2 linux-headers-$(uname -r)

# install pcp
COPY etc_apt_sources.list.d_pcp.list /etc/apt/sources.list.d/pcp.list
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys A51D3ADCDEA2C114
RUN apt-get -y update
RUN apt-get install -y pcp pcp-webapi bpfcc-tools

