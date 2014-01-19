#! /bin/sh
echo "**** Stopping server"
npm stop
echo "**** Updating dependiences"
npm update
echo "**** Starting server"
npm start

echo "**** Up and running yo"