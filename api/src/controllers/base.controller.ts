import { Request, Response } from "express";
import { Model } from "mongoose";

/**
 * A generic base controller class providing basic CRUD operations for Mongoose models.
 * @template T The type of the Mongoose document.
 */
export class BaseController<T> {
  protected model: Model<T>;

  /**
   * Constructs the base controller with a specific Mongoose model.
   * @param model The Mongoose model to perform CRUD operations on.
   */
  constructor(model: Model<T>) {
    this.model = model;
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const documents = await this.model.find();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await this.model.findById(req.params.id);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const document = new this.model(req.body);
      await document.save();
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await this.model.findByIdAndDelete(req.params.id);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json({ message: "Document deleted" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };
}
