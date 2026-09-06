import React from 'react';
import { ProductItem } from '../productsData';
import { ProductCard } from './ProductCard';

interface ProductCategoryGridProps {
  products: ProductItem[];
  onSelectProduct: (productSlug: string) => void;
}

export const ProductCategoryGrid: React.FC<ProductCategoryGridProps> = ({
  products,
  onSelectProduct,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-12 lg:gap-x-14 gap-y-12 sm:gap-y-16 lg:gap-y-20">
      {products.map((item, index) => {
        // Formats number to 01, 02, 03... dynamic for this active category
        const displayNumber = String(index + 1).padStart(2, '0');
        return (
          <ProductCard
            key={item.id}
            product={item}
            displayNumber={displayNumber}
            onClick={() => onSelectProduct(item.slug)}
          />
        );
      })}
    </div>
  );
};
