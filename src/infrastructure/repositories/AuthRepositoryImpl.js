import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class AuthRepositoryImpl extends IAuthRepository {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
  }

  async register(username, email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Map API response to Domain Entity
      return {
        message: data.message,
        user: new User(data.user)
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Map API response to Domain Entity and store token
      return {
        message: data.message,
        token: data.token,
        user: new User(data.user)
      };
    } catch (error) {
      throw error;
    }
  }
}
