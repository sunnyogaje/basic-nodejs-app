require('dotenv').config();
const { ethers } = require('ethers');

const sendUSDT = async (recipient, amount) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const tokenAddress = '0x55d398326f99059fF775485246999027B3197955'; // BEP-20 USDT (BSC)
    const tokenAbi = [
      "function transfer(address to, uint amount) returns (bool)",
      "function decimals() view returns (uint8)"
    ];

    const contract = new ethers.Contract(tokenAddress, tokenAbi, wallet);
    const decimals = await contract.decimals();
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);

    const tx = await contract.transfer(recipient, parsedAmount);
    await tx.wait();

    console.log(`✅ USDT sent! Tx hash: ${tx.hash}`);
    return { success: true, txHash: tx.hash };

  } catch (error) {
    console.error('❌ Error sending USDT:', error);
    return { success: false, error: error.message };
  }
};

module.exports = sendUSDT;