export class AnalysisSummary {
  constructor({
    this_month_income,
    this_month_expense,
    this_month_savings,
    last_month_income,
    last_month_expense,
    last_month_savings,
    income_change_percent,
    expense_change_percent,
    savings_change_percent,
  }) {
    this.thisMonthIncome = parseFloat(this_month_income);
    this.thisMonthExpense = parseFloat(this_month_expense);
    this.thisMonthSavings = parseInt(this_month_savings);
    this.lastMonthIncome = parseFloat(last_month_income);
    this.lastMonthExpense = parseFloat(last_month_expense);
    this.lastMonthSavings = parseInt(last_month_savings);
    this.incomeChangePercent = income_change_percent;
    this.expenseChangePercent = expense_change_percent;
    this.savingsChangePercent = savings_change_percent;
  }
}

export class CategoryAnalysis {
  constructor({ id, name, type, total_amount, total_transactions }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.totalAmount = parseFloat(total_amount);
    this.totalTransactions = parseInt(total_transactions);
  }
}
