import { ethers } from 'ethers';
import { FAUCET_ADDRESS } from '@darkforest_eth/contracts';
import FAUCET_ABI from './DFArenaFaucet.js';

import 'dotenv/config';
import express from 'express';

import cors from 'cors';

const GNOSIS = 'https://rpc.xdaichain.com/';
const GNOSIS_OPTIMISM = 'https://optimism.gnosischain.com';
const HARDHAT = 'http://localhost:8545';

const provider =
  process.env.MODE == 'development'
    ? new ethers.providers.JsonRpcProvider(HARDHAT)
    : new ethers.providers.JsonRpcProvider(GNOSIS_OPTIMISM);

const pKey =
  process.env.MODE == 'development' ? process.env.DEV_PRIVATE_KEY : process.env.PROD_PRIVATE_KEY;

if (!pKey) throw new Error('Private key not found');

const wallet = new ethers.Wallet(pKey, provider);

const faucet = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, wallet);

const logStats = async function () {
    console.log('faucet address', FAUCET_ADDRESS);
    console.log(`faucet owner`, await faucet.getOwner());
    const balance = await faucet.getBalance();
    console.log(`faucet balance`, ethers.utils.formatEther(balance));
    console.log(`faucet drip`, ethers.utils.formatEther(await faucet.getDripAmount()));
}
const sendDrip = async function (addresss) {
  const balance = await faucet.getBalance();
  console.log();
  if (balance.lte(1)) {
    const eth = '20';
    throw new Error('balance too low');
  }
  console.log(`player balance`, ethers.utils.formatEther(await provider.getBalance(addresss)));
  const dripTx = await faucet.drip(addresss);
  await dripTx.wait();
  console.log(
    `player balance after drip`,
    ethers.utils.formatEther(await provider.getBalance(addresss))
  );
};

const app = express();
app.use(cors());
const port = 3000;

app.get('/', async (req, res) => {
  res.send('Hello dfdao friends!');
});

app.get('/drip/:address', async (req, res) => {
  let address = req.params.address;

  if (!ethers.utils.isAddress(req.params.address))
    res.status(500).send(`address ${req.params.address} is not valid`);

  try {
    await sendDrip(address);
    res.status(200).send();
  } catch (error) {
    console.log('sendDrip error', error);
    res.status(500).send(JSON.stringify(error));
  }
  return;
});

app.listen(port, async () => {
  console.log(`dfdao faucet listening on port ${port}`);
  await logStats();
});
