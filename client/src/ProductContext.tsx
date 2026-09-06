import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, PublicProduct } from './api';
import { ProductCategorySlug, ProductItem, ITEM_BY_IMAGE } from './productsData';

interface ProductContextValue {
  products: ProductItem[];
  loading: boolean;
  error: string | null;
  getBySlug: (slug: string) => ProductItem | undefined;
  getByCategory: (categorySlug: string) => ProductItem[];
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

function toProductItem(p: PublicProduct): ProductItem {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category as ProductCategorySlug,
    image: p.image ? (ITEM_BY_IMAGE[p.image] || p.image) : undefined,
    order: p.order ?? 0,
    graphicType: p.graphicType,
    specs: p.specs,
    description: p.description,
  };
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.products.list();
        if (!active) return;
        setProducts(data.map(toProductItem));
        setError(null);
      } catch (err) {
        if (active) {
          setError((err as Error).message);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const getBySlug = useCallback((slug: string) => products.find((p) => p.slug === slug), [products]);
  const getByCategory = useCallback(
    (categorySlug: string) =>
      products.filter((p) => p.category === categorySlug).sort((a, b) => a.order - b.order),
    [products]
  );

  const value: ProductContextValue = {
    products,
    loading,
    error,
    getBySlug,
    getByCategory,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export function useProducts(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
}
