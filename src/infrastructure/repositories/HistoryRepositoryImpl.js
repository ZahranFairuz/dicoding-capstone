import { HistoryResponse } from '../../domain/entities/History.js';
import { IHistoryRepository } from '../../domain/repositories/IHistoryRepository.js';

export class HistoryRepositoryImpl extends IHistoryRepository {
  constructor(baseUrl, token) {
    super();
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async getHistory(filters = {}) {
    try {
      const url = new URL(`${this.baseUrl}/api/history`);

      // Add query parameters
      if (filters.search) {
        url.searchParams.append('search', filters.search);
      }
      if (filters.type) {
        url.searchParams.append('type', filters.type);
      }
      if (filters.start_date) {
        url.searchParams.append('start_date', filters.start_date);
      }
      if (filters.end_date) {
        url.searchParams.append('end_date', filters.end_date);
      }
      if (filters.page) {
        url.searchParams.append('page', filters.page);
      }
      if (filters.limit) {
        url.searchParams.append('limit', filters.limit);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch history');
      }

      const data = await response.json();
      return new HistoryResponse(data);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch history');
    }
  }
}
