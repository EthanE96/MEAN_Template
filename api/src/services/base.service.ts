import { Model, FilterQuery, UpdateQuery } from "mongoose";
import {
  DatabaseError,
  ValidationError,
  ConflictError,
  InternalServerError,
} from "../models/errors.model";

/**
 * BaseService class that provides CRUD operations for a given Mongoose model.
 * This class is generic and can be used with any Mongoose model.
 * It includes methods for basic CRUD operations, as well as user-specific operations.
 */
export class BaseService<T> {
  protected model: Model<T>;

  /**
   * Constructs an instance of BaseService.
   * @param model Mongoose model instance
   */
  constructor(model: Model<T>) {
    this.model = model;
  }

  //^ CRUD Operations
  /**
   * Find all documents.
   * @returns Promise resolving to an array of documents.
   */
  public async findAll(): Promise<T[]> {
    try {
      return await this.model.find().exec();
    } catch (error: unknown) {
      throw new DatabaseError(`Failed to fetch documents`, error);
    }
  }

  /**
   * Find a single document matching the query.
   * @param query The query object (Mongoose filter).
   * @returns Promise resolving to the found document or null.
   */
  public async findOne(query?: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(query).exec();
    } catch (error: unknown) {
      throw new DatabaseError(`Failed to fetch document`, error);
    }
  }

  /**
   * Find a document by its ID.
   * @param id The document ID.
   * @returns Promise resolving to the found document or null.
   */
  public async findById(id: string): Promise<T | null> {
    try {
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid document ID format");
      }

      return await this.model.findById(id).exec();
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError(`Failed to fetch document`, error);
    }
  }

  /**
   * Create a new document.
   * @param data The document data.
   * @returns Promise resolving to the created document.
   */
  public async create(data: Partial<T>): Promise<T> {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new ValidationError("Document data cannot be empty");
      }

      const document = new this.model(data);
      return (await document.save()) as T;
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;

      if (error instanceof Error && error.name === "ValidationError") {
        throw new ValidationError(`Validation failed: ${error.message}`);
      }

      if (error && typeof error === "object" && "code" in error && error.code === 11000) {
        throw new ConflictError("Document with this data already exists");
      }

      throw new InternalServerError(`Failed to create document`, error);
    }
  }

  /**
   * Create multiple documents.
   * @param data Array of document data.
   * @returns Promise resolving to an array of created documents.
   */
  public async createMany(data: Partial<T>[]): Promise<T[]> {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new ValidationError("Data must be a non-empty array");
      }

      const documents = await this.model.insertMany(data);
      return documents as T[];
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;

      if (error instanceof Error && error.name === "ValidationError") {
        throw new ValidationError(`Validation failed: ${error.message}`);
      }

      if (error && typeof error === "object" && "code" in error && error.code === 11000) {
        throw new ConflictError("One or more documents already exist");
      }

      throw new InternalServerError(`Failed to create documents`, error);
    }
  }

  /**
   * Update a document by its ID.
   * @param id The document ID.
   * @param data The update data (Mongoose update query).
   * @returns Promise resolving to the updated document or null.
   */
  public async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid document ID format");
      }

      if (!data || Object.keys(data).length === 0) {
        throw new ValidationError("Update data cannot be empty");
      }
      return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;

      if (error instanceof Error && error.name === "ValidationError") {
        throw new ValidationError(`Validation failed: ${error.message}`);
      }

      throw new InternalServerError(`Failed to update document`, error);
    }
  }

  /**
   * Delete a document by its ID.
   * @param id The document ID.
   * @returns Promise resolving to the deleted document or null.
   */
  public async delete(id: string): Promise<T | null> {
    try {
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid document ID format");
      }

      return await this.model.findByIdAndDelete(id).exec();
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;
      throw new InternalServerError(`Failed to delete document`, error);
    }
  }

  /**
   * Delete all documents.
   * @returns Promise resolving when deletion is complete.
   */
  public async deleteAll(): Promise<void> {
    try {
      await this.model.deleteMany({}).exec();
    } catch (error: unknown) {
      throw new DatabaseError(`Failed to delete all documents`, error);
    }
  }

  //^ User-specific methods
  /**
   * Find all documents belonging to a specific user.
   * @param userId The user's ID.
   * @returns Promise resolving to an array of documents.
   */
  public async findAllByUser(userId: string): Promise<T[]> {
    try {
      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid user ID format");
      }
      return await this.model.find({ userId } as FilterQuery<T>).exec();
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError(`Failed to fetch user documents`, error);
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
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid document ID format");
      }

      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid user ID format");
      }
      return await this.model.findOne({ _id: id, userId } as FilterQuery<T>).exec();
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError(`Failed to find user document`, error);
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
      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid user ID format");
      }

      if (!data || Object.keys(data).length === 0) {
        throw new ValidationError("Document data cannot be empty");
      }
      const document = new this.model({ ...data, userId });
      return (await document.save()) as T;
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;

      if (error instanceof Error && error.name === "ValidationError") {
        throw new ValidationError(`Validation failed: ${error.message}`);
      }

      if (error && typeof error === "object" && "code" in error && error.code === 11000) {
        throw new ConflictError("Document with this data already exists for user");
      }

      throw new InternalServerError(`Failed to create user document`, error);
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
      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid user ID format");
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new ValidationError("Data must be a non-empty array");
      }
      const documents = await this.model.insertMany(data.map((d) => ({ ...d, userId })));
      return documents as T[];
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;

      if (error instanceof Error && error.name === "ValidationError") {
        throw new ValidationError(`Validation failed: ${error.message}`);
      }

      if (error && typeof error === "object" && "code" in error && error.code === 11000) {
        throw new ConflictError("One or more documents already exist for user");
      }

      throw new InternalServerError(`Failed to create user documents`, error);
    }
  }

  /**
   * Update a document by ID for a specific user.
   * @param id The document ID.
   * @param data The update data (Mongoose update query).
   * @param userId The user's ID.
   * @returns Promise resolving to the updated document or null.
   */
  public async updateForUser(
    id: string,
    data: UpdateQuery<T>,
    userId: string
  ): Promise<T | null> {
    try {
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid document ID format");
      }

      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid user ID format");
      }

      if (!data || Object.keys(data).length === 0) {
        throw new ValidationError("Update data cannot be empty");
      }

      return await this.model
        .findOneAndUpdate({ _id: id, userId } as FilterQuery<T>, data, { new: true })
        .exec();
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;

      if (error instanceof Error && error.name === "ValidationError") {
        throw new ValidationError(`Validation failed: ${error.message}`);
      }

      throw new InternalServerError(`Failed to update user document`, error);
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
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid document ID format");
      }

      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid user ID format");
      }

      return await this.model
        .findOneAndDelete({ _id: id, userId } as FilterQuery<T>)
        .exec();
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;
      throw new InternalServerError(`Failed to delete user document`, error);
    }
  }

  /**
   * Delete all documents for a specific user.
   * @param userId The user's ID.
   * @returns Promise resolving when deletion is complete.
   */
  public async deleteAllForUser(userId: string): Promise<void> {
    try {
      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid user ID format");
      }

      await this.model.deleteMany({ userId } as FilterQuery<T>).exec();
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError(`Failed to delete all user documents`, error);
    }
  }
}
