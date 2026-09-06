export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  image?: string;
  order: number;
  graphicType?: string;
  specs?: { label: string; value: string }[];
  description?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000/api';

async function request<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error(`Network error connecting to ${API_BASE_URL}: ${(err as Error).message}`);
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new Error(json.message || 'Request failed');
  }
  return json.data as T;
}

export const api = {
  products: {
    list: async (params?: { category?: string }): Promise<PublicProduct[]> => {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') {
        query.set('category', params.category);
      }
      query.set('limit', '200');
      const qs = query.toString();
      return request<PublicProduct[]>(`/products${qs ? `?${qs}` : ''}`);
    },
    getBySlug: async (slug: string): Promise<PublicProduct> => {
      return request<PublicProduct>(`/products/slug/${encodeURIComponent(slug)}`);
    },
  },
};
