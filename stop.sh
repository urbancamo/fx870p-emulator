#!/usr/bin/env bash
if [ -f .server.pid ]; then
  kill "$(cat .server.pid)" && rm .server.pid
  echo "Server stopped"
else
  echo "No .server.pid found — trying port 3007"
  lsof -ti :3007 | xargs kill -9 && echo "Server stopped"
fi