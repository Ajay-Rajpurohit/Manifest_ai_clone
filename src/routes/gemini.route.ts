import { Router, Request, Response } from 'express';
import { addProductInfoController, refundPolicyTextController, returnHiController } from '../controller/gemini.controller';
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
  } from '@clerk/clerk-sdk-node';

const router = Router();

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
  }


router.post('/update-doc', ClerkExpressRequireAuth({}), refundPolicyTextController)
router.post('/submit-product', ClerkExpressRequireAuth({}), addProductInfoController)
router.get('/sayhi',  returnHiController)

export default router;
