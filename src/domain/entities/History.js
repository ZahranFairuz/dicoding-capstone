export class HistoryItem {
  constructor({
    id,
    user_id,
    category_id,
    name,
    amount,
    type,
    description,
    date,
    created_at,
    category_name,
  }) {
    this.id = id;
    this.userId = user_id;
    this.categoryId = category_id;
    this.name = name;
    this.amount = parseFloat(amount);
    this.type = type; // 'income' or 'expense'
    this.description = description;
    this.date = date;
    this.createdAt = created_at;
    this.categoryName = category_name;
  }
}

export class HistoryResponse {
  constructor({ history, total, page, limit }) {
    this.items = history.map(h => new HistoryItem(h));
    this.total = parseInt(total);
    this.page = parseInt(page);
    this.limit = parseInt(limit);
  }

  get totalPages() {
    return Math.ceil(this.total / this.limit);
  }

  get hasNextPage() {
    return this.page < this.totalPages;
  }

  get hasPreviousPage() {
    return this.page > 1;
  }
}
