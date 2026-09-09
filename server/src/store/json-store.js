import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(__dirname, '../../data');

export class JsonStore {
  constructor(fileName) {
    this.fileName = fileName;
    this.filePath = path.join(DATA_DIR, `${fileName}.json`);
    this.data = [];
    this.load();
  }

  load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = [];
        this.persist();
      }
    } catch {
      this.data = [];
    }
  }

  persist() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  findAll() {
    return [...this.data];
  }

  findById(id) {
    return this.data.find((item) => item.id === id);
  }

  create(item) {
    this.data.push(item);
    this.persist();
    return item;
  }

  update(id, updates) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    this.data[index] = { ...this.data[index], ...updates };
    this.persist();
    return this.data[index];
  }

  delete(id) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.data.splice(index, 1);
    this.persist();
    return true;
  }

  findByPredicate(predicate) {
    return this.data.filter(predicate);
  }

  count(predicate) {
    return predicate ? this.data.filter(predicate).length : this.data.length;
  }
}