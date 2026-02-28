const loginEmailTemplate = require("../mail/templates/loginEmailTemplate")
const Profile = require("../model/Profile");
const axios = require("axios");

async function postLoginHandler(data){

   console.time("POST_LOGIN_TIME");

  const { latitude, longitude, user, deviceInfo } = data

    // const user = await User.findOne({ email }).populate("additionalDetails");

    let locationData = null
    
        if (latitude && longitude) {
          const address = await getAddressFromCoordinates(latitude, longitude);
    
          locationData = {
            latitude,
            longitude,
            fullAddress: address?.fullAddress || null,
            city: address?.city || null,
            state: address?.state || null,
            country: address?.country || null,
            pincode: address?.pincode || null,
          };
        }

          // console.log("Location:", locationData);

        // const deviceInfo = getDeviceDetails(req);
        // deviceInfo.ipAddress = getClientIP(req);
        
       if (!user?.additionalDetails?._id) return;

        await Profile.findByIdAndUpdate(user.additionalDetails._id, {
          $push: {
            loginHistory: {
              $each: [
                {
                  ...deviceInfo,
                  location: locationData,
                },
              ],
              $slice: -2,
            },
          },
        });

        //  await sendEmail(
        //   user.email,
        //   user.firstName + " " + user.lastName,
        //   "New Login Detected, - Study Notion",
        //   loginEmailTemplate(
        //     user.firstName + " " + user.lastName,
        //     user.email,
        //     deviceInfo,
        //   ),
        // );
     console.timeEnd("POST_LOGIN_TIME");

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


module.exports = postLoginHandler