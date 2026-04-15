export class GetHistory {
  constructor(historyRepository) {
    this.historyRepository = historyRepository;
  }

  async execute(filters = {}) {
    // Validate filter parameters
    if (filters.page && isNaN(parseInt(filters.page))) {
      throw new Error('Invalid page number');
    }

    if (filters.limit && isNaN(parseInt(filters.limit))) {
      throw new Error('Invalid limit value');
    }

    if (filters.start_date && isNaN(Date.parse(filters.start_date))) {
      throw new Error('Invalid start date format');
    }

    if (filters.end_date && isNaN(Date.parse(filters.end_date))) {
      throw new Error('Invalid end date format');
    }

    if (filters.type && !['income', 'expense'].includes(filters.type)) {
      throw new Error('Type must be either "income" or "expense"');
    }

    return await this.historyRepository.getHistory(filters);
  }
}
