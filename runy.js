module.exports = {
  host: '46.254.19.100',
  username: 'deploy',
  port: 42777,
  remotePath: '/srv/early-bird',
  git: 'git@github.com:roonyx/early-bird.git',
  agent: process.env.SSH_AUTH_SOCK,
  commands: [
    'nvm use 9.5.0',
    'git pull origin master',
    'yarn install --production=false',
    'yarn build'
  ],
};
