import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Flame,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
  X,
  Layers,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../lib/api';
import { productFormSchema, ProductFormValues } from '../lib/schemas';
import { useToast } from '../context/ToastContext';
import { Drawer } from '../components/Drawer';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { SkeletonTable } from '../components/SkeletonTable';
import { EmptyState } from '../components/EmptyState';
import { formatCategory, slugify, formatDate } from '../lib/utils';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { success, error: toastError, info } = useToast();

  // Filters and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'createdAt'>('order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(8);
  const [showDeleted, setShowDeleted] = useState(false);

  // Drawer / Modal state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle URL query action param (e.g. ?action=create or ?edit=prd-101)
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'create') {
      openCreateDrawer();
    } else if (editId) {
      api.products.getById(editId).then((prod) => {
        if (prod) openEditDrawer(prod);
      });
    }
  }, [searchParams]);

  // Query: Products List
  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['products', { debouncedSearch, selectedCategory, sortBy, sortOrder, page, limit, showDeleted }],
    queryFn: () =>
      api.products.list({
        search: debouncedSearch,
        category: selectedCategory,
        sortBy,
        sortOrder,
        page,
        limit,
      }),
    staleTime: 30000,
  });

  // React Hook Form for Create/Edit
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      category: 'fire-extinguisher',
      description: '',
      image: '',
      order: 1,
      graphicType: '',
      specs: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specs',
  });

  const watchedName = watch('name');
  const watchedImage = watch('image');

  // Mutation: Create Product (with Optimistic Update)
  const createMutation = useMutation({
    mutationFn: (data: ProductFormValues) => api.products.create(data),
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData(['products']);
      return { previous };
    },
    onError: (err, newProduct, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['products'], context.previous);
      }
      toastError('Creation Failed', (err as any).message || 'Unable to create product.');
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Product Created', `"${created.name}" was added to the equipment catalog.`);
      closeDrawer();
    },
  });

  // Mutation: Update Product (with Optimistic Update)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => api.products.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData(['products']);
      return { previous };
    },
    onError: (err, variables, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['products'], context.previous);
      }
      toastError('Update Failed', (err as any).message || 'Unable to update product.');
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Product Updated', `"${updated.name}" specifications updated successfully.`);
      closeDrawer();
    },
  });

  // Mutation: Soft Delete Product
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.products.delete(id),
    onSuccess: (_deleted, productId) => {
      const deletedProduct = productsData?.data?.find((p) => p.id === productId);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Product Soft-Deleted', `"${deletedProduct?.name || 'Product'}" has been marked as inactive.`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    },
    onError: (err: any) => {
      toastError('Deletion Failed', err.message || 'Unable to soft-delete product.');
    },
  });

  // Open Create Drawer
  const openCreateDrawer = () => {
    setEditingProduct(null);
    reset({
      name: '',
      slug: '',
      category: 'fire-extinguisher',
      description: '',
      image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
      order: (productsData?.pagination?.total || 0) + 1,
      graphicType: 'ISO 7010 Certified',
      specs: [
        { label: 'Discharge Range', value: '4 to 6 Meters' },
        { label: 'Working Pressure', value: '14 Bar @ 20°C' },
      ],
    });
    setDrawerOpen(true);
  };

  // Open Edit Drawer
  const openEditDrawer = (prod: Product) => {
    setEditingProduct(prod);
    reset({
      name: prod.name,
      slug: prod.slug,
      category: prod.category as any,
      description: prod.description || '',
      image: prod.image || '',
      order: prod.order || 0,
      graphicType: prod.graphicType || '',
      specs: prod.specs || [],
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
    // Clear URL search params
    setSearchParams({});
  };

  const handleGenerateSlug = () => {
    if (watchedName) {
      setValue('slug', slugify(watchedName), { shouldValidate: true });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const { imageUrl } = await api.products.uploadImage(file);
      setValue('image', imageUrl);
    } catch (err) {
      toastError('Upload Failed', (err as Error).message);
    } finally {
      setUploadingImage(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmitForm = async (values: ProductFormValues) => {
    if (editingProduct) {
      await updateMutation.mutateAsync({
        id: editingProduct.id,
        data: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const handleAddSpecRow = () => {
    if (fields.length < 20) {
      append({ label: '', value: '' });
    } else {
      info('Limit Reached', 'A product can have a maximum of 20 specification attributes.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Fire Safety Equipment Catalog
            {isFetching && <Loader2 className="w-4 h-4 text-[#E5252B] animate-spin" />}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage product specifications, classification badges, and visual metadata
          </p>
        </div>

        <button
          type="button"
          id="btn-create-product-main"
          onClick={openCreateDrawer}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-sm font-bold shadow-lg shadow-[#E5252B]/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Toolbar Controls */}
      <div className="p-4 rounded-xl bg-[#262C31] border border-[#2D3439] flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="w-full lg:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-product-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, slug, specs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1A1E21] border border-[#2D3439] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E5252B] focus:ring-1 focus:ring-[#E5252B] transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              id="btn-clear-search"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="w-full lg:w-auto flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              id="select-category-filter"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg bg-[#1A1E21] border border-[#2D3439] text-xs font-semibold text-gray-200 focus:outline-none focus:border-[#E5252B] cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="fire-protection-system">Fire Protection System</option>
              <option value="fire-detection-alarm-system">Fire Detection & Alarm System</option>
              <option value="fire-suppression-system">Fire Suppression System</option>
              <option value="fire-extinguisher">Fire Extinguisher</option>
              <option value="ms-seamless-pipe">MS Seamless Pipe</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              id="select-sort-filter"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-') as [any, any];
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="px-3 py-2 rounded-lg bg-[#1A1E21] border border-[#2D3439] text-xs font-semibold text-gray-200 focus:outline-none focus:border-[#E5252B] cursor-pointer"
            >
              <option value="order-asc">Display Order (Asc)</option>
              <option value="order-desc">Display Order (Desc)</option>
              <option value="name-asc">Product Name (A-Z)</option>
              <option value="name-desc">Product Name (Z-A)</option>
              <option value="createdAt-desc">Newest Added</option>
            </select>          </div>
        </div>
      </div>

      {/* Table Container */}
      {isLoading ? (
        <SkeletonTable rows={limit} columns={7} />
      ) : !productsData?.data?.length ? (
        <EmptyState
          title="No Products Found"
          description={
            debouncedSearch || selectedCategory !== 'all'
              ? 'No fire safety equipment matched your filter criteria. Try adjusting your search query.'
              : 'The equipment catalog is currently empty. Get started by adding your first product.'
          }
          actionLabel="Add New Product"
          onAction={openCreateDrawer}
        />
      ) : (
        <div className="bg-[#262C31] rounded-xl border border-[#2D3439] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1A1E21] text-gray-400 uppercase text-[11px] font-bold tracking-wider border-b border-[#2D3439]">
                <tr>
                  <th scope="col" className="py-4 px-4 w-16 text-center">
                    Thumbnail
                  </th>
                  <th scope="col" className="py-4 px-4">
                    Product Name & Info
                  </th>
                  <th scope="col" className="py-4 px-4">
                    Slug Identifier
                  </th>
                  <th scope="col" className="py-4 px-4">
                    Category
                  </th>
                  <th scope="col" className="py-4 px-4 text-center">
                    Order
                  </th>
                  <th scope="col" className="py-4 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-4 px-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2D3439]">
                {productsData.data.map((product) => (
                  <tr
                    key={product.id}
                    id={`product-row-${product.id}`}
                    className="hover:bg-[#1A1E21]/50 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <td className="py-3.5 px-4 text-center">
                      <img
                        src={
                          product.image ||
                          'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-[#2D3439] mx-auto shadow-sm"
                      />
                    </td>

                    {/* Name & Specs count */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white leading-tight max-w-sm truncate group-hover:text-[#E5252B] transition-colors">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>{product.specs?.length || 0} specifications</span>
                        {product.graphicType && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">{product.graphicType}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4">
                      <code className="text-xs font-mono text-gray-300 bg-[#1A1E21] px-2 py-1 rounded border border-[#2D3439] max-w-[200px] truncate block">
                        {product.slug}
                      </code>
                    </td>

                    {/* Category badge */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-[#1A1E21] text-gray-200 border border-[#2D3439]">
                        {formatCategory(product.category)}
                      </span>
                    </td>

                    {/* Order */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-300">
                      #{product.order}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {product.isDeleted ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          Deleted
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          id={`btn-edit-product-${product.id}`}
                          onClick={() => openEditDrawer(product)}
                          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1A1E21] transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          id={`btn-delete-product-${product.id}`}
                          onClick={() => {
                            setProductToDelete(product);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#E5252B] hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Soft delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-[#1A1E21] border-t border-[#2D3439] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <div>
              Showing <span className="font-bold text-white">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-bold text-white">{Math.min(page * limit, productsData.pagination.total)}</span> of{' '}
              <span className="font-bold text-white">{productsData.pagination.total}</span> products
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-prev-page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg bg-[#262C31] text-gray-300 hover:text-white border border-[#2D3439] disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-semibold text-white">
                Page {page} of {productsData.pagination.totalPages}
              </span>

              <button
                type="button"
                id="btn-next-page"
                onClick={() => setPage((p) => Math.min(productsData.pagination.totalPages, p + 1))}
                disabled={page >= productsData.pagination.totalPages}
                className="p-2 rounded-lg bg-[#262C31] text-gray-300 hover:text-white border border-[#2D3439] disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Drawer: Create & Edit Form */}
      <Drawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        title={editingProduct ? 'Edit Product Details' : 'Create Fire Safety Product'}
        subtitle={editingProduct ? `Editing: ${editingProduct.name}` : 'Add standard industrial fire equipment to catalog'}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              id="btn-cancel-drawer"
              onClick={closeDrawer}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-[#384046] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              id="btn-save-product-drawer"
              onClick={handleSubmit(onSubmitForm)}
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-sm font-bold shadow-lg shadow-[#E5252B]/25 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {(isSubmitting || createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5" noValidate>
          {/* Product Name */}
          <div>
            <label htmlFor="input-prod-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Product Title *
            </label>
            <input
              id="input-prod-name"
              type="text"
              placeholder="e.g. SAFEMETE Pro-5 CO2 Extinguisher 5kg"
              {...register('name')}
              className={`w-full px-4 py-2.5 rounded-xl bg-[#191D20] border text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                errors.name ? 'border-red-500 ring-2 ring-red-500/20' : 'border-[#384046] focus:border-[#E5252B]'
              }`}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          {/* Slug with Auto-generate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-prod-slug" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                URL Slug *
              </label>
              <button
                type="button"
                id="btn-autogen-slug"
                onClick={handleGenerateSlug}
                className="text-xs text-[#E5252B] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Auto-generate from Name
              </button>
            </div>
            <input
              id="input-prod-slug"
              type="text"
              placeholder="safemete-pro-5-co2-extinguisher-5kg"
              {...register('slug')}
              className={`w-full px-4 py-2.5 rounded-xl bg-[#191D20] font-mono border text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                errors.slug ? 'border-red-500 ring-2 ring-red-500/20' : 'border-[#384046] focus:border-[#E5252B]'
              }`}
            />
            {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>}
          </div>

          {/* Category & Order Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="select-prod-category" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                id="select-prod-category"
                {...register('category')}
                className="w-full px-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white focus:outline-none focus:border-[#E5252B] cursor-pointer"
              >
                <option value="fire-protection-system">Fire Protection System</option>
                <option value="fire-detection-alarm-system">Fire Detection & Alarm System</option>
                <option value="fire-suppression-system">Fire Suppression System</option>
                <option value="fire-extinguisher">Fire Extinguisher</option>
                <option value="ms-seamless-pipe">MS Seamless Pipe</option>
              </select>
              {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label htmlFor="input-prod-order" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Display Order Number
              </label>
              <input
                id="input-prod-order"
                type="number"
                {...register('order', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white focus:outline-none focus:border-[#E5252B]"
              />
              {errors.order && <p className="text-xs text-red-400 mt-1">{errors.order.message}</p>}
            </div>
          </div>

          {/* Graphic Type */}
          <div>
            <label htmlFor="input-prod-graphic" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Graphic Type / Certification Standard
            </label>
            <input
              id="input-prod-graphic"
              type="text"
              placeholder="e.g. ISO 7010 / EN3-7 / UL 268"
              {...register('graphicType')}
              className="w-full px-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5252B]"
            />
          </div>

          {/* Image URL & Upload */}
          <div>
            <label htmlFor="input-prod-image" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Image URL
            </label>
            <div className="flex gap-2">
              <input
                id="input-prod-image"
                type="text"
                placeholder="https://images.unsplash.com/..."
                {...register('image')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5252B]"
              />
              <button
                type="button"
                id="btn-upload-image"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-slate-300 hover:bg-[#282E32] hover:text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                title="Upload image from file"
              >
                {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
            {watchedImage && (
              <div className="mt-2.5 p-2 rounded-xl bg-[#191D20] border border-[#384046] flex items-center gap-3">
                <img
                  src={watchedImage}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-[#384046]"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <div className="text-xs text-slate-400">
                  <p className="font-semibold text-slate-200">Image Preview Active</p>
                  <p className="truncate max-w-xs">{watchedImage}</p>
                </div>
              </div>
            )}
            {errors.image && <p className="text-xs text-red-400 mt-1">{errors.image.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="textarea-prod-desc" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Technical Description
            </label>
            <textarea
              id="textarea-prod-desc"
              rows={3}
              placeholder="Detail operating pressure, certified fire rating, material construction..."
              {...register('description')}
              className="w-full px-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5252B]"
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
          </div>

          {/* Dynamic Specs Builder */}
          <div className="pt-4 border-t border-[#384046]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Technical Specifications (Key-Value)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Add dynamic specifications (up to 20 items)
                </p>
              </div>
              <button
                type="button"
                id="btn-add-spec-row"
                onClick={handleAddSpecRow}
                className="px-3 py-1.5 rounded-lg bg-[#191D20] hover:bg-[#282E32] text-xs font-bold text-[#E5252B] border border-[#384046] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Spec Row
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div key={`spec-${index}`} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Label (e.g. Fire Rating)"
                    {...register(`specs.${index}.label` as const)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#191D20] border border-[#384046] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5252B]"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 89B, E)"
                    {...register(`specs.${index}.value` as const)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#191D20] border border-[#384046] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5252B]"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove specification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {!fields.length && (
                <p className="text-xs text-slate-500 italic py-2">
                  No technical specifications added yet. Click &quot;Add Spec Row&quot; to append parameters.
                </p>
              )}
            </div>
          </div>
        </form>
      </Drawer>

      {/* Confirmation Modal: Soft Delete */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={() => {
          if (productToDelete) {
            deleteMutation.mutate(productToDelete.id);
          }
        }}
        title="Soft-Delete Product?"
        description={`Are you sure you want to mark "${productToDelete?.name}" as inactive? It will be removed from customer-facing catalogs while retaining audit trail history.`}
        confirmLabel="Soft Delete"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
