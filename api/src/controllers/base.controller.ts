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
      const userId = req.query.userId as string;
      const documents = userId
        ? await this.service.findAllByUser(userId)
        : await this.service.findAll();
      res.json(documents);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const document = userId
        ? await this.service.findByIdAndUser(req.params.id, userId)
        : await this.service.findById(req.params.id);
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
      const userId = req.body.userId || (req.query.userId as string);

      if (Array.isArray(req.body)) {
        const documents = userId
          ? await this.service.createManyForUser(req.body, userId)
          : await this.service.createMany(req.body);
        res.status(201).json(documents);
      } else {
        const document = userId
          ? await this.service.createForUser(req.body, userId)
          : await this.service.create(req.body);
        res.status(201).json(document);
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.userId || (req.query.userId as string);
      const document = userId
        ? await this.service.updateForUser(req.params.id, req.body, userId)
        : await this.service.update(req.params.id, req.body);
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
      const userId = req.query.userId as string;
      const document = userId
        ? await this.service.deleteForUser(req.params.id, userId)
        : await this.service.delete(req.params.id);
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
      const userId = req.query.userId as string;
      if (userId) {
        await this.service.deleteAllForUser(userId);
        res.json({ message: "All user documents deleted" });
      } else {
        await this.service.deleteAll();
        res.json({ message: "All documents deleted" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };

  public getAllByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const documents = await this.service.findAllByUser(req.params.userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  public getByIdAndUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await this.service.findByIdAndUser(
        req.params.id,
        req.params.userId
      );
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json(document);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  public createForUser = async (req: Request, res: Response): Promise<void> => {
    try {
      if (Array.isArray(req.body)) {
        const documents = await this.service.createManyForUser(
          req.body,
          req.params.userId
        );
        res.status(201).json(documents);
      } else {
        const document = await this.service.createForUser(req.body, req.params.userId);
        res.status(201).json(document);
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };

  public updateForUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await this.service.updateForUser(
        req.params.id,
        req.body,
        req.params.userId
      );
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json(document);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  public deleteForUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const document = await this.service.deleteForUser(req.params.id, req.params.userId);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.json({ message: "Document deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  public deleteAllForUser = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.service.deleteAllForUser(req.params.userId);
      res.json({ message: "All user documents deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}
