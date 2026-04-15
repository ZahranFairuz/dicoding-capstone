export class Category {
  constructor({ id, user_id, name, type, created_at }) {
    this.id = id;
    this.userId = user_id;
    this.name = name;
    this.type = type; // 'expense' or 'income'
    this.createdAt = created_at;
  }
}
