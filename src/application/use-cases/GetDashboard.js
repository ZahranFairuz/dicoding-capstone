export class GetDashboard {
  constructor(dashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  async execute() {
    return await this.dashboardRepository.getDashboard();
  }
}
