export class TransactionRepositoryImpl {
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

  async getAll(page = 1, limit = 10) {
    const res = await fetch(`${this.baseUrl}/api/transactions?page=${page}&limit=${limit}`, {
      headers: this.headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch transactions');
    return data;
  }

  async getSummary() {
    const res = await fetch(`${this.baseUrl}/api/transactions/summary`, {
      headers: this.headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch summary');
    return data.summary;
  }

  async create(payload) {
    const res = await fetch(`${this.baseUrl}/api/transactions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create transaction');
    return data.transaction;
  }

  async update(id, payload) {
    const res = await fetch(`${this.baseUrl}/api/transactions/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update transaction');
    return data.transaction;
  }

  async delete(id) {
    const res = await fetch(`${this.baseUrl}/api/transactions/${id}`, {
      method: 'DELETE',
      headers: this.headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete transaction');
    return data.message;
  }
}
