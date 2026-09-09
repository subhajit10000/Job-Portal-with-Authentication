const nodemailer = require("nodemailer");

let transporter = null;

// Lazily created so a missing SMTP config doesn't crash server boot —
// it only throws when an email actually needs to be sent.
const getTransporter = () => {
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        throw new Error(
            "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in .env"
        );
    }

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: Number(SMTP_PORT) === 465, // true for port 465, false for 587/25
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    return transporter;
};

/**
 * Table-based HTML email. This intentionally avoids the things that break in
 * Outlook desktop (Word rendering engine) and get stripped by Gmail:
 *  - no position:absolute/relative
 *  - no inline <svg>
 *  - no CSS gradients relied on as the *only* background (solid bgcolor fallback everywhere)
 *  - width controlled via a fixed-width <table>, not div max-width
 *  - MSO conditional comments to force Outlook to respect the 540px width
 */
const otpEmailTemplate = ({ name, otp, expiryMinutes, appUrl = "#" }) => `
<div style="margin:0; padding:0; background-color:#eef2ff;">
<!--[if mso]>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
<table role="presentation" width="540" cellpadding="0" cellspacing="0" border="0">
<tr><td>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eef2ff;">
  <tr>
    <td align="center" style="padding:48px 16px;">
      <table role="presentation" width="540" cellpadding="0" cellspacing="0" border="0" style="width:540px; max-width:540px; background-color:#ffffff; border-radius:28px; overflow:hidden; border:1px solid #efedff; font-family:'Segoe UI',Roboto,Arial,sans-serif;">

        <!-- Header -->
        <tr>
          <td align="center" bgcolor="#4f46e5" style="background-color:#4f46e5; background-image:linear-gradient(135deg,#1e1b4b 0%,#312e81 25%,#4f46e5 55%,#7c3aed 80%,#c026d3 100%); padding:44px 28px 34px;">
            <h1 style="margin:0; color:#ffffff; font-size:29px; line-height:1.2; font-weight:800; letter-spacing:-0.8px;">
              HirePath
            </h1>
            <p style="margin:9px 0 0; color:#ffffff; font-size:13px; letter-spacing:0.6px; text-transform:uppercase;">
              Your career journey starts here
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
              <tr>
                <td bgcolor="#6b63d6" style="background-color:#6b63d6; border-radius:999px; padding:6px 16px; color:#ffffff; font-size:11px; font-weight:700; letter-spacing:0.5px;">
                  STEP 1 OF 2 &nbsp;&middot;&nbsp; EMAIL VERIFICATION
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:34px 30px 30px;">

            <!-- Verification icon -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="68" height="68" align="center" valign="middle" bgcolor="#eef2ff" style="background-color:#eef2ff; border-radius:50%; color:#4f46e5; font-size:30px; border:1px solid #e4e0ff;">
                        &#10003;
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <h2 style="margin:0 0 10px; text-align:center; color:#18152b; font-size:25px; font-weight:750; letter-spacing:-0.5px;">
              Verify your email
            </h2>

            <p style="margin:0 0 26px; text-align:center; color:#68627c; font-size:14px; line-height:1.7;">
              Hi <strong style="color:#312e81;">${name || "there"}</strong>,
              use the verification code below to confirm your email address
              and complete your HirePath account setup.
            </p>

            <!-- OTP box -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f3ff" style="background-color:#f5f3ff; border:1px solid #e4e0ff; border-radius:20px;">
              <tr>
                <td align="center" style="padding:26px 18px;">
                  <p style="margin:0 0 14px; color:#77718e; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;">
                    Your verification code
                  </p>

                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff; border-radius:16px; border:1px solid #ddd9ff;">
                    <tr>
                      <td style="padding:16px 24px;">
                        <span style="color:#4f46e5; font-size:34px; line-height:1; font-weight:800; letter-spacing:10px;">
                          ${otp}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" width="220" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">
                    <tr>
                      <td bgcolor="#e4e0ff" style="background-color:#e4e0ff; border-radius:999px; height:6px; font-size:0; line-height:0;">
                        <table role="presentation" width="78%" cellpadding="0" cellspacing="0" border="0">
                          <tr><td bgcolor="#4f46e5" style="background-color:#4f46e5; border-radius:999px; height:6px; font-size:0; line-height:0;">&nbsp;</td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:12px 0 0; color:#8b849f; font-size:12px;">
                    This code expires in
                    <strong style="color:#4f46e5;">${expiryMinutes} minutes</strong>
                  </p>
                </td>
              </tr>
            </table>

            <p style="margin:12px 0 0; text-align:center; color:#a39dbb; font-size:11px; letter-spacing:0.2px;">
              Tip: this code is case-sensitive and works only once.
            </p>

            <!-- Security note -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="background-color:#f8fafc; border:1px solid #e8eaf0; border-radius:14px; margin-top:22px;">
              <tr>
                <td style="padding:16px 16px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="34" valign="top">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td width="28" height="28" align="center" valign="middle" bgcolor="#ede9fe" style="background-color:#ede9fe; border-radius:8px; color:#6d28d9; font-size:14px; font-weight:700;">
                              &#128274;
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td style="padding-left:10px;">
                        <p style="margin:0 0 3px; color:#29243d; font-size:12px; font-weight:700;">
                          Keep your code private
                        </p>
                        <p style="margin:0; color:#817b91; font-size:11px; line-height:1.5;">
                          HirePath will never ask you to share this verification code with anyone, including our support team.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA button (real link, bulletproof-ish table button) -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px auto 0;">
              <tr>
                <td align="center" bgcolor="#4f46e5" style="background-color:#4f46e5; border-radius:10px;">
                  <a href="${appUrl}" target="_blank" style="display:inline-block; padding:12px 26px; color:#ffffff; font-size:13px; font-weight:700; letter-spacing:0.2px; text-decoration:none;">
                    Open HirePath
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:22px 0 0; text-align:center; color:#9992aa; font-size:11px; line-height:1.6;">
              Didn't request this verification email?<br>
              You can safely ignore this message — your account stays secure.
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" bgcolor="#fafaff" style="background-color:#fafaff; border-top:1px solid #eeeef5; padding:24px 28px;">
            <p style="margin:0 0 7px; color:#4f46e5; font-size:12px; font-weight:700;">
              HirePath
            </p>
            <p style="margin:0; color:#aaa5b5; font-size:10px; line-height:1.6;">
              Helping you find your next opportunity.
            </p>
            <p style="margin:12px 0 0;">
              <span style="color:#c0bcc8; font-size:10px; margin:0 6px;">Help Center</span>
              <span style="color:#ddd9e6;">&bull;</span>
              <span style="color:#c0bcc8; font-size:10px; margin:0 6px;">Privacy</span>
              <span style="color:#ddd9e6;">&bull;</span>
              <span style="color:#c0bcc8; font-size:10px; margin:0 6px;">Contact Us</span>
            </p>
            <p style="margin:10px 0 0; color:#c0bcc8; font-size:9px;">
              &copy; ${new Date().getFullYear()} HirePath. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
<!--[if mso]>
</td></tr>
</table>
<![endif]-->
</div>
`;

const sendOtpEmail = async ({ to, name, otp, expiryMinutes, appUrl }) => {
    const mailer = getTransporter();
    await mailer.sendMail({
        from: process.env.EMAIL_FROM || `"HirePath" <${process.env.SMTP_USER}>`,
        to,
        subject: "Your HirePath verification code",
        html: otpEmailTemplate({ name, otp, expiryMinutes, appUrl }),
        text: `Your HirePath verification code is ${otp}. It expires in ${expiryMinutes} minutes.`,
    });
};

module.exports = { sendOtpEmail };