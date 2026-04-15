export class LoginUser {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(email, password) {
    // Basic validation logic
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    return await this.authRepository.login(email, password);
  }
}
