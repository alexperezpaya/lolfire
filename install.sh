# install script
curl https://raw.github.com/creationix/nvm/master/install.sh | sh
#nvm install 0.10
#nvm use 0.10
#nvm alias default 0.10
apt-get update
apt-get install -y python-software-properties python g++ make
add-apt-repository -y ppa:chris-lea/node.js
apt-get update
apt-get install nodejs
npm install forever
apt-get update
apt-get install -y git redis-server typecatcher