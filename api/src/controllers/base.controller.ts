import { Request, Response } from "express";
import { BaseService } from "../services/base.service";

export class BaseController<T> {
  protected service: BaseService<T>;

  /**
   * @param service Instance of BaseService class
   * @description Constructs an instance of BaseController
   */
  constructor(service: BaseService<T>) {
    this.service = service;
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const documents = await this.service.findAll();
      res.json(documents);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await this.service.findById(req.params.id);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json(document);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      if (Array.isArray(req.body)) {
        const documents = await this.service.createMany(req.body);
        res.status(201).json(documents);
      } else {
        const document = await this.service.create(req.body);
        res.status(201).json(document);
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await this.service.update(req.params.id, req.body);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json(document);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await this.service.delete(req.params.id);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json({ message: "Document deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  public deleteAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const documents = await this.service.deleteAll();
      res.json(documents);
    } catch (error) {
      res.status(500).json(error);
    }
  };
}
