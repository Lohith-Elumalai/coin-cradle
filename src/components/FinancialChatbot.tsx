
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, SendHorizontal, Trash2 } from "lucide-react";
import chatbotService, { ChatMessage } from "@/services/chatbotService";
import { toast } from "@/hooks/use-toast";

interface FinancialChatbotProps {
  className?: string;
}

const FinancialChatbot: React.FC<FinancialChatbotProps> = ({ className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const loadedMessages = await chatbotService.getMessages();
        if (loadedMessages.length === 0) {
          // Add welcome message if no messages exist
          const welcomeMessage: ChatMessage = {
            id: "welcome",
            role: "assistant",
            content:
              "Hello! I'm your AI financial assistant. I can help you with budgeting, investment suggestions, debt management, and more. How can I help you today?",
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
        } else {
          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Error",
          description: "Failed to load chat messages",
          variant: "destructive",
        });
      }
    };

    loadMessages();
    
    // Focus the input when component mounts
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    setIsLoading(true);
    
    try {
      // We'll let the chatbotService handle adding the user message to the state
      const response = await chatbotService.sendMessage(inputMessage);
      
      // Update local state with the latest messages
      const updatedMessages = await chatbotService.getMessages();
      setMessages(updatedMessages);
      
      setInputMessage("");
      
      // Focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await chatbotService.clearConversation();
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your AI financial assistant. I can help you with budgeting, investment suggestions, debt management, and more. How can I help you today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      
      // Focus the input after clearing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast({
        title: "Error",
        description: "Failed to clear chat",
        variant: "destructive",
      });
    }
  };

  // Handle Enter key press
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
