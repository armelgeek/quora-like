import 'server-only';
import { z } from 'zod';
import { Filter } from '../types/filter';

export interface UseCaseOperations<T, P, R> {
  create?: (data: P) => Promise<R>;
  getById?: (id: string) => Promise<T | null>;
  update?: (id: string, data: P) => Promise<R>;
  delete?: (id: string) => Promise<R>;
  list?: (filter: Filter) => Promise<{ data: T[]; meta: unknown }>;
  [key: string]: ((...args: never[]) => Promise<unknown>) | undefined;
}


export interface UseCaseOptions<T, P, R> {
  name: string;
  schema?: z.ZodType<P>;
  operations: UseCaseOperations<T, P, R>;
}

export class UseCase<T, P, R> {
  private readonly name: string;
  private readonly schema?: z.ZodType<P>;
  private readonly operations: UseCaseOperations<T, P, R>;

  constructor(options: UseCaseOptions<T, P, R>) {
    this.name = options.name;
    this.schema = options.schema;
    this.operations = options.operations;
  }


  
  private validate(data: P): P {
    if (this.schema) {
      try {
        const schemaShape = this.schema instanceof z.ZodObject ? this.schema.shape : {};
        const schemaFields = Object.keys(schemaShape);
        const fieldsToValidate: Record<string, unknown> = {};
        const additionalFields: Record<string, unknown> = {};
        
        Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
          if (schemaFields.includes(key)) {
            fieldsToValidate[key] = value;
          } else {
            additionalFields[key] = value;
          }
        });
        const validatedData = this.schema.parse(fieldsToValidate);
        return { ...validatedData, ...additionalFields } as P;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw error;
        }
        return data;
      }
    }
    return data;
  }

  private checkOperation(operation: string): void {
    if (!this.operations[operation]) {
      throw new Error(`Operation "${operation}" not implemented for ${this.name}`);
    }
  }

  async create(data: P): Promise<R> {
    this.checkOperation('create');
    const validData = this.validate(data);
    return this.operations.create!(validData);
  }

  async getById(id: string): Promise<T> {
    this.checkOperation('getById');
    const result = await this.operations.getById!(id);
    if (!result) {
      throw new Error(`${this.name} not found`);
    }
    return result;
  }

  async update(id: string, data: P): Promise<R> {
    this.checkOperation('update');

    if (this.operations.getById) {
      const existing = await this.operations.getById(id);
      if (!existing) {
        throw new Error(`${this.name} not found`);
      }
    }
    
    const validData = this.validate(data);
    return this.operations.update!(id, validData);
  }

  async delete(id: string): Promise<R> {
    this.checkOperation('delete');
    
    if (this.operations.getById) {
      const existing = await this.operations.getById(id);
      if (!existing) {
        throw new Error(`${this.name} not found`);
      }
    }
    
    return this.operations.delete!(id);
  }

  async list(filter: Filter): Promise<{ data: T[]; meta: unknown }> {
    this.checkOperation('list');
    return this.operations.list!(filter);
  }

  async execute<A extends unknown[], O>(operation: string, ...args: A): Promise<O> {
    this.checkOperation(operation);
    return (this.operations[operation] as unknown as (...args: A) => Promise<O>)(...args);
  }
}