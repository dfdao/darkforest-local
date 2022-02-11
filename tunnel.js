const localtunnel = require('localtunnel');
const opn = require('opn');

const jsonRPC = async () => {
    const tunnel = await localtunnel({ port: 8545, local_host: '127.0.0.1' });

  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  // tunnel.url;

  console.log(`\nDEV_RPC_URL=${tunnel.url}`);

  // Opens url for deployer to approve.
  opn(tunnel.url);

  tunnel.on('close', () => {
    // tunnels are closed
  });
};

const client = async () => {
  const tunnel = await localtunnel({ port: 8081, local_host: '127.0.0.1' });

  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  // tunnel.url;

  console.log(`\nDEV_PUBLIC_CLIENT=${tunnel.url}`);

  // Opens url for deployer to approve.
  opn(tunnel.url);

  tunnel.on('close', () => {
    // tunnels are closed
  });
};

const main = () => {
  // want sync calls
  jsonRPC();
  client();
}

main();