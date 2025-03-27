
import { toast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

class ChatbotService {
  private messages: ChatMessage[] = [];
  
  // Get conversation history
  async getMessages(): Promise<ChatMessage[]> {
    // In a real app, this would fetch from an API
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.messages];
  }
  
  // Send message to AI assistant
  async sendMessage(content: string): Promise<ChatMessage> {
    if (!content.trim()) {
      throw new Error('Message cannot be empty');
    }
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 11),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    this.messages.push(userMessage);
    
    try {
      // Simulate API call delay - in a real app this would be an AI API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate AI response based on user input
      const response = this.generateResponse(content);
      
      // Add AI response
      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36).substring(2, 11),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      this.messages.push(assistantMessage);
      
      return assistantMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message failed",
        description: "Could not process your message. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }
  
  // Clear conversation history
  async clearConversation(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    this.messages = [];
    
    toast({
      title: "Conversation cleared",
      description: "Your chat history has been cleared.",
    });
  }
  
  // Generate response based on user query
  private generateResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Greeting patterns
    if (this.matchesAny(lowerMessage, ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'])) {
      return this.getRandomResponse([
        "Hello there! I'm your AI financial assistant. How can I help you today?",
        "Hi! I'm here to help with your financial questions. What would you like to know?",
        "Hey! Ready to discuss your finances? What financial topic are you interested in?"
      ]);
    }
    
    // Budget-related queries
    if (this.containsAny(lowerMessage, ['budget', 'spending', 'expense', 'money', 'allocate', 'allocation'])) {
      return this.getRandomResponse([
        "Based on your spending patterns, I recommend allocating 30% of your income to housing, 15% to food, 10% to transportation, 10% to savings, and the rest to other expenses. Would you like me to create a detailed budget plan for you?",
        "Looking at your financial data, a 50-30-20 budget might work well for you: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Would you like more specific advice for your situation?",
        "Your current spending shows opportunities to reduce costs in dining and entertainment. By cutting $150 monthly in these areas, you could increase your savings rate by 15%. Would you like specific suggestions?"
      ]);
    }
    
    // Investment-related queries
    if (this.containsAny(lowerMessage, ['invest', 'stock', 'portfolio', 'etf', 'fund', 'market', 'dividend'])) {
      return this.getRandomResponse([
        "For your investment goals, I suggest a diversified portfolio with 60% in index funds, 20% in bonds, and 20% in individual stocks that align with your interests and risk tolerance. Would you like more specific investment recommendations?",
        "Based on your risk profile, consider low-cost index ETFs for long-term growth. A mix of VTI (total US market), VXUS (international), and BND (bonds) could provide good diversification. Would you like to discuss allocation percentages?",
        "For beginning investors, I recommend focusing on building a solid emergency fund first, then starting with broad-market index funds before considering individual stocks. Does this approach align with your goals?"
      ]);
    }
    
    // Debt-related queries
    if (this.containsAny(lowerMessage, ['debt', 'loan', 'credit', 'interest', 'mortgage', 'payment', 'owe'])) {
      return this.getRandomResponse([
        "I recommend focusing on high-interest debt first. Based on your financial situation, you could be debt-free in approximately 24 months by allocating an additional $300 monthly to debt repayment. Would you like me to create a debt repayment plan?",
        "The avalanche method (paying highest interest debts first) would save you about $2,300 in interest compared to the snowball method (paying smallest debts first). However, the snowball method might provide more psychological wins. Which approach interests you more?",
        "With your current debt and income, consolidating your high-interest credit cards could reduce your average interest rate from 19% to about 12%, saving approximately $1,500 over the life of the debt. Would you like to explore consolidation options?"
      ]);
    }
    
    // Savings-related queries
    if (this.containsAny(lowerMessage, ['save', 'saving', 'emergency fund', 'retirement', 'ira', '401k'])) {
      return this.getRandomResponse([
        "For your financial goals, I recommend using the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. This would allow you to save approximately $400 monthly. Would you like to explore ways to increase your savings rate?",
        "Based on your income and expenses, you could reach your emergency fund goal of 3 months' expenses in about 8 months by saving $500 monthly. Should we look at ways to accelerate this timeline?",
        "For retirement planning, contributing to your employer's 401(k) up to the match (currently 5%) would add about $2,400 annually to your retirement savings through employer contributions alone. Is maximizing this match part of your current strategy?"
      ]);
    }
    
    // Financial goals or planning
    if (this.containsAny(lowerMessage, ['goal', 'plan', 'future', 'target', 'aim', 'objective'])) {
      return this.getRandomResponse([
        "Based on your income and spending habits, you could reach your financial goal of $25,000 in approximately 3 years. Would you like me to suggest ways to accelerate this timeline?",
        "For your home purchase goal, saving an additional $300 monthly would allow you to reach your down payment target in 4 years instead of 6. Would you like to explore adjustments to your budget to make this possible?",
        "Creating a clear timeline for your financial goals is important. Let's prioritize them: 1) Build emergency fund, 2) Maximize retirement contributions, 3) Save for major purchases. Does this order make sense for your situation?"
      ]);
    }
    
    // Credit score
    if (this.containsAny(lowerMessage, ['credit score', 'fico', 'credit report', 'credit history'])) {
      return this.getRandomResponse([
        "To improve your credit score, focus on payment history (35% of score) and credit utilization (30%). Paying all bills on time and reducing credit card balances below 30% of limits could potentially raise your score by 20-40 points in 3-6 months.",
        "Based on your credit profile, the most impactful action would be reducing your overall credit utilization from 45% to under 30%. This could potentially improve your score by up to 30 points within 1-2 billing cycles.",
        "Looking at your credit history, the length of credit (15% of score) is strong, but recent applications (10% of score) may be having a negative impact. Consider avoiding new credit applications for the next 6 months to help your score recover."
      ]);
    }
    
    // Tax questions
    if (this.containsAny(lowerMessage, ['tax', 'taxes', 'irs', 'deduction', 'refund', 'filing'])) {
      return this.getRandomResponse([
        "Based on your income and deductions, you might benefit more from itemizing deductions rather than taking the standard deduction. This could potentially save you approximately $1,200 in taxes. Would you like to review potential itemized deductions?",
        "Contributing to a traditional IRA could reduce your taxable income by up to $6,000 ($7,000 if you're over 50), potentially moving you to a lower tax bracket. Would you like to explore retirement contribution strategies for tax benefits?",
        "If you're self-employed or have side income, you may qualify for home office deductions, business expense deductions, and the qualified business income deduction. These could significantly reduce your tax liability. Would you like more information on these options?"
      ]);
    }
    
    // Insurance questions
    if (this.containsAny(lowerMessage, ['insurance', 'policy', 'coverage', 'premium', 'deductible', 'life insurance', 'health insurance'])) {
      return this.getRandomResponse([
        "Based on your financial situation, I recommend term life insurance with coverage of approximately 10-12 times your annual income. This would provide adequate protection for your dependents while being more cost-effective than whole life insurance.",
        "Your current insurance deductibles may be too low, resulting in higher premiums. Increasing your auto insurance deductible from $500 to $1,000 could reduce your premium by approximately 15-20%, potentially saving $200-300 annually.",
        "For health insurance, based on your typical healthcare usage, a high-deductible health plan (HDHP) paired with a Health Savings Account (HSA) might be more cost-effective than your current PPO plan, especially considering the tax advantages of HSA contributions."
      ]);
    }
    
    // Help/assistance questions
    if (this.containsAny(lowerMessage, ['help', 'assist', 'how do you', 'what can you', 'capabilities'])) {
      return "I'm your AI financial assistant. I can help you with budgeting, investment suggestions, debt management, savings strategies, credit improvement, tax planning, insurance optimization, and other financial questions. Just ask specific questions about your financial situation, and I'll provide personalized guidance based on the information you share.";
    }
    
    // Thank you messages
    if (this.containsAny(lowerMessage, ['thank', 'thanks', 'appreciate', 'helpful'])) {
      return this.getRandomResponse([
        "You're welcome! If you have more financial questions in the future, I'm here to help.",
        "My pleasure! Is there anything else about your finances that you'd like to discuss?",
        "Glad I could help! Feel free to check in anytime you need financial guidance."
      ]);
    }
    
    // Default response for other queries
    return "I'm your AI financial assistant. I can help you with budgeting, investment suggestions, debt management, savings strategies, and other financial questions. What specific aspect of your finances would you like assistance with today?";
  }
  
  // Helper method to check if message contains any of the keywords
  private containsAny(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }
  
  // Helper method to check if message matches any of the patterns exactly
  private matchesAny(message: string, patterns: string[]): boolean {
    return patterns.some(pattern => 
      message === pattern || 
      message.startsWith(pattern + " ") || 
      message.endsWith(" " + pattern) ||
      message.includes(" " + pattern + " ")
    );
  }
  
  // Helper method to get a random response from a list
  private getRandomResponse(responses: string[]): string {
    const index = Math.floor(Math.random() * responses.length);
    return responses[index];
  }
}

// Create a singleton instance
const chatbotService = new ChatbotService();
export default chatbotService;
