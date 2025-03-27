import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, SendHorizontal, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FinancialChatbotProps {
  className?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FinancialChatbot: React.FC<FinancialChatbotProps> = ({ className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: string }[]>([]);

  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome-" + Date.now(),
      role: "assistant",
      content: "Hello! I'm your AI financial assistant powered by Gemini. I can help you with budgeting, investment suggestions, debt management, and more. How can I help you today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    
    setChatHistory([
      {
        role: "user",
        parts: "You are a helpful financial assistant. Provide concise, accurate financial advice. If asked about non-financial topics, politely decline and refocus on financial matters. Always provide clear explanations and break down complex concepts."
      },
      {
        role: "model",
        parts: "Understood. I'm ready to assist with financial questions including budgeting, investments, loans, taxes, and personal finance management."
      }
    ]);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateId = () => {
    return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessageId = generateId();
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      const updatedHistory = [
        ...chatHistory,
        { role: "user", parts: inputMessage }
      ];
      setChatHistory(updatedHistory);
      
      console.log("Sending to Gemini:", updatedHistory); // Debug log
      
      const response = await fetchGeminiResponse(updatedHistory);
      
      const botMessageId = generateId();
      const botMessage: ChatMessage = {
        id: botMessageId,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [
        ...prev,
        { role: "model", parts: response }
      ]);
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      
      const errorMessageId = generateId();
      const errorDisplayMessage: ChatMessage = {
        id: errorMessageId,
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorDisplayMessage]);
      
      toast({
        title: "API Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const fetchGeminiResponse = async (history: { role: string; parts: string }[]) => {
    const API_KEY = "AIzaSyD7RzF-y3UqPoCXnc94fnyuR3wqqMJ0OwY";
    if (!API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`;
    
    // Format history for Gemini API (only keep the last few messages to avoid hitting token limits)
    const recentHistory = history.slice(-6); // Keep last 3 exchanges
    const contents = recentHistory.map(item => ({
      role: item.role === "model" ? "model" : "user",
      parts: [{ text: item.parts }]
    }));
    
    console.log("Formatted Gemini request:", { contents }); // Debug log
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
          ]
        }),
      });
      
      console.log("Gemini response status:", response.status); // Debug log
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error Data:", errorData); // Debug log
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Gemini full response:", data); // Debug log
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error("Unexpected response format:", data);
        throw new Error("Received unexpected response format from Gemini");
      }
      
      // Check for safety filters
      if (data.candidates[0].safetyRatings) {
        const blocked = data.candidates[0].safetyRatings.some(
          (rating: any) => rating.blocked
        );
        if (blocked) {
          throw new Error("Response blocked by safety filters");
        }
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error in fetchGeminiResponse:", error);
      throw error;
    }
  };

  const handleClearChat = () => {
    const welcomeMessage: ChatMessage = {
      id: "welcome-" + Date.now(),
      role: "assistant",
      content: "Hello! I'm your AI financial assistant powered by Gemini. I can help you with budgeting, investment suggestions, debt management, and more. How can I help you today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setChatHistory([
      {
        role: "user",
        parts: "You are a helpful financial assistant. Provide concise, accurate financial advice. If asked about non-financial topics, politely decline and refocus on financial matters."
      },
      {
        role: "model",
        parts: "Understood. I'm ready to assist with financial questions."
      }
    ]);
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading) {
        handleSendMessage(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-4 flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center text-lg font-medium">
          <Bot className="h-5 w-5 mr-2 text-gold" />
          Financial Assistant
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearChat}
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className={`flex-shrink-0 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                  <Avatar className={`h-8 w-8 ${message.role === "user" ? "bg-gold/20" : "bg-blue-100"}`}>
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-gold" />
                    ) : (
                      <Bot className="h-4 w-4 text-blue-600" />
                    )}
                    <AvatarFallback>
                      {message.role === "user" ? "U" : "A"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div
                  className={`px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-gold/20 text-gray-800"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                  <div className="text-xs mt-1 opacity-50">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a financial question..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gold hover:bg-gold-dark text-white"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <SendHorizontal className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialChatbot;