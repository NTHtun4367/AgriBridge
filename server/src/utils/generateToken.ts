import jwt from "jsonwebtoken";
import { ENV } from "./env";

const generateToken = (user: any) => {
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
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
