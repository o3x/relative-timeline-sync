"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

interface DateInputProps {
    onSubmit: (date: string) => void;
    initialDate?: string;
}

export function DateInput({ onSubmit, initialDate }: DateInputProps) {
    const [dateStr, setDateStr] = React.useState(initialDate || "")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (dateStr) {
            onSubmit(dateStr)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-md border-white/10 text-white">
            <CardHeader>
                <CardTitle className="text-2xl font-light tracking-wider text-center">RELATIVE TIMELINE</CardTitle>
                <CardDescription className="text-center text-gray-400">
                    Enter your birth date to sync with history
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="birthDate" className="sr-only">Birth Date</Label>
                        <Input
                            id="birthDate"
                            type="date"
                            required
                            className="bg-black/50 border-white/10 text-white text-center text-lg h-12"
                            value={dateStr}
                            onChange={(e) => setDateStr(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 transition-colors">
                        Start Journey
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
