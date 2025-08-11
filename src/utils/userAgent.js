function randomItem(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randomInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }

const chromeVersions = ['120.0.0.0','121.0.0.0','122.0.0.0','123.0.0.0','124.0.0.0','125.0.0.0','126.0.0.0','127.0.0.0','128.0.0.0'];
const firefoxVersions = ['120.0','121.0','122.0','123.0','124.0','125.0'];
const safariVersions = ['16.0','16.1','16.2','16.3','16.4','16.5','17.0'];
const edgeVersions = ['120.0.0.0','121.0.0.0','122.0.0.0','123.0.0.0','124.0.0.0','125.0.0.0'];
const braveVersions = ['130.0.0.0','131.0.0.0','132.0.0.0','133.0.0.0','134.0.0.0','135.0.0.0'];
const windowsVersions = ['10.0','11.0'];
const macosVersions = ['12_6_0','13_5_0','14_0_0'];
const linuxTypes = ['X11; Linux x86_64','X11; Ubuntu; Linux x86_64'];
const androidVersions = ['12.0','13.0','14.0'];
const iosVersions = ['16_0','16_4','17_0'];

function generateRandomUserAgent(){
  const browserTypes = [
    () => `Mozilla/5.0 (Windows NT ${randomItem(windowsVersions)}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomItem(chromeVersions)} Safari/537.36`,
    () => `Mozilla/5.0 (Macintosh; Intel Mac OS X ${randomItem(macosVersions)}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomItem(chromeVersions)} Safari/537.36`,
    () => `Mozilla/5.0 (${randomItem(linuxTypes)}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomItem(chromeVersions)} Safari/537.36`,
    () => `Mozilla/5.0 (Linux; Android ${randomItem(androidVersions)}; SM-${randomItem(['A','S','N'])}${randomInt(10,99)}${randomItem(['','U','F'])}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomItem(chromeVersions)} Mobile Safari/537.36`,
    () => `Mozilla/5.0 (Windows NT ${randomItem(windowsVersions)}; Win64; x64; rv:${randomItem(firefoxVersions)}) Gecko/20100101 Firefox/${randomItem(firefoxVersions)}`,
    () => `Mozilla/5.0 (Macintosh; Intel Mac OS X ${randomItem(macosVersions)}; rv:${randomItem(firefoxVersions)}) Gecko/20100101 Firefox/${randomItem(firefoxVersions)}`,
    () => `Mozilla/5.0 (Macintosh; Intel Mac OS X ${randomItem(macosVersions)}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${randomItem(safariVersions)} Safari/605.1.15`,
    () => `Mozilla/5.0 (${randomItem(['iPhone','iPad'])}; CPU OS ${randomItem(iosVersions)} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${randomItem(safariVersions)} Mobile/15E148 Safari/604.1`,
    () => `Mozilla/5.0 (Windows NT ${randomItem(windowsVersions)}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomItem(edgeVersions)} Safari/537.36 Edg/${randomItem(edgeVersions)}`,
    () => `Mozilla/5.0 (Windows NT ${randomItem(windowsVersions)}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomItem(braveVersions)} Safari/537.36 Brave/${randomItem(braveVersions)}`
  ];
  return randomItem(browserTypes)();
}

module.exports = { generateRandomUserAgent };