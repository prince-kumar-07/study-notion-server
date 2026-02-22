const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `Prince Kumar || Study Notion App`,
      to: `${email}`,
      subject: `${title}`,
     html: `${body}`
    })

    return info;

  } catch (error) {
    
    console.log(error.message);
  }
};

module.exports = mailSender;
