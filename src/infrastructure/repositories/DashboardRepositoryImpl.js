import { Dashboard } from '../../domain/entities/Dashboard';
import { IDashboardRepository } from '../../domain/repositories/IDashboardRepository';

export class DashboardRepositoryImpl extends IDashboardRepository {
  constructor(baseUrl, authToken) {
    super();
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  async getDashboard() {
    try {
      const response = await fetch(`${this.baseUrl}/api/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard');
      }

      return new Dashboard(data);
    } catch (error) {
      throw error;
    }
  }
}
