"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Send, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ThemeProvider from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Chat() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userAge, setUserAge] = useState("")
  const [favoriteColor, setFavoriteColor] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi there! I'm your friendly image recognition assistant. You can upload images, and I'll tell you what I see! What would you like to do today?",
      },
    ],
    body: {
      userName,
      userAge,
      favoriteColor,
    },
  })

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem("onboardingComplete")
    if (onboardingComplete !== "true") {
      router.push("/onboarding")
      return
    }

    // Load user preferences
    const storedName = localStorage.getItem("userName")
    const storedAge = localStorage.getItem("userAge")
    const storedColor = localStorage.getItem("favoriteColor")

    if (storedName) setUserName(storedName)
    if (storedAge) setUserAge(storedAge)
    if (storedColor) setFavoriteColor(storedColor)
  }, [router])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)
      const file = e.target.files[0]
      setUploadedFiles([...uploadedFiles, file])

      // Read the file
      const reader = new FileReader()
      reader.onloadend = () => {
        // For images, we'll send the base64 data to the API
        if (file.type.startsWith("image/")) {
          const base64Data = reader.result as string
          append({
            role: "user",
            content: "I uploaded an image. Can you tell me what's in it?",
            imageUrl: base64Data,
          })
        } else {
          // For other file types, just mention the file name
          append({
            role: "user",
            content: `I uploaded a file called "${file.name}". Can you help me with it?`,
          })
        }
        setIsUploading(false)
      }

      if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const resetChat = () => {
    localStorage.removeItem("onboardingComplete")
    localStorage.removeItem("userName")
    localStorage.removeItem("userAge")
    localStorage.removeItem("favoriteColor")
    router.push("/onboarding")
  }

  return (
    <ThemeProvider color={favoriteColor}>
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <header className="border-b p-4 flex justify-between items-center bg-primary/5">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Robot" />
              <AvatarFallback>YA</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold">YuvAi</h1>
              <p className="text-xs text-muted-foreground">Hi {userName}! Let's explore together!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={resetChat}>Change My Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {message.imageUrl && (
                  <div className="mb-2">
                    <img
                      src={message.imageUrl || "/placeholder.svg"}
                      alt="Uploaded image"
                      className="max-w-full rounded-md"
                    />
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* File Upload Input (hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        {/* Chat Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <Button type="button" variant="outline" size="icon" onClick={triggerFileUpload} disabled={isUploading}>
              <Upload className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="min-h-[50px] max-h-[200px] py-3 pr-10 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    if (input.trim()) {
                      handleSubmit(e as any)
                    }
                  }
                }}
              />
            </div>
            <Button type="submit" size="icon" disabled={!input.trim() || isUploading}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </ThemeProvider>
  )
}
