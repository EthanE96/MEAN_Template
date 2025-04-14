import { Router } from "express";
import { BaseController } from "../controllers/base.controller"; // Adjust path as needed

// Configuration interface for enabling/disabling routes
interface RouteConfig {
  getAll?: boolean;
  getById?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  deleteAll?: boolean;
}

export class BaseRouter<T> {
  public router: Router;
  protected controller: BaseController<T>;
  private routeConfig: RouteConfig;

  /**
   * @param controller Instance of BaseController class
   * @param config Optional configuration to enable/disable specific routes
   * @description Constructs an instance of BaseRouter and sets up CRUD routes based on config
   */
  constructor(controller: BaseController<T>, config: RouteConfig = {}) {
    this.router = Router();
    this.controller = controller;

    // Default to enabling all routes if not specified
    this.routeConfig = {
      getAll: config.getAll ?? true,
      getById: config.getById ?? true,
      create: config.create ?? true,
      update: config.update ?? true,
      delete: config.delete ?? true,
      deleteAll: config.deleteAll ?? true,
    };

    this.initializeRoutes();
  }

  /**
   * @description Initializes the CRUD routes based on the routeConfig
   */
  protected initializeRoutes(): void {
    if (this.routeConfig.getAll) {
      this.router.get("/", this.controller.getAll);
    }

    if (this.routeConfig.getById) {
      this.router.get("/:id", this.controller.getById);
    }

    if (this.routeConfig.create) {
      this.router.post("/", this.controller.create);
    }

    if (this.routeConfig.update) {
      this.router.put("/:id", this.controller.update);
    }

    if (this.routeConfig.delete) {
      this.router.delete("/:id", this.controller.delete);
    }

    if (this.routeConfig.deleteAll) {
      this.router.delete("/", this.controller.deleteAll);
    }
  }
}

export default BaseRouter;
