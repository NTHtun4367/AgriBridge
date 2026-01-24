import { Resend } from "resend";
import axios from "axios";
import {
  createWelcomeEmailTemplate,
  createOtpEmailTemplate,
  createIdentifierChangeTemplate,
} from "./emailTemplates";
import { ENV } from "./env";

const resendClient = new Resend(ENV.RESEND_API_KEY);

const sender = {
  email: process.env.EMAIL_FROM || "onboarding@resend.dev",
  name: process.env.EMAIL_FROM_NAME || "AgriBridge",
};

const formatPhone = (phone: string) => {
  return phone.startsWith("+")
    ? phone.replace("+", "")
    : phone.startsWith("09")
      ? `959${phone.substring(2)}`
      : phone;
};

export const sendMessage = async (
  to: string,
  subject: string,
  text: string,
  html: string,
) => {
  const isEmail = to.includes("@");

  if (isEmail) {
    // Send via Resend
    const { error } = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: [to],
      subject,
      html,
    });
    if (error) throw new Error(`Email failed: ${error.message}`);
  } else {
    // Send via Infobip SMS API
    const phone = formatPhone(to);
    await axios.post(
      `https://${process.env.INFOBIP_BASE_URL}/sms/2/text/advanced`,
      {
        messages: [
          {
            destinations: [{ to: phone }],
            from: "AgriBridge",
            text, // SMS uses plain text
          },
        ],
      },
      { headers: { Authorization: `App ${process.env.INFOBIP_API_KEY}` } },
    );
  }
};

// Specialized Helpers
export const sendOtp = (to: string, otp: string) =>
  sendMessage(
    to,
    "Your Verification Code",
    `Your AgriBridge code is: ${otp}`,
    createOtpEmailTemplate(otp),
  );

export const sendWelcome = (to: string, name: string) =>
  sendMessage(
    to,
    "Welcome to AgriBridge!",
    `Hi ${name}, your account is now verified.`,
    createWelcomeEmailTemplate(name),
  );

export const sendChangeNotification = (to: string, otp: string) =>
  sendMessage(
    to,
    "Confirm your new contact info",
    `Use this code to confirm your new email/phone: ${otp}`,
    createIdentifierChangeTemplate(otp),
  );
