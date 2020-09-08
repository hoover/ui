FROM node:13

ARG UNAME=liquid
ARG UID=666
ARG GID=666
RUN groupadd -g $GID -o $UNAME
RUN useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME

RUN mkdir -p /opt/hoover/ui
RUN chown -R 666:666 /opt/hoover/ui
WORKDIR /opt/hoover/ui

USER 666

ADD package*.json /opt/hoover/ui/
RUN npm install

ADD . /opt/hoover/ui/
ENV NEXT_TELEMETRY_DISABLED=1
