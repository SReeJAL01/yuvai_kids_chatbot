"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()
  const [hasOnboarded, setHasOnboarded] = useState(false)

  useEffect(() => {
    const onboardingComplete = localStorage.getItem("onboardingComplete")
    if (onboardingComplete === "true") {
      setHasOnboarded(true)
    }
  }, [])

  useEffect(() => {
    if (hasOnboarded) {
      router.push("/chat")
    }
  }, [hasOnboarded, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to YuvAi!</h1>
            <p className="text-muted-foreground">
              I can recognize images and chat with you about anything you want to know!
            </p>
            <div className="w-full max-w-xs mx-auto">
              <img
                src="/placeholder.svg?height=200&width=200"
                alt="Robot mascot"
                className="w-full h-auto rounded-full"
              />
            </div>
            <Button size="lg" className="w-full mt-4" onClick={() => router.push("/onboarding")}>
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
