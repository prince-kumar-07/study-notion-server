function accountDeleteRequestTemplate(name, email, deleteDate) {

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

            <!-- Brand -->
            <tr>
              <td align="center">
                <h1 style="
                  margin:0;
                  font-size:24px;
                  color:#dc2626;
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
                  Account Deletion Requested
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
                We received a request to delete your Study Notion account.
              </td>
            </tr>

            <!-- Info Box -->
            <tr>
              <td align="center" style="padding:20px 0;">

                <div style="
                  background:#fef2f2;
                  border:1px solid #fecaca;
                  padding:15px;
                  border-radius:8px;
                  font-size:14px;
                  color:#991b1b;
                ">

                  Your account associated with
                  <br>
                  <b>${email}</b>
                  <br><br>

                  is scheduled for permanent deletion on:
                  <br>
                  <b>${deleteDate}</b>

                </div>

              </td>
            </tr>

            <!-- Warning -->
            <tr>
              <td align="center" style="
                font-size:13px;
                color:#dc2626;
                line-height:20px;
              ">
                If this request was not made by you, please secure your account immediately.
              </td>
            </tr>

            <!-- Cancel Button -->
            <tr>
              <td align="center" style="padding-top:25px;">

                <a href="https://studynotion-edtech-project.vercel.app/settings"
                  style="
                    background:#2563eb;
                    color:#ffffff;
                    padding:12px 24px;
                    border-radius:8px;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:600;
                  ">
                  Cancel Deletion
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

module.exports = accountDeleteRequestTemplate;
