"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type ThemeProviderProps = {
  children: React.ReactNode
  color?: string
}

type ThemeContextType = {
  color: string
  setColor: (color: string) => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  color: "blue",
  setColor: () => {},
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children, color = "blue" }: ThemeProviderProps) {
  const [currentColor, setCurrentColor] = useState(color)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Check for saved theme preferences
    const savedTheme = localStorage.getItem("theme")
    const savedColor = localStorage.getItem("themeColor")

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme)
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // If no saved preference, use system preference
      setTheme("dark")
    }

    if (savedColor) {
      setCurrentColor(savedColor)
    }
  }, [])

  useEffect(() => {
    if (color) {
      setCurrentColor(color)
    }
  }, [color])

  useEffect(() => {
    // Apply the color theme and dark/light mode to the document
    const root = document.documentElement

    // Remove any previous color classes
    const colorClasses = ["purple", "blue", "green", "yellow", "red", "pink"]
    colorClasses.forEach((c) => {
      root.classList.remove(`theme-${c}`)
    })

    // Add the current color class
    if (currentColor) {
      root.classList.add(`theme-${currentColor}`)
    }

    // Apply dark/light theme
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Save preferences
    localStorage.setItem("theme", theme)
    if (currentColor) {
      localStorage.setItem("themeColor", currentColor)
    }
  }, [currentColor, theme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider
      value={{
        color: currentColor,
        setColor: setCurrentColor,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
