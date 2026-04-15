export class GetCategoryAnalysis {
  constructor(analysisRepository) {
    this.analysisRepository = analysisRepository;
  }

  async execute(month) {
    if (!month) {
      throw new Error('Month parameter is required (format: YYYY-MM)');
    }

    return await this.analysisRepository.getByCategory(month);
  }
}
