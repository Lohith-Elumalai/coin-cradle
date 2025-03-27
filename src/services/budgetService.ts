import { Budget, SavingsGoal } from './financeService';

// Type definitions for budget analysis
export interface BudgetSummary {
  totalAllocated: number;
  totalSpent: number;
  remainingAmount: number;
  percentageSpent: number;
  categoryBreakdown: {
    category: string;
    allocated: number;
    spent: number;
    percentage: number;
    color: string;
  }[];
}

export interface GoalAnalytics {
  totalTargetAmount: number;
  totalCurrentAmount: number;
  overallProgress: number;
  projectedCompletionDate: string;
  highPriorityGoals: SavingsGoal[];
  nextMilestone: {
    goalId: string;
    goalName: string;
    daysRemaining: number;
    amountNeeded: number;
  } | null;
}

// Budget analytics functions
export const analyzeBudgets = (budgets: Budget[]): BudgetSummary => {
  if (!budgets || budgets.length === 0) {
    return {
      totalAllocated: 0,
      totalSpent: 0,
      remainingAmount: 0,
      percentageSpent: 0,
      categoryBreakdown: []
    };
  }

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  
  return {
    totalAllocated,
    totalSpent,
    remainingAmount: totalAllocated - totalSpent,
    percentageSpent: totalAllocated > 0 ? totalSpent / totalAllocated : 0,
    categoryBreakdown: budgets.map(budget => ({
      category: budget.category,
      allocated: budget.allocated,
      spent: budget.spent,
      percentage: budget.allocated > 0 ? budget.spent / budget.allocated : 0,
      color: budget.color
    }))
  };
};

// Savings goal analytics functions
export const analyzeGoals = (goals: SavingsGoal[]): GoalAnalytics => {
  if (!goals || goals.length === 0) {
    return {
      totalTargetAmount: 0,
      totalCurrentAmount: 0,
      overallProgress: 0,
      projectedCompletionDate: '',
      highPriorityGoals: [],
      nextMilestone: null
    };
  }

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const highPriorityGoals = goals.filter(goal => goal.priority === 'high');
  
  // Find the next goal to reach (closest to completion)
  const incompleteGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount);
  let nextMilestone = null;
  
  if (incompleteGoals.length > 0) {
    // Sort by percentage completion (descending)
    const sortedGoals = [...incompleteGoals].sort((a, b) => {
      const aPercentage = a.currentAmount / a.targetAmount;
      const bPercentage = b.currentAmount / b.targetAmount;
      return bPercentage - aPercentage;
    });
    
    const nextGoal = sortedGoals[0];
    nextMilestone = {
      goalId: nextGoal.id,
      goalName: nextGoal.name,
      daysRemaining: calculateDaysRemaining(nextGoal.targetDate),
      amountNeeded: nextGoal.targetAmount - nextGoal.currentAmount
    };
  }
  
  // Calculate projected completion date (simple estimate)
  let projectedCompletionDate = '';
  if (totalCurrentAmount > 0 && totalTargetAmount > totalCurrentAmount) {
    // This is a simplified projection and would need more data in a real app
    const today = new Date();
    const projectedDays = 30 * (totalTargetAmount / totalCurrentAmount);
    const projectedDate = new Date(today.setDate(today.getDate() + projectedDays));
    projectedCompletionDate = projectedDate.toISOString().split('T')[0];
  }
  
  return {
    totalTargetAmount,
    totalCurrentAmount,
    overallProgress: totalTargetAmount > 0 ? totalCurrentAmount / totalTargetAmount : 0,
    projectedCompletionDate,
    highPriorityGoals,
    nextMilestone
  };
};

// Helper functions
const calculateDaysRemaining = (targetDate: string): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Budget recommendation functions
export const generateBudgetRecommendations = (
  budgets: Budget[], 
  income: number
): { category: string; recommendedAmount: number; reason: string }[] => {
  // Simplified recommendation logic
  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const recommendations = [];
  
  // If over-budgeting
  if (totalAllocated > income) {
    // Find categories with highest allocation
    const sortedBudgets = [...budgets].sort((a, b) => b.allocated - a.allocated);
    const topBudget = sortedBudgets[0];
    
    recommendations.push({
      category: topBudget.category,
      recommendedAmount: topBudget.allocated * 0.8, // Suggest 20% reduction
      reason: `Your total budget exceeds your income. Consider reducing ${topBudget.category} by 20%.`
    });
  }
  
  // Find under-utilized categories
  budgets.forEach(budget => {
    if (budget.spent / budget.allocated < 0.5) {
      recommendations.push({
        category: budget.category,
        recommendedAmount: budget.spent * 1.2, // Slightly above current spending
        reason: `You're only using ${Math.round((budget.spent / budget.allocated) * 100)}% of your ${budget.category} budget. Consider reallocating some funds.`
      });
    }
  });
  
  // Check if any essential categories are missing
  const essentialCategories = ['Housing', 'Food', 'Transportation', 'Utilities'];
  const existingCategories = budgets.map(b => b.category);
  
  essentialCategories.forEach(category => {
    if (!existingCategories.includes(category)) {
      const recommendedAmount = calculateRecommendedAmount(category, income);
      recommendations.push({
        category,
        recommendedAmount,
        reason: `You don't have a budget for ${category}, which is typically an essential expense.`
      });
    }
  });
  
  return recommendations;
};

// Helper function to suggest budget amounts based on general guidelines
const calculateRecommendedAmount = (category: string, income: number): number => {
  const guidelines: Record<string, number> = {
    'Housing': 0.3, // 30% of income
    'Food': 0.15,
    'Transportation': 0.1,
    'Utilities': 0.1,
    'Entertainment': 0.05,
    'Savings': 0.2,
    'Health': 0.05,
    'Debt': 0.15
  };
  
  return Math.round(income * (guidelines[category] || 0.05));
};

export default {
  analyzeBudgets,
  analyzeGoals,
  generateBudgetRecommendations
};
