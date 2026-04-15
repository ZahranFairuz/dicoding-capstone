export class GetAnalysisInsights {
  constructor(analysisRepository) {
    this.analysisRepository = analysisRepository;
  }

  async execute() {
    return await this.analysisRepository.getInsights();
  }
}
