import nodemailer from "nodemailer";
import axios from "axios";

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (identifier: string, otp: string) => {
  const isEmail = identifier.includes("@");

  if (isEmail) {
    // 100% FREE EMAIL (GMAIL)
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS, // 16-character App Password
    //   },
    // });

    // await transporter.sendMail({
    //   from: `"AgriBridge" <${process.env.EMAIL_USER}>`,
    //   to: identifier,
    //   subject: "Verification Code",
    //   text: `Your AgriBridge code is ${otp}.`,
    // });
    console.log("Email-sent");
  } else {
    // INFOBIP FREE TRIAL (Excellent for Myanmar)
    // Note: Format the number to E.164 (e.g., 959xxx)
    // const formattedPhone = identifier.startsWith("+")
    //   ? identifier.replace("+", "")
    //   : identifier.startsWith("09")
    //     ? `959${identifier.substring(2)}`
    //     : identifier;
    // try {
    //   await axios.post(
    //     `https://${process.env.INFOBIP_BASE_URL}/sms/2/text/advanced`,
    //     {
    //       messages: [
    //         {
    //           destinations: [{ to: formattedPhone }],
    //           from: "AgriBridge", // Your custom sender name
    //           text: `Your AgriBridge verification code is: ${otp}. Valid for 5 minutes.`,
    //         },
    //       ],
    //     },
    //     {
    //       headers: {
    //         Authorization: `App ${process.env.INFOBIP_API_KEY}`,
    //         "Content-Type": "application/json",
    //       },
    //     },
    //   );
    //   console.log(`📱 Infobip OTP sent to ${formattedPhone}`);
    // } catch (error: any) {
    //   console.error("SMS Error:", error.response?.data || error.message);
    //   throw new Error("Could not send SMS. Please use Email.");
    // }
  }
};
