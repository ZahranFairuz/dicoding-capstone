export class GetCategoryStats {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute() {
    return await this.categoryRepository.getStats();
  }
}
