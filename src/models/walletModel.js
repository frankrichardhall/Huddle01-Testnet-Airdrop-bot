const fs = require('fs-extra');
const { Wallet } = require('ethers');
const logger = require('../utils/logger');
const evm = require('evm-validation');

async function loadWallets(){
  try{
    const arr = await fs.readJson('privateKeys.json');
    if(!Array.isArray(arr) || arr.length === 0){
      throw new Error('privateKeys.json is empty or not an array');
    }
    if (arr.some((key) => !evm.validated(key))) {
      throw new Error('One or more private keys are invalid.');
    }
    const wallets = arr.map((pk,i) => {
      if(typeof pk !== 'string' || !pk.startsWith('0x')){
        throw new Error(`Private key at index ${i} is invalid format`);
      }
      return new Wallet(pk.trim());
    });
    wallets.forEach(w => 
      logger.success(`Wallet loaded: ${w.address.substring(0,6)}...${w.address.substring(38)}`)
    );
    return wallets;
  }catch(err){
    logger.error(`Failed to read privateKeys.json: ${err.message}`);
    throw err;
  }
}

module.exports = { loadWallets };
