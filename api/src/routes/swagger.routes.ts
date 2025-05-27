import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../config/swagger/swagger.json";

const router = Router();

// Serve Swagger UI
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

export default router;
