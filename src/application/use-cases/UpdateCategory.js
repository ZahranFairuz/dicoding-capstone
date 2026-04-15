export class UpdateCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id, name, type) {
    if (!id || !name || !type) {
      throw new Error('ID, name and type are required');
    }

    if (!['income', 'expense'].includes(type)) {
      throw new Error('Type must be either "income" or "expense"');
    }

    return await this.categoryRepository.update(id, name, type);
  }
}
