# edge-push-server

[![Build Status](https://app.travis-ci.com/EdgeApp/edge-exchange-server.svg?branch=master)](https://app.travis-ci.com/EdgeApp/edge-exchange-server)

This server provides ancillary routines to assist in exchange operations. ie. Quoting DEX swaps for Thorchain

## Setup

This server requires a working copies of Node.js, Yarn, PM2. We also recommend using Caddy to terminate SSL connections.

### Set up logging

Run these commands as a server admin:

```sh
mkdir /var/log/pm2
chown edgy /var/log/pm2
```

### Manage server using `pm2`

First, tell pm2 how to run the server script:

```sh
# install:
pm2 start pm2.json
pm2 save

# check status:
pm2 monit
tail -f /var/log/exchangeServer.out.log

# manage:
pm2 reload pm2.json
pm2 restart pm2.json
pm2 stop pm2.json

pm2 restart exchangeServer // Just the HTTP server
```

### Updating

To update the code running on the production server, use the following procedure:

```sh
git pull
yarn
yarn prepare
pm2 restart pm2.json
```

Each deployment should come with its own version bump, changelog update, and git tag.
