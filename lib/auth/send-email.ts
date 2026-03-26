import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

const createTransporter = () => {
  const config: EmailConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || "",
      pass: process.env.EMAIL_PASS || "",
    },
  };

  return nodemailer.createTransport(config);
};

const createResetPasswordEmailTemplate = (
  resetUrl: string,
  userName?: string,
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f4f4f4; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2c3e50; margin-bottom: 20px;">Reset Your Password</h2>
        
        ${userName ? `<p>Hi ${userName},</p>` : "<p>Hello,</p>"}
        
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #3498db;">${resetUrl}</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
          <p><strong>Security Note:</strong></p>
          <ul>
            <li>This link will expire in 1 hour for security purposes</li>
            <li>If you didn't request this reset, please ignore this email</li>
            <li>Never share this link with anyone</li>
          </ul>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Best regards,<br>
          The App Team
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Reset Your Password

${userName ? `Hi ${userName},` : "Hello,"}

We received a request to reset your password. Please visit the following link to create a new password:

${resetUrl}

Security Note:
- This link will expire in 1 hour for security purposes
- If you didn't request this reset, please ignore this email
- Never share this link with anyone

Best regards,
The App Team
  `;

  return { html, text };
};

export const sendEmail = async (
  options: SendEmailOptions,
): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: options.from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

export const sendResetPasswordEmail = async (
  email: string,
  resetToken: string,
  userName?: string,
): Promise<boolean> => {
  try {
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    const { html, text } = createResetPasswordEmailTemplate(resetUrl, userName);

    return await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html,
      text,
    });
  } catch (error) {
    console.error("Failed to send reset password email:", error);
    return false;
  }
};
