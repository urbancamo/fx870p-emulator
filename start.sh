#!/usr/bin/env bash
npm run dev &
echo $! > .server.pid
echo "Server started on port 3007 (pid $!)"