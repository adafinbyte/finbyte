"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Label } from "./ui/label"
import { format_atomic } from "@/utils/format"

interface custom_props {
  onValueChange: (value: number | null) => void;
  balance: number;
  on_submit: (value: string) => Promise<void>;
}

export function TipInput({ onValueChange, balance, on_submit }: custom_props) {
  const [inputValue, setInputValue] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (/^-?\d*\.?\d*$/.test(value)) {
      const parts = value.split(".");
      if (parts.length === 2 && parts[1].length > 4) {
        return; // more than 4 decimal places, do not update
      }

      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed > balance) {
        const format_tfin = balance.toLocaleString(undefined, { minimumFractionDigits: 4 });
        setError(`Amount cannot exceed your balance of ${format_tfin}`);
        return;
      }
  
      setInputValue(value);
      setError(null);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue) {
      onValueChange(null)
      return
    }

    const numValue = Number.parseFloat(inputValue)

    if (isNaN(numValue)) {
      setError("Please enter a valid number")
      return
    }

    onValueChange(numValue)
  }

  const handleClear = () => {
    setInputValue("")
    setError(null)
    onValueChange(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Input
            id="number-input"
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="0.0000"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-xs font-semibold text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full">
        Format Number
      </Button>
    </form>
  )
}
