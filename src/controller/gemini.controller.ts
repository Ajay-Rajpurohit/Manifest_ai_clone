import { type Request, type Response, type NextFunction } from "express";
import {addProductInfo, refundPolicyText, returnHi} from "../services/gemini.service"

export const refundPolicyTextController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const data = req.body;
    const clerkAuth = req.auth;
    const result = await refundPolicyText(clerkAuth, data);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: result,
    });
  } catch (e: any) {
    return res
      .status(400)
      .json({ status: 400, flag: false, message: e?.message });
  }
};

export const returnHiController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const result = await returnHi();
    return res.status(200).json({
      status: 200,
      flag: true,
      data: result,
    });
  } catch (e: any) {
    return res
      .status(400)
      .json({ status: 400, flag: false, message: e?.message });
  }
};

export const addProductInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const data = req.body;
    const clerkAuth = req.auth;
    const result = addProductInfo(clerkAuth);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: "API Called Successfully",
    });
  } catch (e: any) {
    return res
      .status(400)
      .json({ status: 400, flag: false, message: e?.message });
  }
};

// export default router;
