import { Model } from "mongoose";

// BaseService class that provides CRUD operations for a given Mongoose model
// This class is generic and can be used with any Mongoose model.
// It includes methods for basic CRUD operations, as well as user-specific operations.
export class BaseService<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Find all documents.
   * @returns Promise resolving to an array of documents.
   */
  public async findAll(): Promise<T[]> {
    try {
      return await this.model.find();
    } catch (error) {
      throw new Error("Error fetching documents: " + error);
    }
  }

  /**
   * Find a single document matching the query.
   * @param query The query object.
   * @returns Promise resolving to the found document or null.
   */
  public async findOne(query: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      throw new Error("Error fetching document: " + error);
    }
  }

  /**
   * Find a document by its ID.
   * @param id The document ID.
   * @returns Promise resolving to the found document or null.
   */
  public async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error("Error fetching document: " + error);
    }
  }

  /**
   * Create a new document.
   * @param data The document data.
   * @returns Promise resolving to the created document.
   */
  public async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return (await document.save()) as T;
    } catch (error) {
      throw new Error("Error creating document: " + error);
    }
  }

  /**
   * Create multiple documents.
   * @param data Array of document data.
   * @returns Promise resolving to an array of created documents.
   */
  public async createMany(data: Partial<T>[]): Promise<T[]> {
    try {
      const documents = await this.model.insertMany(data);
      return documents as T[];
    } catch (error) {
      throw new Error("Error creating documents: " + error);
    }
  }

  /**
   * Update a document by its ID.
   * @param id The document ID.
   * @param data The update data.
   * @returns Promise resolving to the updated document or null.
   */
  public async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error("Error updating document: " + error);
    }
  }

  /**
   * Delete a document by its ID.
   * @param id The document ID.
   * @returns Promise resolving to the deleted document or null.
   */
  public async delete(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error deleting document: " + error);
    }
  }

  /**
   * Delete all documents.
   * @returns Promise resolving when deletion is complete.
   */
  public async deleteAll(): Promise<void> {
    try {
      await this.model.deleteMany({});
    } catch (error) {
      throw new Error("Error deleting all documents: " + error);
    }
  }

  /**
   * Find all documents belonging to a specific user.
   * @param userId The user's ID.
   * @returns Promise resolving to an array of documents.
   */
  public async findAllByUser(userId: string): Promise<T[]> {
    try {
      return await this.model.find({ userId });
    } catch (error) {
      throw new Error("Error fetching user documents: " + error);
    }
  }

  /**
   * Find a document by ID and user.
   * @param id The document ID.
   * @param userId The user's ID.
   * @returns Promise resolving to the found document or null.
   */
  public async findByIdAndUser(id: string, userId: string): Promise<T | null> {
    try {
      return await this.model.findOne({ _id: id, userId });
    } catch (error) {
      throw new Error("Error fetching user document: " + error);
    }
  }

  /**
   * Create a document for a specific user.
   * @param data The document data.
   * @param userId The user's ID.
   * @returns Promise resolving to the created document.
   */
  public async createForUser(data: Partial<T>, userId: string): Promise<T> {
    try {
      const document = new this.model({ ...data, userId });
      return (await document.save()) as T;
    } catch (error) {
      throw new Error("Error creating user document: " + error);
    }
  }

  /**
   * Create multiple documents for a specific user.
   * @param data Array of document data.
   * @param userId The user's ID.
   * @returns Promise resolving to an array of created documents.
   */
  public async createManyForUser(data: Partial<T>[], userId: string): Promise<T[]> {
    try {
      const documents = await this.model.insertMany(data.map((d) => ({ ...d, userId })));
      return documents as T[];
    } catch (error) {
      throw new Error("Error creating user documents: " + error);
    }
  }

  /**
   * Update a document by ID for a specific user.
   * @param id The document ID.
   * @param data The update data.
   * @param userId The user's ID.
   * @returns Promise resolving to the updated document or null.
   */
  public async updateForUser(
    id: string,
    data: Partial<T>,
    userId: string
  ): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate({ _id: id, userId }, data, { new: true });
    } catch (error) {
      throw new Error("Error updating user document: " + error);
    }
  }

  /**
   * Delete a document by ID for a specific user.
   * @param id The document ID.
   * @param userId The user's ID.
   * @returns Promise resolving to the deleted document or null.
   */
  public async deleteForUser(id: string, userId: string): Promise<T | null> {
    try {
      return await this.model.findOneAndDelete({ _id: id, userId });
    } catch (error) {
      throw new Error("Error deleting user document: " + error);
    }
  }

  /**
   * Delete all documents for a specific user.
   * @param userId The user's ID.
   * @returns Promise resolving when deletion is complete.
   */
  public async deleteAllForUser(userId: string): Promise<void> {
    try {
      await this.model.deleteMany({ userId });
    } catch (error) {
      throw new Error("Error deleting all user documents: " + error);
    }
  }
}
