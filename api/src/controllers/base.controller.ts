import { Request, Response } from "express";
import { BaseService } from "../services/base.service";

// BaseController class that provides CRUD operations for a given service
// These methods assume that the service handles user-specific data
// and that the user ID is extracted from the request session (e.g., Passport.js).
export class BaseController<T> {
  protected service: BaseService<T>;

  /**
   * @param service Instance of BaseService class
   * @description Constructs an instance of BaseController
   */
  constructor(service: BaseService<T>) {
    this.service = service;
  }

  // ^ Helper Methods
  /**
   * @description Extracts userId from authenticated user session and validates it
   * @returns userId if valid, otherwise sends a 401 response
   */
  public getUserId(req: Request, res: Response): string | undefined {
    // Only trust the user from the session (set by Passport)
    if (req.user && typeof req.user === "object" && "id" in req.user) {
      return (req.user as any).id;
    }
    res.status(401).json({ message: "Unauthorized: user not authenticated" });
    return undefined;
  }

  /**
   * @description Sends a consistent error response
   */
  public handleError(res: Response, error: any, status: number = 400): void {
    res.status(status).json({
      message: error?.message || "Unknown error",
      name: error?.name,
      errors: error?.errors,
    });
  }

  // ^ CRUD Methods
  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      const documents = await this.service.findAllByUser(userId);
      res.json(documents);
    } catch (error) {
      this.handleError(res, error, 500);
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      const document = await this.service.findByIdAndUser(req.params.id, userId);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json(document);
    } catch (error) {
      this.handleError(res, error, 500);
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      if (Array.isArray(req.body)) {
        const documents = await this.service.createManyForUser(req.body, userId);
        res.status(201).json(documents);
      } else {
        const document = await this.service.createForUser(req.body, userId);
        res.status(201).json(document);
      }
    } catch (error) {
      this.handleError(res, error, 400);
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;

      const document = await this.service.updateForUser(req.params.id, req.body, userId);
      if (!document) {
        res.status(404).json("Document not found.");
        return;
      }
      res.json(document);
    } catch (error) {
      this.handleError(res, error, 400);
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      const document = await this.service.deleteForUser(req.params.id, userId);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json({ message: "Document deleted" });
    } catch (error) {
      this.handleError(res, error, 500);
    }
  };

  public deleteAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      await this.service.deleteAllForUser(userId);
      res.json({ message: "All user documents deleted" });
    } catch (error) {
      this.handleError(res, error, 500);
    }
  };
}
