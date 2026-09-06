import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../data');

export class JsonStore<T extends { id: string }> {
  private filePath: string;
  private data: T[] = [];

  constructor(private fileName: string) {
    this.filePath = path.join(DATA_DIR, `${fileName}.json`);
    this.load();
  }

  private load(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw) as T[];
      } else {
        this.data = [];
        this.persist();
      }
    } catch {
      this.data = [];
    }
  }

  private persist(): void {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  findAll(): T[] {
    return [...this.data];
  }

  findById(id: string): T | undefined {
    return this.data.find((item) => item.id === id);
  }

  create(item: T): T {
    this.data.push(item);
    this.persist();
    return item;
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    this.data[index] = { ...this.data[index], ...updates };
    this.persist();
    return this.data[index];
  }

  delete(id: string): boolean {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.data.splice(index, 1);
    this.persist();
    return true;
  }

  findByPredicate(predicate: (item: T) => boolean): T[] {
    return this.data.filter(predicate);
  }

  count(predicate?: (item: T) => boolean): number {
    return predicate ? this.data.filter(predicate).length : this.data.length;
  }
}
