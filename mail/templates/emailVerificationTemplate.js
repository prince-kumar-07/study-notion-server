function emailOtpTemplate(otp) {

  return `

  <div style="
    margin:0;
    padding:0;
    background-color:#f3f4f6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Card -->
          <table width="480" cellpadding="0" cellspacing="0" style="
            background:#ffffff;
            border-radius:12px;
            box-shadow:0 8px 30px rgba(0,0,0,0.08);
            padding:40px;
          ">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
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
              <td align="center">
                <h2 style="
                  margin:0;
                  font-size:20px;
                  color:#111827;
                  font-weight:600;
                ">
                  Verify Your Email
                </h2>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td align="center" style="
                padding-top:12px;
                color:#6b7280;
                font-size:14px;
                line-height:22px;
              ">
                Use the following verification code to complete your signup.
              </td>
            </tr>

            <!-- OTP BOX -->
            <tr>
              <td align="center" style="padding:30px 0;">

                <div style="
                  display:inline-block;
                  padding:14px 28px;
                  font-size:32px;
                  font-weight:700;
                  letter-spacing:8px;
                  color:#2563eb;
                  background:#eff6ff;
                  border-radius:8px;
                  border:1px solid #dbeafe;
                ">
                  ${otp}
                </div>

              </td>
            </tr>

            <!-- Expiry -->
            <tr>
              <td align="center" style="
                font-size:13px;
                color:#9ca3af;
              ">
                This code will expire in 5 minutes.
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:20px 0;">
                <hr style="
                  border:none;
                  border-top:1px solid #e5e7eb;
                ">
              </td>
            </tr>

            <!-- Security Message -->
            <tr>
              <td align="center" style="
                font-size:12px;
                color:#9ca3af;
                line-height:20px;
              ">
                If you didn't request this, you can safely ignore this email.
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="
                padding-top:20px;
                font-size:12px;
                color:#d1d5db;
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

module.exports = emailOtpTemplate;
