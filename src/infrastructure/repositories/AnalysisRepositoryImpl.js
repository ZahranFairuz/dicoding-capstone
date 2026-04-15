import { AnalysisSummary, CategoryAnalysis } from '../../domain/entities/Analysis';
import { IAnalysisRepository } from '../../domain/repositories/IAnalysisRepository';

export class AnalysisRepositoryImpl extends IAnalysisRepository {
  constructor(baseUrl, authToken) {
    super();
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  async getSummary() {
    try {
      const response = await fetch(`${this.baseUrl}/api/analysis/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch analysis summary');
      }

      return new AnalysisSummary(data.summary);
    } catch (error) {
      throw error;
    }
  }

  async getByCategory(month) {
    try {
      const params = new URLSearchParams();
      if (month) {
        params.append('month', month);
      }

      const url = `${this.baseUrl}/api/analysis/by-category${params.toString() ? '?' + params.toString() : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch category analysis');
      }

      return data.by_category.map(cat => new CategoryAnalysis(cat));
    } catch (error) {
      throw error;
    }
  }

  async getInsights() {
    try {
      const response = await fetch(`${this.baseUrl}/api/analysis/insight`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch insights');
      }

      return data.insights;
    } catch (error) {
      throw error;
    }
  }
}
