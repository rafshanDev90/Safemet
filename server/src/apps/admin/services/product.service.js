import { v4 as uuidv4 } from 'uuid';
import { JsonStore } from '../../../store/json-store.js';

const store = new JsonStore('products');

export class ProductService {
  static findAll() {
    return store.findAll().filter((p) => !p.isDeleted);
  }

  static findById(id) {
    const product = store.findById(id);
    if (!product || product.isDeleted) return undefined;
    return product;
  }

  static findBySlug(slug) {
    const product = store.findByPredicate((p) => p.slug === slug && !p.isDeleted)[0];
    return product;
  }

  static findPaginated(query) {
    const { page, limit, search, category, sortBy, sortOrder } = query;

    let items = store.findAll().filter((p) => !p.isDeleted);

    if (search) {
      const term = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term))
      );
    }

    if (category && category !== 'all') {
      items = items.filter((p) => p.category === category);
    }

    const sortField = sortBy ?? 'order';
    items.sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc'
        ? aVal - bVal
        : bVal - aVal;
    });

    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = items.slice(start, start + limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static slugExists(slug, excludeId) {
    return store
      .findByPredicate((p) => !p.isDeleted)
      .some((p) => p.slug === slug && p.id !== excludeId);
  }

  static create(input) {
    const now = new Date().toISOString();
    const product = {
      id: uuidv4(),
      name: input.name,
      slug: input.slug,
      category: input.category,
      image: input.image || undefined,
      order: input.order ?? 0,
      graphicType: input.graphicType || undefined,
      specs: input.specs || [],
      description: input.description || undefined,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
    return store.create(product);
  }

  static update(id, input) {
    const existing = store.findById(id);
    if (!existing || existing.isDeleted) return undefined;

    const updated = store.update(id, {
      ...input,
      updatedAt: new Date().toISOString(),
    });
    return updated;
  }

  static softDelete(id) {
    const existing = store.findById(id);
    if (!existing || existing.isDeleted) return false;
    store.update(id, { isDeleted: true, updatedAt: new Date().toISOString() });
    return true;
  }

  static restore(id) {
    const existing = store.findById(id);
    if (!existing) return false;
    store.update(id, { isDeleted: false, updatedAt: new Date().toISOString() });
    return true;
  }
}