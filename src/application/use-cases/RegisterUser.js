export class RegisterUser {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(username, email, password) {
    // Basic validation logic could go here
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }

    return await this.authRepository.register(username, email, password);
  }
}
