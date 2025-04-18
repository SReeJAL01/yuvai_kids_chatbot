"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const colorOptions = [
  { value: "purple", label: "Purple", bg: "bg-purple-500" },
  { value: "blue", label: "Blue", bg: "bg-blue-500" },
  { value: "green", label: "Green", bg: "bg-green-500" },
  { value: "yellow", label: "Yellow", bg: "bg-yellow-500" },
  { value: "red", label: "Red", bg: "bg-red-500" },
  { value: "pink", label: "Pink", bg: "bg-pink-500" },
]

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [favoriteColor, setFavoriteColor] = useState("")
  const [nameError, setNameError] = useState("")
  const [ageError, setAgeError] = useState("")
  const [colorError, setColorError] = useState("")

  const validateName = () => {
    if (!name.trim()) {
      setNameError("Please enter your name")
      return false
    }
    setNameError("")
    return true
  }

  const validateAge = () => {
    if (!age.trim()) {
      setAgeError("Please enter your age")
      return false
    }

    const ageNum = Number.parseInt(age)
    if (isNaN(ageNum) || ageNum < 3 || ageNum > 12) {
      setAgeError("Please enter an age between 3 and 12")
      return false
    }

    setAgeError("")
    return true
  }

  const validateColor = () => {
    if (!favoriteColor) {
      setColorError("Please choose your favorite color")
      return false
    }
    setColorError("")
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateName()) {
      setStep(2)
    } else if (step === 2 && validateAge()) {
      setStep(3)
    } else if (step === 3 && validateColor()) {
      // Save user preferences
      localStorage.setItem("userName", name)
      localStorage.setItem("userAge", age)
      localStorage.setItem("favoriteColor", favoriteColor)
      localStorage.setItem("themeColor", favoriteColor) // Save as theme color too
      localStorage.setItem("onboardingComplete", "true")

      // Redirect to chat
      router.push("/chat")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {step === 1 && "What's your name?"}
            {step === 2 && "How old are you?"}
            {step === 3 && "Choose your favorite color"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                {nameError && <p className="text-sm text-red-500">{nameError}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  min="3"
                  max="12"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                {ageError && <p className="text-sm text-red-500">{ageError}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <RadioGroup value={favoriteColor} onValueChange={setFavoriteColor}>
                <div className="grid grid-cols-2 gap-4">
                  {colorOptions.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem id={color.value} value={color.value} />
                      <Label htmlFor={color.value} className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-6 h-6 rounded-full ${color.bg}`}></div>
                        {color.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              {colorError && <p className="text-sm text-red-500">{colorError}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <div className={step === 1 ? "w-full" : ""}>
              <Button className="w-full" onClick={handleNext}>
                {step === 3 ? "Start Chatting" : "Next"}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
