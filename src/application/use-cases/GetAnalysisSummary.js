export class GetAnalysisSummary {
  constructor(analysisRepository) {
    this.analysisRepository = analysisRepository;
  }

  async execute() {
    return await this.analysisRepository.getSummary();
  }
}
