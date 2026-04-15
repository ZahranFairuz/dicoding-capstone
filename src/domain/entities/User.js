export class User {
  constructor({ id, username, email, created_at }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.createdAt = created_at;
  }
}
