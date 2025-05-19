const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const privateKey = process.env.PRIVATE_KEY;
const tokenAddress = process.env.TOKEN_ADDRESS;
const walletAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;

const minABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  },
  // transfer
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function"
  }
];

const tokenContract = new web3.eth.Contract(minABI, tokenAddress);

async function sendUSDT(to, amount) {
  try {
    const decimals = 18;
    const value = web3.utils.toBN(amount).mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));

    const tx = {
      from: walletAddress,
      to: tokenAddress,
      gas: 100000,
      data: tokenContract.methods.transfer(to, value).encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt.transactionHash;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

module.exports = sendUSDT;
