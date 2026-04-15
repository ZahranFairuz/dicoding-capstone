export class GetAllCategories {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute() {
    return await this.categoryRepository.getAll();
  }
}
