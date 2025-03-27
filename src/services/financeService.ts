
import { toast } from "@/hooks/use-toast";

// Interfaces
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  budgets: Budget[];
  expensesByCategory: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

// Sample data for demo purposes
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 2500,
    description: 'Salary',
    category: 'Income',
    date: '2023-07-01',
    type: 'income'
  },
  {
    id: '2',
    amount: 800,
    description: 'Rent',
    category: 'Housing',
    date: '2023-07-02',
    type: 'expense'
  },
  {
    id: '3',
    amount: 120,
    description: 'Groceries',
    category: 'Food',
    date: '2023-07-05',
    type: 'expense'
  },
  {
    id: '4',
    amount: 50,
    description: 'Electricity',
    category: 'Utilities',
    date: '2023-07-07',
    type: 'expense'
  },
  {
    id: '5',
    amount: 35,
    description: 'Internet',
    category: 'Utilities',
    date: '2023-07-07',
    type: 'expense'
  },
  {
    id: '6',
    amount: 200,
    description: 'Investment',
    category: 'Investments',
    date: '2023-07-10',
    type: 'expense'
  },
  {
    id: '7',
    amount: 60,
    description: 'Dining out',
    category: 'Food',
    date: '2023-07-12',
    type: 'expense'
  },
  {
    id: '8',
    amount: 300,
    description: 'Freelance work',
    category: 'Income',
    date: '2023-07-15',
    type: 'income'
  },
  {
    id: '9',
    amount: 80,
    description: 'Shopping',
    category: 'Personal',
    date: '2023-07-18',
    type: 'expense'
  },
  {
    id: '10',
    amount: 40,
    description: 'Gas',
    category: 'Transportation',
    date: '2023-07-20',
    type: 'expense'
  }
];

const MOCK_BUDGETS: Budget[] = [
  {
    id: '1',
    category: 'Housing',
    limit: 1000,
    spent: 800,
    period: 'monthly'
  },
  {
    id: '2',
    category: 'Food',
    limit: 500,
    spent: 180,
    period: 'monthly'
  },
  {
    id: '3',
    category: 'Utilities',
    limit: 200,
    spent: 85,
    period: 'monthly'
  },
  {
    id: '4',
    category: 'Transportation',
    limit: 150,
    spent: 40,
    period: 'monthly'
  },
  {
    id: '5',
    category: 'Personal',
    limit: 300,
    spent: 80,
    period: 'monthly'
  },
  {
    id: '6',
    category: 'Investments',
    limit: 500,
    spent: 200,
    period: 'monthly'
  }
];

// Finance service class
class FinanceService {
  private transactions: Transaction[] = [...MOCK_TRANSACTIONS];
  private budgets: Budget[] = [...MOCK_BUDGETS];

  // Get all transactions
  async getTransactions(): Promise<Transaction[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.transactions];
  }

  // Get all budgets
  async getBudgets(): Promise<Budget[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.budgets];
  }

  // Add new transaction
  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    this.transactions.push(newTransaction);
    
    toast({
      title: "Transaction added",
      description: `${transaction.description} has been added to your transactions.`,
    });
    
    return newTransaction;
  }

  // Update a budget
  async updateBudget(budgetId: string, updates: Partial<Budget>): Promise<Budget> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const budgetIndex = this.budgets.findIndex(b => b.id === budgetId);
    if (budgetIndex === -1) {
      toast({
        title: "Error",
        description: "Budget not found",
        variant: "destructive",
      });
      throw new Error('Budget not found');
    }
    
    this.budgets[budgetIndex] = {
      ...this.budgets[budgetIndex],
      ...updates
    };
    
    toast({
      title: "Budget updated",
      description: `${this.budgets[budgetIndex].category} budget has been updated.`,
    });
    
    return this.budgets[budgetIndex];
  }

  // Get financial summary
  async getFinancialSummary(): Promise<FinancialSummary> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netSavings = totalIncome - totalExpenses;
    
    // Calculate expenses by category
    const expensesByCategory = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const categoryIndex = acc.findIndex(c => c.category === t.category);
        if (categoryIndex >= 0) {
          acc[categoryIndex].amount += t.amount;
        } else {
          acc.push({
            category: t.category,
            amount: t.amount,
            percentage: 0
          });
        }
        return acc;
      }, [] as {category: string, amount: number, percentage: number}[])
      .map(category => ({
        ...category,
        percentage: (category.amount / totalExpenses) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
    
    return {
      totalIncome,
      totalExpenses,
      netSavings,
      budgets: this.budgets,
      expensesByCategory
    };
  }
}

// Create a singleton instance
const financeService = new FinanceService();
export default financeService;
