const { utils } = require('ethers');

function generateCryptoName(){
  const prefixes = ['0x','degen','crypto','web3','eth','btc','ape','gm','wagmi','hodl','fomo','dyor','ngmi','rekt','bull','bear','shill','fud','lambo','ser'];
  const suffixes = ['master','king','queen','lord','sniper','whale','maxi','farmer','miner','trader','dev','ninja','god','punk','dude','chad','guru','sifu','degen','killer'];
  const domains  = ['eth','crypto','bitcoin','nft','dao','defi','money','bank','wallet','x','btc'];
  const formats = [
    () => `${rand(prefixes)}${rand(suffixes)}`,
    () => `${rand(prefixes)}_${rand(suffixes)}`,
    () => `0x${utils.hexlify(utils.randomBytes(4)).slice(2,10)}`,
    () => `${rand(prefixes)}.${rand(domains)}`,
    () => `${rand(prefixes)}${Math.floor(Math.random()*1000)}`,
    () => `${rand(prefixes)}${rand(suffixes)}.${rand(domains)}`
  ];
  function rand(a){ return a[Math.floor(Math.random()*a.length)]; }
  return formats[Math.floor(Math.random()*formats.length)]();
}

module.exports = { generateCryptoName };