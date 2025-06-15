"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Label } from "./ui/label"
import { format_atomic } from "@/utils/format"

interface custom_props {
  onValueChange: (value: number) => void;
  balance: number;
  on_submit: (value: string) => Promise<void>;
}

export function TipInput({ onValueChange, balance, on_submit }: custom_props) {
  const [inputValue, setInputValue] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^-?\d*\.?\d*$/.test(value)) {
      const parts = value.split(".");
      if (parts.length === 2 && parts[1].length > 4) {
        return;
      }

      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed > balance) {
        const format_tfin = balance.toLocaleString(undefined, { minimumFractionDigits: 4 });
        setError(`Amount cannot exceed your balance of ${format_tfin}`);
        return;
      }

      setInputValue(value);
      setError(null);

      if (!isNaN(parsed)) {
        onValueChange(parsed);
      } else {
        onValueChange(0);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue) {
      onValueChange(0);
      return;
    }

    const numValue = Number.parseFloat(inputValue);

    if (isNaN(numValue)) {
      setError("Please enter a valid number");
      return;
    }

    onValueChange(numValue);
    await on_submit(inputValue);
    setInputValue('');
  };

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

          <Button type="submit" variant="outline">
            Tip
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-xs font-semibold text-red-500 dark:text-red-400">
          {error}
        </div>
      )}
    </form>
  )
}
