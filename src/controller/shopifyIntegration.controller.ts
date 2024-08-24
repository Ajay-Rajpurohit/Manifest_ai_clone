import { type Request, type Response, type NextFunction } from "express";
import {integrateShopify} from "../services/shopifyIntegration.service"

export const integrateShopifyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const data = req.body;
    const clerkAuth = req.auth;
    const result = await integrateShopify(clerkAuth, data);
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

// export default router;
