const UAParser = require("ua-parser-js");
const DeviceDetector = require("device-detector-js");
const axios = require("axios");

function getClientIP(req) {

  let ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    null;

  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0];
  }

  if (ip === "::1") {
    ip = "127.0.0.1";
  }


  if (ip && ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  return ip;
}


function getDeviceDetails(req) {

  const userAgent = req.headers["user-agent"];

  const parser = new UAParser(userAgent);

  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  const detector = new DeviceDetector();

  const deviceData = detector.parse(userAgent);

  let browserName = browser.name || "Unknown Browser";

 
  if (userAgent.includes("Brave")) {
    browserName = "Brave";
  }

  if (userAgent.includes("Edg")) {
    browserName = "Microsoft Edge";
  }

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browserName = "Chrome";
  }

 
  let deviceType = "Desktop Computer";

  if (deviceData.device && deviceData.device.type) {
    deviceType = deviceData.device.type;
  }


  let deviceBrand = deviceData.device?.brand || os.name;

  return {

    browserName: browserName,
    browserVersion: browser.version,

    osName: os.name,
    osVersion: os.version,

    deviceType: deviceType,

    deviceBrand: deviceBrand,

    fullDeviceName: `${deviceBrand} ${deviceType}`,

  };

}


async function getAddressFromCoordinates(latitude, longitude) {

  try {

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "studynotion-app"
      },
       timeout: 3000
    });

    const data = response.data;

    return {
      fullAddress: data.display_name,
      city: data.address.city || data.address.town || data.address.village,
      state: data.address.state,
      country: data.address.country,
      pincode: data.address.postcode,
    };

  }
  catch (error) {

    console.log("Reverse geolocation error:", error.message);
    return null;

  }

}

module.exports = {
  getClientIP,
  getDeviceDetails,
  getAddressFromCoordinates
};