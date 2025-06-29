import { Request, Response, NextFunction } from "express";
import { BaseService } from "../services/base.service";
import { IApiResponse } from "../models/api-response.model";
import { IUser } from "../models/user.model";

/**
 * BaseController class that provides CRUD operations for a given service.
 * Assumes the service handles user-specific data and the user ID is extracted from the request session.
 * All responses are sent in a consistent format.
 */
export class BaseController<T> {
  protected service: BaseService<T>;

  /**
   * Constructs an instance of BaseController.
   * @param service Instance of BaseService class
   */
  constructor(service: BaseService<T>) {
    this.service = service;
  }

  //^ Helper Methods
  /**
   * Extracts userId from authenticated user session and validates it.
   * If not authenticated, sends a 401 response.
   * @param req Express request object
   * @param res Express response object
   * @returns userId if valid, otherwise undefined (response sent)
   */
  public getUserId(req: Request, res: Response): string | undefined {
    // Only trust the user from the session (set by Passport)
    if (req.user && typeof req.user === "object" && "id" in req.user) {
      return (req.user as Partial<IUser>).id;
    }
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: user not authenticated." });
  }

  // ^ CRUD Methods
  /**
   * Get all documents for the authenticated user.
   * @route GET /
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      const documents = await this.service.findAllByUser(userId);
      res.json({ success: true, data: documents } as IApiResponse<T[]>);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Get a document by ID for the authenticated user.
   * @route GET /:id
   */
  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      const document = await this.service.findByIdAndUser(req.params.id, userId);
      if (!document) {
        res.status(404).json({ success: false, message: "Document not found." });
        return;
      }
      res.json({ success: true, data: document } as IApiResponse<T>);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Create one or more documents for the authenticated user.
   * @route POST /
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      let result: T | T[];
      if (Array.isArray(req.body)) {
        result = await this.service.createManyForUser(req.body, userId);
      } else {
        result = await this.service.createForUser(req.body, userId);
      }
      res.status(201).json({ success: true, data: result } as IApiResponse<T | T[]>);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Update a document by ID for the authenticated user.
   * @route PUT /:id
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      const document = await this.service.updateForUser(req.params.id, req.body, userId);
      if (!document) {
        res.status(404).json({ success: false, message: "Document not found." });
        return;
      }
      res.json({ success: true, data: document } as IApiResponse<T>);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Delete a document by ID for the authenticated user.
   * @route DELETE /:id
   */
  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      const document = await this.service.deleteForUser(req.params.id, userId);
      if (!document) {
        res.status(404).json({ success: false, message: "Document not found." });
        return;
      }
      res.json({ success: true, message: "Document deleted." } as IApiResponse<null>);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Delete all documents for the authenticated user.
   * @route DELETE /
   */
  public deleteAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      await this.service.deleteAllForUser(userId);
      res.json({
        success: true,
        message: "All user documents deleted.",
      } as IApiResponse<null>);
    } catch (error) {
      return next(error);
    }
  };
}
