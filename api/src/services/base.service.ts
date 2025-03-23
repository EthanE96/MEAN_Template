import { Model } from "mongoose";

export abstract class BaseService<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async findAll(): Promise<T[]> {
    try {
      return await this.model.find();
    } catch (error) {
      throw new Error("Error fetching documents: " + error);
    }
  }

  public async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error("Error fetching document: " + error);
    }
  }

  public async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return (await document.save()) as T;
    } catch (error) {
      throw new Error("Error creating document: " + error);
    }
  }

  public async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error("Error updating document: " + error);
    }
  }

  public async delete(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error deleting document: " + error);
    }
  }
}
