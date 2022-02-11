// On POST with url, parse address and drip from mnemonic

const DEPLOYER_MNEMONIC = 'change typical hire slam amateur loan grid fix drama electric seed label';

const express = require('express')
const ethers = require('ethers');
const cors = require('cors')
const PORT = 8000;

const app = express()

app.use(cors({
    origin: '*'
}));

app.get('/', async (req, res) => {

    const address = req.query.address;
    const rpc = req.query.rpc;
    const ether = req.query.ether ? req.query.ether : '20';
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    if(ethers.utils.isAddress(address) && provider) {
        try {
            let wallet = ethers.Wallet.fromMnemonic(DEPLOYER_MNEMONIC);
            wallet = wallet.connect(provider);
            const tx = await wallet.sendTransaction({
                to: address,
                value: ethers.utils.parseEther(ether)
            });
            console.log(`successfully sent ${address} ${ether} ether`);
            res.status(200).send(`successfully sent ${address} ${ether} ether`);
            
        } catch (error) {
            res.status(400).send(error);
        }
    }
    else {
        res.status(400).send('parameter error in address or rpc');       

    }
})

app.listen(PORT, function() {
    console.log('Server is listening on port', PORT)
});