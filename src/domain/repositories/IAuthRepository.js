export class IAuthRepository {
  register(username, email, password) {
    throw new Error("Method 'register()' must be implemented.");
  }

  login(email, password) {
    throw new Error("Method 'login()' must be implemented.");
  }
}
