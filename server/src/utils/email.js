import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to, otp) {
  console.log(`[EMAIL] Sending OTP to ${to}: ${otp}`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[EMAIL-DRY-RUN] No SMTP credentials. OTP: ${otp}`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.OTP_FROM || process.env.SMTP_USER,
      to,
      subject: 'safemete - Your Login Verification Code',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:20px;">
          <div style="background:#E5252B;color:white;padding:16px;text-align:center;border-radius:8px 8px 0 0;">
            <h2 style="margin:0;font-size:20px;">safemete Fire Safety</h2>
          </div>
          <div style="background:#f9f9f9;padding:24px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px;">
            <p style="color:#333;font-size:14px;">Your one-time verification code is:</p>
            <div style="font-size:36px;font-weight:bold;letter-spacing:12px;
                background:white;padding:20px;text-align:center;border-radius:8px;
                color:#E5252B;margin:20px 0;border:2px dashed #E5252B;">
              ${otp}
            </div>
            <p style="color:#666;font-size:13px;text-align:center;">
              This code expires in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.
            </p>
            <p style="color:#999;font-size:12px;text-align:center;margin-top:20px;border-top:1px solid #ddd;padding-top:16px;">
              If you did not request this code, please secure your account immediately.
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[EMAIL] OTP sent successfully. Message ID: ${info.messageId}`);
  } catch (err) {
    // Log error but do NOT throw — allow login to proceed with console-logged OTP
    console.error(`[EMAIL] SMTP send failed (OTP still valid): ${otp}`);
    console.error(`[EMAIL] Error:`, err.message);
  }
}