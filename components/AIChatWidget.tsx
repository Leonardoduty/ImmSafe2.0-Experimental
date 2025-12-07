"use client"

import { useState, useRef, useEffect } from "react"
import { Send, MessageCircle, X, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { sendMessage, createMessage, type ChatMessage } from "@/lib/api/aiAssistant"

interface AIChatWidgetProps {
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

export default function AIChatWidget({ isOpen = false, onToggle, className = "" }: AIChatWidgetProps) {
  const [open, setOpen] = useState(isOpen)
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", "Hello! I'm your survival assistant. How can I help you today? Type 'help' to see what I can assist with.")
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleToggle = () => {
    const newState = !open
    setOpen(newState)
    onToggle?.()
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = createMessage("user", input.trim())
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendMessage(input.trim())
      const assistantMessage = createMessage("assistant", response.message)
      setMessages(prev => [...prev, assistantMessage])
    } catch {
      const errorMessage = createMessage("assistant", "I'm sorry, I couldn't process your request. Please try again.")
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!open) {
    return (
      <Button
        onClick={handleToggle}
        className={`fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50 ${className}`}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-80 md:w-96 h-[500px] shadow-xl z-50 flex flex-col ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Survival Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleToggle}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-3" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-3 w-3 text-primary animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask for help..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
