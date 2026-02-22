const removeAccountDeletionTemplate = (name, email) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Account Deletion Cancelled</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      }
      .header {
        font-size: 20px;
        font-weight: bold;
        color: #1a73e8;
        margin-bottom: 20px;
      }
      .content {
        font-size: 15px;
        color: #333;
        line-height: 1.6;
      }
      .highlight {
        font-weight: bold;
        color: #111;
      }
      .footer {
        margin-top: 30px;
        font-size: 13px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Account Deletion Cancelled Successfully
      </div>

      <div class="content">
        Hello <span class="highlight">${name}</span>,<br/><br/>

        This is a confirmation that the scheduled deletion of your account has been successfully cancelled.<br/><br/>

        Your account associated with the email:<br/>
        <span class="highlight">${email}</span><br/><br/>

        is now fully active and accessible.<br/><br/>

        If you did not request this action or believe this was done in error, please contact our support team immediately.<br/><br/>

        Thank you for continuing to use our platform.
      </div>

      <div class="footer">
        Regards,<br/>
        Study Notion Team
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = removeAccountDeletionTemplate;
