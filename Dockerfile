FROM node:13

ARG UNAME=liquid
ARG UID=666
ARG GID=666
RUN groupadd -g $GID -o $UNAME
RUN useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME

RUN mkdir -p /opt/hoover/ui
# RUN mkdir -p /opt/hoover/ui/build/_next
RUN chown -R 666:666 /opt/hoover/ui
# RUN chown -R 666:666 /opt/hoover/ui/build/_next
WORKDIR /opt/hoover/ui

ADD package*.json /opt/hoover/ui/
RUN npm install

USER 666

ADD . /opt/hoover/ui/
ENV NEXT_TELEMETRY_DISABLED=1
