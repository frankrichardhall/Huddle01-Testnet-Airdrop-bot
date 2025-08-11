const { generateRandomUserAgent } = require('../utils/userAgent');

const BASE_URL = 'https://huddle01.app/api/v2/platform/api/v2';

function getHeaders(){
  return {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.7',
    'content-type': 'application/json',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'sec-gpc': '1',
    'User-Agent': generateRandomUserAgent(),
    'Accept-Encoding': 'gzip, compress, deflate, br'
  };
}

module.exports = { BASE_URL, getHeaders };