function signupEmailTemplate(name, email, accountType) {

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
                  Welcome to Study Notion 🎉
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
                Your account has been successfully created.
              </td>
            </tr>

            <!-- Account Info Box -->
            <tr>
              <td align="center" style="padding:20px 0;">

                <table width="100%" style="
                  background:#f9fafb;
                  border:1px solid #e5e7eb;
                  border-radius:8px;
                  padding:15px;
                ">

                  <tr>
                    <td style="
                      font-size:13px;
                      color:#6b7280;
                      padding:6px 0;
                    ">
                      Name:
                    </td>

                    <td style="
                      font-size:13px;
                      color:#111827;
                      font-weight:500;
                      padding:6px 0;
                    ">
                      ${name}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      font-size:13px;
                      color:#6b7280;
                      padding:6px 0;
                    ">
                      Email:
                    </td>

                    <td style="
                      font-size:13px;
                      color:#111827;
                      font-weight:500;
                      padding:6px 0;
                    ">
                      ${email}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      font-size:13px;
                      color:#6b7280;
                      padding:6px 0;
                    ">
                      Account Type:
                    </td>

                    <td style="
                      font-size:13px;
                      color:#2563eb;
                      font-weight:600;
                      padding:6px 0;
                    ">
                      ${accountType}
                    </td>
                  </tr>

                </table>

              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding:20px 0;">

                <a href="https://studynotion-edtech-project.vercel.app" style="
                  background:#2563eb;
                  color:#ffffff;
                  padding:12px 26px;
                  border-radius:8px;
                  text-decoration:none;
                  font-size:14px;
                  font-weight:600;
                ">
                  Go to Dashboard
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

module.exports = signupEmailTemplate;
