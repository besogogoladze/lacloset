export const emailTemplate = ({
  title,
  subtitle,
  code,
  footerNote = "This code expires in 5 minutes.",
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>

<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 10px;">
        <table width="100%" style="max-width:420px; background:#ffffff; border-radius:12px; padding:30px; box-shadow:0 10px 25px rgba(0,0,0,.08);">

          <tr>
            <td align="center">
              <h1 style="margin:0; color:#111827; font-size:22px;">
                ${title}
              </h1>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 0;">
              <p style="margin:0; color:#4b5563; font-size:14px;">
                ${subtitle}
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 0;">
              <div style="
                display:inline-block;
                padding:14px 28px;
                background:#111827;
                color:#ffffff;
                font-size:26px;
                font-weight:bold;
                letter-spacing:6px;
                border-radius:8px;">
                ${code}
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:20px;">
              <p style="margin:0; color:#6b7280; font-size:12px;">
                ${footerNote}
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:30px;">
              <p style="margin:0; color:#9ca3af; font-size:11px;">
                If you didn’t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
