const axios = require("axios");

async function sendEmail(reciverEmail, reciverName, emailSubject, emailBody) {
  try {
     await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Prince Kumar || Study Notion App",
          email: "piwari012@gmail.com"
        },
        to: [
          {
            email:reciverEmail,
            name:reciverName
          }
        ],
        subject:emailSubject,
        htmlContent:emailBody
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    return true;
    // console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return false;
  }
}

module.exports = sendEmail;

