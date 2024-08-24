import { Router, Request, Response } from 'express';
import shopifyIntegration from "./routes/shopifyIntegration.route"
import geminAPIs from "./routes/gemini.route"

const router = Router();

router.use("/shopify", shopifyIntegration)
router.use("/ai", geminAPIs)

module.exports = router;

export default router