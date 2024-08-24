import { Router, Request, Response } from 'express';
import { integrateShopifyController } from '../controller/shopifyIntegration.controller';
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


router.post('/new', ClerkExpressRequireAuth({}), integrateShopifyController)


export default router;
