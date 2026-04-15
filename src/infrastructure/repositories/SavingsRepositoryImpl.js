export class SavingsRepositoryImpl {
  constructor(baseUrl, authToken) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  get headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`,
    };
  }

  async getAll() {
    const res = await fetch(`${this.baseUrl}/api/savings`, { headers: this.headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch savings');
    return data.savings;
  }

  async getChart(period = 'monthly') {
    const res = await fetch(`${this.baseUrl}/api/savings/chart?period=${period}`, { headers: this.headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch chart');
    return data.chart;
  }

  async getSummary() {
    const res = await fetch(`${this.baseUrl}/api/savings/summary`, { headers: this.headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch summary');
    return data.summary;
  }

  async create(payload) {
    const res = await fetch(`${this.baseUrl}/api/savings`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create saving');
    return data.saving;
  }
}
