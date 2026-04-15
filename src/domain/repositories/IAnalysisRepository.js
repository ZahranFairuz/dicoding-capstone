export class IAnalysisRepository {
  getSummary() {
    throw new Error("Method 'getSummary()' must be implemented.");
  }

  getByCategory(month) {
    throw new Error("Method 'getByCategory()' must be implemented.");
  }

  getInsights() {
    throw new Error("Method 'getInsights()' must be implemented.");
  }
}
