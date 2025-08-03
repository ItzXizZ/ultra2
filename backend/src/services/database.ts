import fs from 'fs';
import path from 'path';
import { databaseConfig } from '@/config/database';

export class DatabaseService {
  private dataDir: string;

  constructor() {
    this.dataDir = path.resolve(databaseConfig.json.dataDir);
    this.ensureDataDirectory();
  }

  private ensureDataDirectory(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private getFilePath(fileName: string): string {
    return path.join(this.dataDir, fileName);
  }

  async readData<T>(fileName: string): Promise<T[]> {
    try {
      const filePath = this.getFilePath(fileName);
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${fileName}:`, error);
      return [];
    }
  }

  async writeData<T>(fileName: string, data: T[]): Promise<void> {
    try {
      const filePath = this.getFilePath(fileName);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${fileName}:`, error);
      throw error;
    }
  }

  async findById<T>(fileName: string, id: string): Promise<T | null> {
    const data = await this.readData<T>(fileName);
    return data.find((item: any) => item.id === id) || null;
  }

  async create<T>(fileName: string, item: T): Promise<T> {
    const data = await this.readData<T>(fileName);
    data.push(item);
    await this.writeData(fileName, data);
    return item;
  }

  async update<T>(fileName: string, id: string, updates: Partial<T>): Promise<T | null> {
    const data = await this.readData<T>(fileName);
    const index = data.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      return null;
    }

    data[index] = { ...data[index], ...updates };
    await this.writeData(fileName, data);
    return data[index];
  }

  async delete<T>(fileName: string, id: string): Promise<boolean> {
    const data = await this.readData<T>(fileName);
    const filteredData = data.filter((item: any) => item.id !== id);
    
    if (filteredData.length === data.length) {
      return false;
    }

    await this.writeData(fileName, filteredData);
    return true;
  }

  async findWhere<T>(fileName: string, predicate: (item: T) => boolean): Promise<T[]> {
    const data = await this.readData<T>(fileName);
    return data.filter(predicate);
  }

  async count<T>(fileName: string, predicate?: (item: T) => boolean): Promise<number> {
    const data = await this.readData<T>(fileName);
    if (predicate) {
      return data.filter(predicate).length;
    }
    return data.length;
  }

  // Initialize default data
  async initializeDefaultData(): Promise<void> {
    // Create default admin user if it doesn't exist
    const users = await this.readData('users.json');
    if (users.length === 0) {
      const defaultAdmin = {
        id: 'admin-001',
        email: 'admin@ultraportal.com',
        username: 'admin',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await this.create('users.json', defaultAdmin);
      console.log('✅ Default admin user created');
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService(); 