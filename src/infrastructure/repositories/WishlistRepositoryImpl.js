export class WishlistRepositoryImpl {
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
    const res = await fetch(`${this.baseUrl}/api/wishlists`, { headers: this.headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch wishlists');
    return data.wishlists;
  }

  async getStats() {
    const res = await fetch(`${this.baseUrl}/api/wishlists/stats`, { headers: this.headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
    return data.stats;
  }

  async create(payload) {
    const res = await fetch(`${this.baseUrl}/api/wishlists`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create wishlist');
    return data.wishlist;
  }

  async update(id, payload) {
    const res = await fetch(`${this.baseUrl}/api/wishlists/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update wishlist');
    return data.wishlist;
  }

  async delete(id) {
    const res = await fetch(`${this.baseUrl}/api/wishlists/${id}`, {
      method: 'DELETE',
      headers: this.headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete wishlist');
    return data.message;
  }
}
