"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"

interface OtpInputProps {
  length?: number
  onComplete?: (otp: string) => void
  onChange?: (otp: string) => void
  value?: string
  disabled?: boolean
  error?: boolean
}

export function OtpInput({ length = 6, onComplete, onChange, value = "", disabled = false, error = false }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Sync external value changes
  useEffect(() => {
    if (value !== undefined) {
      const valueArray = value.split("").slice(0, length)
      const paddedArray = [...valueArray, ...Array(length - valueArray.length).fill("")]
      setOtp(paddedArray)
    }
  }, [value, length])

  // Auto-focus first input on mount and when enabled
  useEffect(() => {
    if (!disabled && inputRefs.current[0] && otp.every(digit => digit === "")) {
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [disabled, otp])

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    const otpString = newOtp.join("")
    onChange?.(otpString)

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Call onComplete if all fields are filled
    if (newOtp.every((digit) => digit !== "")) {
      onComplete?.(otpString)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp]
      if (otp[index]) {
        newOtp[index] = ""
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
      } else if (index > 0) {
        newOtp[index - 1] = ""
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    const digits = pastedData.replace(/\D/g, "").split("").slice(0, length)

    if (digits.length > 0) {
      const newOtp = [...otp]
      digits.forEach((digit, index) => {
        newOtp[index] = digit
      })
      setOtp(newOtp)
      const otpString = newOtp.join("")
      onChange?.(otpString)

      if (digits.length === length) {
        onComplete?.(otpString)
      } else {
        inputRefs.current[Math.min(digits.length, length - 1)]?.focus()
      }
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
              : "border-input focus:border-primary focus:ring-ring/50"
          } ${disabled ? "opacity-50 cursor-not-allowed bg-muted" : "bg-background"}`}
          placeholder="•"
        />
      ))}
    </div>
  )
}