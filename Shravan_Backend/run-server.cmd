@echo off
set MONGODB_URI=mongodb://127.0.0.1:27017/website-weaver-kit
node dist/server/index.js --port 8082
