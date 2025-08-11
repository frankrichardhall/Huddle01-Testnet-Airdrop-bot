const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { generateChallenge, signMessage, login } = require('../services/authService');
const { getPreviewPeers, getRecorderStatus, createMeetingToken, getGeolocation, getSushiUrl, connectWebSocket, fetchRoomData, fetchPointsData, sendJoinRoomMessage } = require('../services/huddleService');

function buildPosthogCookie(){
  const distinctId = `01966e39-${uuidv4().slice(0, 12)}`;
  const sessionId  = `01966e39-${uuidv4().slice(0, 12)}`;
  return `ph_phc_3E8W7zxdzH9smLU2IQnfcElQWq1wJmPYUmGFUE75Rkx_posthog=%7B%22distinct_id%22%3A%22${distinctId}%22%2C%22%24sesid%22%3A%5B${Date.now()}%2C%22${sessionId}%22%2C${Date.now() - 10000}%5D%7D`;
}

async function joinMeeting(roomId, displayName, wallet, index, total){
  try{
    if(index === 0){ logger.banner(); }
    const accountNumber = index + 1;
    logger.info(`[Account ${accountNumber}/${total}] Joining room ${roomId} as ${displayName}`);
    logger.info(`Using random User-Agent to avoid detection`);

    logger.step(`[Account ${accountNumber}] Starting authentication process...`);
    const challenge = await generateChallenge(wallet.address);
    const signature = await signMessage(wallet, challenge);
    const posthogCookie = buildPosthogCookie();
    const tokens = await login(wallet, signature, posthogCookie);
    logger.success(`[Account ${accountNumber}] Authentication successful`);

    logger.step(`[Account ${accountNumber}] Preparing to join meeting...`);
    await getPreviewPeers(tokens.accessToken, posthogCookie, roomId);
    await getRecorderStatus(tokens.accessToken, posthogCookie, roomId);
    const meetingToken = await createMeetingToken(tokens.accessToken, displayName, posthogCookie, roomId);
    logger.success(`[Account ${accountNumber}] Meeting token created`);

    const geolocation = await getGeolocation();
    const sushiUrl = await getSushiUrl(meetingToken);
    logger.success(`[Account ${accountNumber}] Server connection ready`);

    logger.step(`[Account ${accountNumber}] Connecting to room...`);
    const ws = await connectWebSocket(sushiUrl, meetingToken, geolocation);

    await fetchRoomData(tokens.accessToken, posthogCookie, roomId);
    await fetchPointsData(wallet, tokens.accessToken, posthogCookie, roomId);
    sendJoinRoomMessage(ws, roomId);

    console.log();
    logger.success(`[Account ${accountNumber}] Bot is now active in the meeting`);
    logger.info(`[Account ${accountNumber}] Collecting testnet participation points...`);
    return ws;
  }catch(e){
    logger.error(`[Account ${index+1}] Error in joinMeeting: ${e.response?.data?.message || e.message}`);
    return null;
  }
}

module.exports = { joinMeeting };