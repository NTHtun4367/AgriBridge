import jwt from "jsonwebtoken";
import { ENV } from "./env";

const generateToken = (user: any) => {
  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role,
      verificationStatus: user.verificationStatus,
      merchantId: user.merchantId || null,
    },
    ENV.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return token;
};

export default generateToken;
