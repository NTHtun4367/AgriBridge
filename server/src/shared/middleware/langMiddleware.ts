import { Request, Response, NextFunction } from "express";

export const setDefaultLang = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // GET request ဖြစ်ပြီး lang query မပါလာခဲ့လျှင် 'en' ကို default ထားမည်
  if (req.method === "GET" && !req.query.lang) {
    req.query.lang = "en";
  }
  next();
};
