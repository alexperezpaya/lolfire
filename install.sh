# install script
curl https://raw.github.com/creationix/nvm/master/install.sh | sh
nvm install 0.10
nvm use 0.10
nvm alias default 0.10
npm install forever
apt-get update
apt-get install -y git redis