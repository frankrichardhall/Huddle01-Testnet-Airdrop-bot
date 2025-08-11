const axios = require('axios');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { getHeaders } = require('../config');
const logger = require('../utils/logger');

async function getPreviewPeers(accessToken, posthogCookie, roomId){
  try{
    logger.loading(`Fetching preview peers for room ${roomId}...`);
    const res = await axios.get(
      `https://huddle01.app/api/v2/platform/api/v2/web/getPreviewPeersInternal/${roomId}`,
      { headers: { ...getHeaders(), cookie: `accessToken=${accessToken}; ${posthogCookie}`, Referer: `https://huddle01.app/room/${roomId}/lobby`, 'Referrer-Policy': 'strict-origin-when-cross-origin' } }
    );
    return res.data;
  }catch(e){
    logger.error(`Failed to get preview peers: ${e.response?.data?.message || e.message}`);
    throw e;
  }
}

async function getRecorderStatus(accessToken, posthogCookie, roomId){
  try{
    logger.loading('Checking recorder status...');
    const res = await axios.get(
      `https://huddle01.app/api/v2/platform/api/v2/recorder/status?roomId=${roomId}`,
      { headers: { ...getHeaders(), cookie: `accessToken=${accessToken}; ${posthogCookie}`, Referer: `https://huddle01.app/room/${roomId}/lobby`, 'Referrer-Policy': 'strict-origin-when-cross-origin' } }
    );
    return res.data;
  }catch(e){
    logger.error(`Failed to get recorder status: ${e.response?.data?.message || e.message}`);
    throw e;
  }
}

async function createMeetingToken(accessToken, displayName, posthogCookie, roomId){
  try{
    logger.loading('Creating meeting token...');
    const res = await axios.post(
      `https://huddle01.app/api/v2/platform/api/v2/create-meeting-token`,
      { roomId, metadata: { displayName, avatarUrl: 'https://web-assets.huddle01.media/avatars/0.png' } },
      { headers: { ...getHeaders(), cookie: `accessToken=${accessToken}; ${posthogCookie}`, Referer: `https://huddle01.app/room/${roomId}/lobby`, 'Referrer-Policy': 'strict-origin-when-cross-origin' } }
    );
    return res.data.token;
  }catch(e){
    logger.error(`Failed to create meeting token: ${e.response?.data?.message || e.message}`);
    throw e;
  }
}

async function getGeolocation(){
  try{
    logger.loading('Fetching geolocation data...');
    const res = await axios.get('https://shinigami.huddle01.com/api/get-geolocation', { headers: { ...getHeaders(), Referer: 'https://huddle01.app/', 'Referrer-Policy': 'strict-origin-when-cross-origin' } });
    logger.info(`Location: ${res.data.country} (${res.data.globalRegion})`);
    return res.data;
  }catch(e){
    logger.error(`Failed to get geolocation: ${e.response?.data?.message || e.message}`);
    throw e;
  }
}

async function getSushiUrl(meetingToken){
  try{
    logger.loading('Getting Sushi server URL...');
    const res = await axios.get('https://apira.huddle01.media/api/v1/getSushiUrl', { headers: { ...getHeaders(), authorization: `Bearer ${meetingToken}`, Referer: 'https://huddle01.app/', 'Referrer-Policy': 'strict-origin-when-cross-origin' } });
    return res.data.url;
  }catch(e){
    logger.error(`Failed to get Sushi URL: ${e.response?.data?.message || e.message}`);
    throw e;
  }
}

function connectWebSocket(sushiUrl, meetingToken, geolocation){
  logger.loading('Connecting to WebSocket server...');
  const wsUrl = `${sushiUrl}/ws?token=${meetingToken}&version=core@2.3.5,react@2.3.6®ion=${geolocation.globalRegion}&country=${geolocation.country}`;
  const ws = new WebSocket(wsUrl, { headers: { 'accept-language': 'en-US,en;q=0.7', 'cache-control': 'no-cache', 'pragma': 'no-cache', 'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits', 'sec-websocket-key': Buffer.from(uuidv4()).toString('base64'), 'sec-websocket-version': '13', 'User-Agent': getHeaders()['User-Agent'] } });
  return new Promise((resolve) => {
    ws.on('open', () => {
      logger.success('Connected to Huddle01 WebSocket');
      let joined = false;
      let joinTimeout = setTimeout(() => { if (!joined) { logger.warn('Timed out waiting for join confirmation, proceeding anyway'); } resolve(ws); }, 10000);
      ws.on('message', (data) => {
        const message = data.toString();
        try{
          const jsonMsg = JSON.parse(message);
          if (jsonMsg.type === 'peer-join' || (jsonMsg.type === 'cmd' && jsonMsg.data && jsonMsg.data.name === 'join-room-done')){
            logger.success('Successfully joined the room!');
            joined = true; clearTimeout(joinTimeout); resolve(ws);
          }
        }catch(_){/* ignore non-JSON */}
      });
    });
    ws.on('error', (err) => logger.error(`WebSocket error: ${err.message}`));
    ws.on('close', () => logger.warn('WebSocket connection closed'));
  });
}

async function fetchRoomData(accessToken, posthogCookie, roomId){
  try{
    logger.loading('Fetching room data...');
    await axios.get(
      `https://huddle01.app/room/_next/data/H3CDrjpx5azzh2ccQTXr1/en/${roomId}.json?roomId=${roomId}`,
      { headers: { ...getHeaders(), 'x-nextjs-data': '1', cookie: `accessToken=${accessToken}; refreshToken=${accessToken}; ${posthogCookie}`, Referer: `https://huddle01.app/room/${roomId}/lobby` } }
    );
    return true;
  }catch(e){
    logger.error(`Failed to fetch room data: ${e.response?.data?.message || e.message}`);
    return false;
  }
}

async function fetchPointsData(wallet, accessToken, posthogCookie, roomId){
  try{
    logger.loading('Fetching points data...');
    await axios.get(
      `https://huddle01.app/room/api/trpc/hps.getPoints?batch=1&input=%7B%220%22%3A%7B%22walletAddress%22%3A%22${wallet.address}%22%7D%7D`,
      { headers: { ...getHeaders(), cookie: `accessToken=${accessToken}; refreshToken=${accessToken}; ${posthogCookie}`, Referer: `https://huddle01.app/room/${roomId}` } }
    );
    return true;
  }catch(e){
    logger.error(`Failed to fetch points data: ${e.response?.data?.message || e.message}`);
    return false;
  }
}

function sendJoinRoomMessage(ws, roomId){
  try{
    logger.loading('Sending join room request...');
    ws.send(JSON.stringify({ type: 'cmd', data: { name: 'join-room', payload: { roomId, role: 'viewer' } } }));
    setTimeout(() => {
      logger.loading('Enabling audio...');
      ws.send(JSON.stringify({ type: 'cmd', data: { name: 'enable-audio', payload: {} } }));
      logger.success('Audio enabled');
    }, 2000);
    return true;
  }catch(e){
    logger.error(`Failed to send join message: ${e.message}`);
    return false;
  }
}

module.exports = {
  getPreviewPeers,
  getRecorderStatus,
  createMeetingToken,
  getGeolocation,
  getSushiUrl,
  connectWebSocket,
  fetchRoomData,
  fetchPointsData,
  sendJoinRoomMessage
};
