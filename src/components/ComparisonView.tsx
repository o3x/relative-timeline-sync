"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Person } from "@/types"
import { cn } from "@/lib/utils"

interface ComparisonViewProps {
    person: Person;
    currentDaysAlive: number;
}

export function ComparisonView({ person, currentDaysAlive }: ComparisonViewProps) {
    // Sort events by age/relativeDays
    const sortedEvents = [...person.events].sort((a, b) => (a.relativeDays || 0) - (b.relativeDays || 0));

    return (
        <div className="w-full max-w-md">
            <div className={cn("p-4 mb-4 rounded-lg border border-white/10", person.themeColor || "bg-slate-800")}>
                <h3 className="text-lg font-bold text-white mb-1">{person.name}</h3>
                <p className="text-xs text-white/70">{person.description}</p>
            </div>

            <div className="space-y-4 relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

                {sortedEvents.map((event) => {
                    // Roughly estimate relative day if not present, using age * 365.25
                    const relativeDay = event.relativeDays || (event.age ? Math.floor(event.age * 365.25) : 0);
                    const isPast = relativeDay <= currentDaysAlive;
                    const isFuture = !isPast;

                    return (
                        <div key={event.id} className={cn("relative pl-10 transition-all duration-500", isFuture ? "opacity-50 blur-[1px]" : "opacity-100")}>
                            <div className={cn(
                                "absolute left-[13px] top-3 w-2 h-2 rounded-full border border-white/50",
                                isPast ? "bg-white" : "bg-transparent"
                            )} />
                            <Card className="bg-black/20 backdrop-blur-sm border-white/5 text-white mb-2 hover:bg-black/40 transition-colors">
                                <CardHeader className="p-3 pb-1">
                                    <div className="flex justify-between items-baseline">
                                        <CardTitle className="text-sm font-medium">{event.title}</CardTitle>
                                        <span className="text-xs text-blue-400 font-mono">Day {relativeDay.toLocaleString()}</span>
                                    </div>
                                    <CardDescription className="text-xs text-gray-500">
                                        Age {event.age} • {event.date}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-3 pt-1">
                                    <p className="text-sm text-gray-300">{event.description}</p>
                                </CardContent>
                            </Card>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
