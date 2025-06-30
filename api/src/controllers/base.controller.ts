import "express-async-errors";
import { Request, Response } from "express";
import { BaseService } from "../services/base.service";
import { IApiResponse } from "../models/api-response.model";
import { IUser } from "../models/user.model";
import { NotFoundError, UnauthorizedError } from "../models/errors.model";

/**
 * BaseController class that provides CRUD operations for a given service.
 * Assumes the service handles user-specific data and the user ID is extracted from the request session.
 * Utilizing express-async-error to handle async errors automatically.
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
   * If not authenticated, throws an UnauthorizedError.
   * @param req Express request object
   * @returns userId if valid, otherwise throws error
   */
  protected getUserId(req: Request): string {
    // Only trust the user from the session (set by Passport)
    const user = req.user as IUser;
    if (!user || !user.id) {
      throw new UnauthorizedError("Authentication required or user ID not found.");
    }
    return user.id;
  }

  // ^ CRUD Methods
  /**
   * Get all documents for the authenticated user.
   * @route GET /
   */
  public getAll = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    const documents = await this.service.findAllByUser(userId);
    res.json({ success: true, data: documents } as IApiResponse<T[]>);
  };

  /**
   * Get a document by ID for the authenticated user.
   * @route GET /:id
   */
  public getById = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    const document = await this.service.findByIdAndUser(req.params.id, userId);

    if (!document) {
      throw new NotFoundError("Document not found for the authenticated user.");
    }

    res.json({ success: true, data: document } as IApiResponse<T>);
  };

  /**
   * Create one or more documents for the authenticated user.
   * @route POST /
   */
  public create = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    let result: T | T[];

    if (Array.isArray(req.body)) {
      result = await this.service.createManyForUser(req.body, userId);
    } else {
      result = await this.service.createForUser(req.body, userId);
    }
    res.status(201).json({ success: true, data: result } as IApiResponse<T | T[]>);
  };

  /**
   * Update a document by ID for the authenticated user.
   * @route PUT /:id
   */
  public update = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    const document = await this.service.updateForUser(req.params.id, req.body, userId);

    if (!document) {
      throw new NotFoundError("Document not found for the authenticated user.");
    }

    res.json({ success: true, data: document } as IApiResponse<T>);
  };

  /**
   * Delete a document by ID for the authenticated user.
   * @route DELETE /:id
   */
  public delete = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    const document = await this.service.deleteForUser(req.params.id, userId);

    if (!document) {
      throw new NotFoundError("Document not found for the authenticated user.");
    }

    res.json({ success: true, message: "Document deleted." } as IApiResponse<null>);
  };

  /**
   * Delete all documents for the authenticated user.
   * @route DELETE /
   */
  public deleteAll = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    await this.service.deleteAllForUser(userId);
    res.json({
      success: true,
      message: "All user documents deleted.",
    } as IApiResponse<null>);
  };
}
