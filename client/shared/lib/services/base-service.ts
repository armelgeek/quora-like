
/**
 * Service de base pour les appels HTTP
 * Centralise la logique de fetch avec gestion d'erreurs et configuration commune
 */

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: {
    total: number;
    totalPages: number;
    page?: number;
    pageSize?: number;
  };
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export class BaseService {

  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl?: string, defaultHeaders: Record<string, string> = {}) {
    // Si baseUrl commence par /, on considère que c'est un chemin relatif à l'API (NEXT_PUBLIC_API_URL)
    if (baseUrl && baseUrl.startsWith('/')) {
      this.baseUrl = `${process.env.NEXT_PUBLIC_API_URL}${baseUrl}`;
    } else if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
    }
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  /**
   * Méthode générique pour faire des appels HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    let url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    // Corrige tout '/?' par '?' dans l'URL, même si ce n'est pas à la fin
    url = url.replace('/?', '?');
    // Supprime le slash final si l'URL ne contient pas de query string ni de sous-ressource
    if (url.endsWith('/') && !url.includes('?', url.length - 2) && !/\/.+\//.test(endpoint)) {
      url = url.slice(0, -1);
    }
    const config: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log(`[BaseService] ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Normaliser la réponse
      if (this.isApiResponse(data)) {
        return data as ApiResponse<T>;
      } else {
        // Si c'est un tableau ou un objet simple, l'envelopper
        return {
          data: data as T,
          meta: Array.isArray(data) ? { total: data.length, totalPages: 1 } : undefined,
        };
      }
    } catch (error) {
      console.error(`[BaseService] Error on ${config.method || 'GET'} ${url}:`, error);
      throw error;
    }
  }

  /**
   * Vérifier si la réponse suit le format ApiResponse
   */
  private isApiResponse(data: unknown): data is ApiResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'data' in data
    );
  }

  /**
   * Parser les erreurs de réponse
   */
  private async parseErrorResponse(response: Response): Promise<ApiError> {
    try {
      const errorData = await response.json();
      return {
        message: errorData.message || errorData.error || 'Une erreur est survenue',
        code: errorData.code,
        status: response.status,
        details: errorData.details,
      };
    } catch {
      return {
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }
  }

  

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload de fichier
   */
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Ne pas définir Content-Type, laisser le navigateur le faire pour FormData
        ...Object.fromEntries(
          Object.entries(this.defaultHeaders).filter(([key]) => key.toLowerCase() !== 'content-type')
        ),
      },
    });
  }

  /**
   * Liste les réservations avec pagination
   */
  async list(params?: Record<string, string | number | boolean>) {
    let query = '';
    if (params) {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) search.append(key, String(value));
      });
      query = `?${search.toString()}`;
    }
    return this.request(query ? query : '');
  }

  public async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }
}

// Instance par défaut
export const apiService = new BaseService();

// Helper pour créer des services spécialisés
export function createApiService(baseUrl?: string, headers?: Record<string, string>) {
  return new BaseService(baseUrl, headers);
}

export default BaseService;
