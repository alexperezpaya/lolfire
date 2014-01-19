#! /bin/sh
echo "**** Stopping server"
forever stop app.js
echo "**** Updating dependiences"
npm update
echo "**** Starting server"
forever start app.js

echo "**** Up and running yo"