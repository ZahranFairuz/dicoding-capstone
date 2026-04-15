export class CreateCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(name, type) {
    if (!name || !type) {
      throw new Error('Name and type are required');
    }

    if (!['income', 'expense'].includes(type)) {
      throw new Error('Type must be either "income" or "expense"');
    }

    return await this.categoryRepository.create(name, type);
  }
}
