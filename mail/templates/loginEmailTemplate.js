function loginAlertEmailTemplate(name, email, deviceInfo) {

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

          <table width="500" cellpadding="0" cellspacing="0" style="
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
                  font-size:24px;
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
                  New Login Detected
                </h2>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td align="center" style="
                padding-top:15px;
                font-size:14px;
                color:#374151;
              ">
                Hello <b>${name}</b>,
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td align="center" style="
                padding-top:10px;
                font-size:14px;
                color:#6b7280;
                line-height:22px;
              ">
                A new login to your account <b>${email}</b> was detected.
              </td>
            </tr>

            <!-- Device Info Card -->
            <tr>
              <td style="padding-top:25px;">

                <table width="100%" style="
                  background:#f9fafb;
                  border:1px solid #e5e7eb;
                  border-radius:10px;
                  padding:20px;
                ">

                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">IP Address:</td>
                    <td style="padding:6px 0;color:#111827;font-weight:500;">
                      ${deviceInfo.ipAddress}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Browser:</td>
                    <td style="padding:6px 0;color:#111827;font-weight:500;">
                      ${deviceInfo.browserName} ${deviceInfo.browserVersion}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Operating System:</td>
                    <td style="padding:6px 0;color:#111827;font-weight:500;">
                      ${deviceInfo.osName} ${deviceInfo.osVersion}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Device Type:</td>
                    <td style="padding:6px 0;color:#111827;font-weight:500;">
                      ${deviceInfo.deviceType}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Device:</td>
                    <td style="padding:6px 0;color:#111827;font-weight:500;">
                      ${deviceInfo.deviceBrand} 
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Time:</td>
                    <td style="padding:6px 0;color:#111827;font-weight:500;">
                      ${new Date().toLocaleString()}
                    </td>
                  </tr>

                </table>

              </td>
            </tr>

            <!-- Security Warning -->
            <tr>
              <td align="center" style="
                padding-top:20px;
                font-size:13px;
                color:#dc2626;
              ">
                If this wasn't you, please reset your password immediately.
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding-top:20px;">

                <a href="https://studynotion-edtech-project.vercel.app/reset-password"
                  style="
                    background:#dc2626;
                    color:#ffffff;
                    padding:12px 24px;
                    border-radius:8px;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:600;
                  ">
                  Secure Your Account
                </a>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="
                padding-top:25px;
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

module.exports = loginAlertEmailTemplate;
