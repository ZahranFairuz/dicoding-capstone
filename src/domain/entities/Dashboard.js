export class DashboardSummary {
  constructor({
    today_income,
    today_expense,
    weekly_income,
    weekly_expense,
    monthly_income,
    monthly_expense,
    monthly_savings,
  }) {
    this.todayIncome = parseFloat(today_income);
    this.todayExpense = parseFloat(today_expense);
    this.weeklyIncome = parseFloat(weekly_income);
    this.weeklyExpense = parseFloat(weekly_expense);
    this.monthlyIncome = parseFloat(monthly_income);
    this.monthlyExpense = parseFloat(monthly_expense);
    this.monthlySavings = parseInt(monthly_savings);
  }
}

export class Transaction {
  constructor({
    id,
    user_id,
    category_id,
    name,
    amount,
    type,
    description,
    date,
    created_at,
    category_name,
  }) {
    this.id = id;
    this.userId = user_id;
    this.categoryId = category_id;
    this.name = name;
    this.amount = parseFloat(amount);
    this.type = type; // 'income' or 'expense'
    this.description = description;
    this.date = date;
    this.createdAt = created_at;
    this.categoryName = category_name;
  }
}

export class WishlistStats {
  constructor({ total, ongoing, finished }) {
    this.total = parseInt(total);
    this.ongoing = parseInt(ongoing);
    this.finished = parseInt(finished);
  }
}

export class Dashboard {
  constructor({
    summary,
    recent_transactions,
    wishlist_preview,
    wishlist_stats,
    savings_chart,
  }) {
    this.summary = new DashboardSummary(summary);
    this.recentTransactions = recent_transactions.map(t => new Transaction(t));
    this.wishlistPreview = wishlist_preview;
    this.wishlistStats = new WishlistStats(wishlist_stats);
    this.savingsChart = savings_chart;
  }
}
