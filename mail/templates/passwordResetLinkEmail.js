function passwordResetLinkEmail(url) {

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
                  Reset Your Password
                </h2>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td align="center" style="
                padding-top:12px;
                font-size:14px;
                color:#6b7280;
                line-height:22px;
              ">
                Click the button below to reset your password.
                This link will expire in 5 minutes.
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding:30px 0;">

                <a href="${url}" style="
                  background:#2563eb;
                  color:#ffffff;
                  padding:12px 24px;
                  border-radius:8px;
                  text-decoration:none;
                  font-size:14px;
                  font-weight:600;
                  display:inline-block;
                ">
                  Reset Password
                </a>

              </td>
            </tr>

            <!-- Fallback link -->
            <tr>
              <td align="center" style="
                font-size:12px;
                color:#9ca3af;
                word-break:break-all;
              ">
                Or copy and paste this link into your browser:
                <br>
                <a href="${url}" style="color:#2563eb;">
                  ${url}
                </a>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:20px 0;">
                <hr style="border:none;border-top:1px solid #e5e7eb;">
              </td>
            </tr>

            <!-- Security message -->
            <tr>
              <td align="center" style="
                font-size:12px;
                color:#9ca3af;
                line-height:20px;
              ">
                If you didn’t request a password reset, you can safely ignore this email.
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

module.exports = passwordResetLinkEmail;
