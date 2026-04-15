import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

export class CategoryRepositoryImpl extends ICategoryRepository {
  constructor(baseUrl, authToken) {
    super();
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  async getAll() {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
      }

      // Map API response to Domain Entities
      return data.categories.map(cat => new Category(cat));
    } catch (error) {
      throw error;
    }
  }

  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch category stats');
      }

      return data.stats;
    } catch (error) {
      throw error;
    }
  }

  async create(name, type) {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({ name, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create category');
      }

      return {
        message: data.message,
        category: new Category(data.category),
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id, name, type) {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({ name, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update category');
      }

      return {
        message: data.message,
        category: new Category(data.category),
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete category');
      }

      return data.message;
    } catch (error) {
      throw error;
    }
  }
}
