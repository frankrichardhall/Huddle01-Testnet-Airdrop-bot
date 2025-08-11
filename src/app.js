const readline = require('readline');
const logger = require('./utils/logger');
const { loadWallets } = require('./models/walletModel');
const { generateCryptoName } = require('./utils/names');
const { joinMeeting } = require('./controllers/botController');

(async function start(){
  try{
    logger.banner();
    console.log(`${logger.colors.white}Welcome to the Huddle01 Testnet Airdrop bot!${logger.colors.reset}`);
    console.log(`${logger.colors.white}This bot will help you join Huddle01 meetings and collect testnet points.${logger.colors.reset}`);
    console.log();

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const roomId = await new Promise(resolve => rl.question(`${logger.colors.cyan}Enter room ID (e.g. llb-bnxg-hfg): ${logger.colors.reset}`, resolve));

    const wallets = await loadWallets();
    const maxAccounts = wallets.length;

    const accountCount = await new Promise(resolve => {
      rl.question(`${logger.colors.cyan}Enter number of accounts to USE (max ${maxAccounts} from privateKeys.json): ${logger.colors.reset}`, ans => {
        const n = parseInt(ans)||1; resolve(Math.max(1, Math.min(n, maxAccounts))); });
    });
    rl.close();

    const connections = [];
    for(let i=0; i<accountCount; i++){
      const displayName = generateCryptoName();
      const ws = await joinMeeting(roomId, displayName, wallets[i], i, accountCount);
      if(ws) connections.push(ws);
      if(i < accountCount-1){ await new Promise(r => setTimeout(r, 3000)); }
    }

    if(connections.length>0){
      console.log();
      logger.success(`Successfully connected ${connections.length} accounts to the meeting!`);
      console.log(`${logger.colors.yellow}Press Ctrl+C to exit${logger.colors.reset}`);
      process.on('SIGINT', () => {
        console.log();
        logger.warn('Closing all WebSocket connections and exiting...');
        connections.forEach(ws => ws.close());
        logger.success('Thanks for using Huddle Testnet Airdrop bot!');
        process.exit();
      });
    }else{
      logger.error('Failed to connect any accounts to the meeting');
      process.exit(1);
    }
  }catch(e){
    logger.error(`Fatal: ${e.message}`);
    process.exit(1);
  }
})();
