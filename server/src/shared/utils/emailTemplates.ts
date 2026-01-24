const BRAND_COLOR = "#2e7d32";
const BG_COLOR = "#f9fafb";

const baseLayout = (content: string) => `
  <div style="background-color: ${BG_COLOR}; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: ${BRAND_COLOR}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-style: italic;">AgriBridge</h1>
      </div>
      <div style="padding: 40px; line-height: 1.6; color: #374151;">
        ${content}
      </div>
      <div style="padding: 20px; background: #f3f4f6; text-align: center; font-size: 12px; color: #9ca3af;">
        &copy; 2026 AgriBridge. All rights reserved.
      </div>
    </div>
  </div>
`;

export const createWelcomeEmailTemplate = (name: string) =>
  baseLayout(`
  <h2 style="color: ${BRAND_COLOR}; margin-top: 0;">Welcome aboard, ${name}!</h2>
  <p>We're excited to have you join the AgriBridge community. Your account has been verified successfully.</p>
  <p>You can now log in to explore our marketplace, connect with partners, and grow your business.</p>
  <div style="margin-top: 30px; text-align: center;">
    <a href="#" style="background-color: ${BRAND_COLOR}; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
  </div>
`);

export const createOtpEmailTemplate = (otp: string) =>
  baseLayout(`
  <h2 style="text-align: center; color: #111827;">Verify Your Account</h2>
  <p style="text-align: center;">Use the verification code below to complete your registration. This code is valid for 1 minutes.</p>
  <div style="margin: 30px 0; background: #f0fdf4; border: 2px dashed ${BRAND_COLOR}; border-radius: 8px; padding: 20px; text-align: center;">
    <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: ${BRAND_COLOR};">${otp}</span>
  </div>
  <p style="font-size: 14px; color: #6b7280; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
`);

export const createIdentifierChangeTemplate = (otp: string) =>
  baseLayout(`
  <h2 style="color: #111827;">Confirm Change Request</h2>
  <p>We received a request to update your contact information. Please use the code below to confirm this change:</p>
  <div style="margin: 20px 0; background: #eff6ff; border-radius: 8px; padding: 20px; text-align: center;">
    <span style="font-size: 32px; font-weight: bold; color: #1d4ed8; letter-spacing: 4px;">${otp}</span>
  </div>
  <p style="color: #ef4444; font-size: 14px;">Warning: If you did not initiate this change, please contact support immediately as your account security may be at risk.</p>
`);
