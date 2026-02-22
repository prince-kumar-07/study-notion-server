function passwordUpdatedTemplate(email, name) {

  return `

  <div style="
    margin:0;
    padding:0;
    background-color:#f3f4f6;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="480" cellpadding="0" cellspacing="0" style="
            background:#ffffff;
            border-radius:12px;
            box-shadow:0 8px 30px rgba(0,0,0,0.08);
            padding:40px;
          ">

            <!-- Logo -->
            <tr>
              <td align="center">
                <h1 style="
                  margin:0;
                  font-size:22px;
                  color:#2563eb;
                  font-weight:700;
                ">
                  Study Notion
                </h1>
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td align="center" style="padding-top:20px;">
                <h2 style="
                  margin:0;
                  font-size:20px;
                  color:#111827;
                  font-weight:600;
                ">
                  Password Updated Successfully
                </h2>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="
                padding-top:20px;
                font-size:14px;
                color:#374151;
                text-align:center;
              ">
                Hello <b>${name}</b>,
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="
                padding-top:10px;
                font-size:14px;
                color:#6b7280;
                text-align:center;
                line-height:22px;
              ">
                Your password has been successfully updated for the account:
              </td>
            </tr>

            <!-- Email box -->
            <tr>
              <td align="center" style="padding:20px 0;">
                <div style="
                  background:#f9fafb;
                  border:1px solid #e5e7eb;
                  padding:10px 18px;
                  border-radius:8px;
                  font-size:14px;
                  color:#111827;
                  font-weight:500;
                ">
                  ${email}
                </div>
              </td>
            </tr>

            <!-- Security warning -->
            <tr>
              <td style="
                font-size:13px;
                color:#dc2626;
                text-align:center;
                line-height:20px;
              ">
                If you did not request this change, please contact support immediately.
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:20px 0;">
                <hr style="border:none;border-top:1px solid #e5e7eb;">
              </td>
            </tr>

            <!-- Support -->
            <tr>
              <td align="center" style="
                font-size:13px;
                color:#6b7280;
              ">
                Need help? Contact us at
                <br>
                <a href="mailto:support@studynotion.com" style="
                  color:#2563eb;
                  text-decoration:none;
                  font-weight:500;
                ">
                  support@studynotion.com
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="
                padding-top:20px;
                font-size:12px;
                color:#9ca3af;
              ">
                © ${new Date().getFullYear()} Study Notion. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>

  `;

}

module.exports = passwordUpdatedTemplate;
