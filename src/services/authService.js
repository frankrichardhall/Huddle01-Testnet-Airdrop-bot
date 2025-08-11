const axios = require('axios');
const { utils } = require('ethers');
const { BASE_URL, getHeaders } = require('../config');
const logger = require('../utils/logger');

async function generateChallenge(address){
  try{
    logger.loading(`Generating challenge for ${address.substring(0,6)}...${address.substring(38)}`);
    const res = await axios.post(
      `${BASE_URL}/auth/wallet/generateChallenge`,
      { walletAddress: address },
      { headers: getHeaders() }
    );
    if(!res.data.signingMessage) throw new Error('signingMessage not found');
    return res.data;
  }catch(e){
    logger.error(`Challenge generation failed: ${e.response?.data?.message || e.message}`);
    throw e;
  }
}

async function signMessage(wallet, challenge){
  const message = challenge.signingMessage;
  try{
    logger.loading('Signing authentication message...');
    const signature = await wallet.signMessage(message);
    const recovered = utils.verifyMessage(message, signature);
    if(recovered.toLowerCase() !== wallet.address.toLowerCase()){
      throw new Error('Signature verification failed');
    }
    return signature;
  }catch(e){
    logger.error(`Signing failed: ${e.message}`);
    throw e;
  }
}

async function login(wallet, signature, posthogCookie){
  try{
    logger.loading('Logging in to Huddle01...');
    const res = await axios.post(
      `${BASE_URL}/auth/wallet/login`,
      { address: wallet.address, signature, chain: 'eth', wallet: 'metamask', dashboardType: 'personal' },
      { headers: { ...getHeaders(), cookie: posthogCookie } }
    );
    return res.data.tokens;
  }catch(e){
    logger.error(`Login failed: ${e.response?.data?.message || e.message}`);
    throw e;
  }
}

module.exports = { generateChallenge, signMessage, login };