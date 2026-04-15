export class IHistoryRepository {
  getHistory(filters = {}) {
    throw new Error("Method 'getHistory()' must be implemented.");
  }
}
