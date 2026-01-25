import { Resend } from "resend";
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

/**
 * Core function to send emails via Resend.
 * SMS support has been removed to enforce Email-only verification.
 */
export const sendMessage = async (
  to: string,
  subject: string,
  text: string,
  html: string,
) => {
  const isEmail = to.includes("@");

  if (!isEmail) {
    throw new Error(
      `Invalid recipient: "${to}". Verification is only supported via email.`,
    );
  }

  // --- Send via Resend ---
  const { error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: [to.trim().toLowerCase()],
    subject,
    text, // Added text fallback for better deliverability
    html,
  });

  if (error) {
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

// --- Specialized Email Helpers ---

/**
 * Sends a 6-digit OTP to the user's email.
 */
export const sendOtp = (to: string, otp: string) =>
  sendMessage(
    to,
    "Your Verification Code",
    `Your AgriBridge code is: ${otp}`,
    createOtpEmailTemplate(otp),
  );

/**
 * Sends a welcome email once the user is verified.
 */
export const sendWelcome = (to: string, name: string) =>
  sendMessage(
    to,
    "Welcome to AgriBridge!",
    `Hi ${name}, your account is now verified.`,
    createWelcomeEmailTemplate(name),
  );

/**
 * Sends an OTP specifically for confirming a change in email address.
 */
export const sendChangeNotification = (to: string, otp: string) =>
  sendMessage(
    to,
    "Confirm your new email address",
    `Use this code to confirm your new email: ${otp}`,
    createIdentifierChangeTemplate(otp),
  );
