export class DeleteCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('ID is required');
    }

    return await this.categoryRepository.delete(id);
  }
}
