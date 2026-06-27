"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Event, Person } from "@/types"
import { cn, isSameMonthAndDay, getDateFromRelativeDay } from "@/lib/utils"
import { format, differenceInYears } from "date-fns"
import { Star, Clock, History, ZoomIn, ZoomOut, User } from "lucide-react"

interface TimelineProps {
    events: Event[];
    birthDate: string;
    comparisonPersons?: Person[];
}

interface DisplayEvent extends Event {
    originalDate: string; // The real date of the event (User's date or Legend's projected date)
    isComparison?: boolean;
    personName?: string;
    personColor?: string;
}

export function Timeline({ events, birthDate, comparisonPersons = [] }: TimelineProps) {
    const today = new Date();

    // Zoom level: 0 to 100
    const [zoomLevel, setZoomLevel] = useState(100);
    const [showComparison, setShowComparison] = useState(true);

    // Handle pinch-to-zoom globally
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            // Only zoom if Ctrl/Meta is pressed (Pinch gesture is often mapped to Ctrl+Wheel)
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -5 : 5;
                setZoomLevel(prev => Math.max(0, Math.min(100, prev + delta)));
            }
        };

        // Attach to window to catch events even in margins
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);

    // Prepare all events (User + Comparison)
    const allEvents: DisplayEvent[] = [
        // User events
        ...events.map(e => ({
            ...e,
            originalDate: e.date,
            isComparison: false
        })),
        // Comparison events (Projected)
        ...(showComparison ? comparisonPersons.flatMap(person =>
            person.events.map(e => {
                const relDays = e.relativeDays ?? (e.age ? Math.floor(e.age * 365.25) : 0);
                const projectedDate = getDateFromRelativeDay(birthDate, relDays);

                return {
                    ...e,
                    originalDate: format(projectedDate, 'yyyy-MM-dd'),
                    isComparison: true,
                    personName: person.name,
                    personColor: person.themeColor || "bg-yellow-500"
                };
            })
        ) : [])
    ];

    // Sort events by date descending (newest first)
    const sortedEvents = allEvents.sort((a, b) => new Date(b.originalDate).getTime() - new Date(a.originalDate).getTime());

    // Determine display mode based on zoom
    const isCompact = zoomLevel < 50;
    const isDotMode = zoomLevel < 20;

    // Find "On This Day" events (Only for User)
    const onThisDayEvents = sortedEvents.filter(event =>
        !event.isComparison && isSameMonthAndDay(new Date(event.originalDate), today)
    );

    // Group by year
    const groupedEvents = sortedEvents.reduce((acc, event) => {
        const year = event.originalDate.substring(0, 4);
        if (!acc[year]) acc[year] = [];
        acc[year].push(event);
        return acc;
    }, {} as Record<string, DisplayEvent[]>);

    const years = Object.keys(groupedEvents).sort((a, b) => Number(b) - Number(a));

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 pb-20 relative">

            {/* Zoom & Legend Controls (Sticky) */}
            <div className="sticky top-[100px] z-20 flex justify-between items-center px-4 pointer-events-none">
                {/* Comparison Toggle */}
                <button
                    onClick={() => setShowComparison(!showComparison)}
                    className={cn(
                        "pointer-events-auto px-4 py-2 rounded-full border backdrop-blur-md transition-all text-xs font-bold flex items-center gap-2 shadow-lg",
                        showComparison
                            ? "bg-amber-900/80 border-amber-500/50 text-amber-200 shadow-amber-900/20"
                            : "bg-black/80 border-white/10 text-gray-400 hover:bg-white/10"
                    )}
                >
                    <User className="w-4 h-4" />
                    {showComparison ? "Legends ON" : "Legends OFF"}
                </button>

                {/* Zoom Slider */}
                <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full p-2 flex items-center gap-2 pointer-events-auto shadow-xl w-[200px]">
                    <ZoomOut className="w-4 h-4 text-gray-400" />
                    <Slider
                        value={[zoomLevel]}
                        onValueChange={(vals) => setZoomLevel(vals[0])}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                    <ZoomIn className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* On This Day HERO Section - Hide if zoomed out too much */}
            {onThisDayEvents.length > 0 && zoomLevel > 30 && (
                <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-3xl rounded-full opacity-20" />
                    <Card className="relative overflow-hidden border-yellow-500/30 bg-black/40 backdrop-blur-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Star className="w-24 h-24 text-yellow-500" />
                        </div>
                        <CardHeader>
                            <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                <History className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-widest uppercase">On This Day ({format(today, 'MMMM d')})</span>
                            </div>
                            <CardTitle className="text-2xl md:text-3xl text-white">Memories from Today</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {onThisDayEvents.map(event => {
                                const eventDate = new Date(event.originalDate);
                                const yearsAgo = differenceInYears(today, eventDate);
                                return (
                                    <div key={event.id} className="flex gap-4 items-start p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="bg-yellow-500/20 p-2 rounded-full shrink-0">
                                            <Clock className="w-4 h-4 text-yellow-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{event.title}</h4>
                                            <div className="flex gap-3 text-sm text-gray-400 mt-1">
                                                <span>{format(eventDate, 'yyyy')}</span>
                                                <span className="text-yellow-500 font-mono">{yearsAgo === 0 ? 'Today' : `${yearsAgo} years ago`}</span>
                                            </div>
                                            {event.description && <p className="text-sm text-gray-300 mt-2">{event.description}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Timeline */}
            <div className="relative">
                <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                {years.map(year => (
                    <div key={year} className={cn("relative last:mb-0 transition-all duration-300", isDotMode ? "mb-4" : "mb-16")}>

                        {/* Year Label */}
                        <div className={cn("sticky top-24 z-10 -ml-4 md:-ml-0 transition-all duration-300", isDotMode ? "mb-2" : "mb-8")}>
                            <div className="flex items-center gap-4">
                                <div className="w-16 md:w-24 text-right">
                                    <span className={cn(
                                        "font-black text-white/5 outline-text tracking-tighter transition-all duration-300",
                                        isDotMode ? "text-2xl" : "text-5xl md:text-6xl"
                                    )} style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                                        {year}
                                    </span>
                                </div>
                                <div className="h-px bg-white/10 flex-grow" />
                            </div>
                        </div>

                        <div className={cn("pl-12 md:pl-32 transition-all duration-300", isDotMode ? "space-y-1" : "space-y-8")}>
                            {groupedEvents[year].map((event, index) => {
                                const eventDate = new Date(event.originalDate);
                                const birth = new Date(birthDate);
                                const age = differenceInYears(eventDate, birth);

                                if (isDotMode) {
                                    return (
                                        <div key={event.id} className="relative group">
                                            <div className={cn(
                                                "absolute -left-[35px] md:-left-[99px] top-1 w-2 h-2 rounded-full transition-all cursor-pointer",
                                                event.isComparison ? "bg-amber-500" : "bg-slate-600 hover:bg-blue-400 hover:scale-150"
                                            )}
                                                title={`${format(eventDate, 'yyyy-MM-dd')}: ${event.title} (${event.personName || 'You'})`}
                                            />
                                            <div className="h-4 w-full bg-white/5 rounded hidden group-hover:block absolute left-0 -top-1 px-2 text-xs truncate z-20">
                                                {event.isComparison && <span className="text-amber-400 mr-2">[{event.personName}]</span>}
                                                {event.title}
                                            </div>
                                        </div>
                                    )
                                }

                                return (
                                    <div key={event.id} className="relative group animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                                        {/* Dot on timeline */}
                                        <div className={cn(
                                            "absolute -left-[35px] md:-left-[99px] top-6 w-3 h-3 rounded-full border group-hover:scale-125 transition-all duration-300 z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                                            event.isComparison
                                                ? "border-amber-900 bg-amber-600 group-hover:bg-amber-500"
                                                : "border-slate-900 bg-slate-800 group-hover:bg-blue-400"
                                        )} />

                                        {/* Connector line */}
                                        <div className={cn(
                                            "absolute -left-[30px] md:-left-[94px] top-7 w-8 md:w-24 h-px transition-colors",
                                            event.isComparison ? "bg-amber-500/30" : "bg-white/10 group-hover:bg-blue-400/50"
                                        )} />

                                        <Card className={cn(
                                            "transition-all duration-300 backdrop-blur-sm group-hover:translate-x-1",
                                            event.isComparison
                                                ? "bg-amber-900/10 border-amber-500/20 hover:bg-amber-900/20"
                                                : "bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5",
                                            isCompact ? "py-0" : ""
                                        )}>
                                            <CardContent className={cn("p-5", isCompact && "p-3")}>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-center min-w-[3rem] p-1 rounded bg-white/5 border border-white/10">
                                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">{format(eventDate, 'MMM')}</div>
                                                            <div className={cn("font-bold text-white", isCompact ? "text-base" : "text-xl")}>{format(eventDate, 'd')}</div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            {event.isComparison && (
                                                                <div className="flex items-center gap-1 text-xs text-amber-500 mb-0.5 font-bold uppercase tracking-wider">
                                                                    <User className="w-3 h-3" />
                                                                    {event.personName}
                                                                    <span className="text-amber-500/50 text-[10px] ml-1 lowercase">at this age</span>
                                                                </div>
                                                            )}
                                                            <h3 className={cn("font-bold text-white leading-tight truncate", isCompact ? "text-sm" : "text-lg md:text-xl")}>{event.title}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                                                        {!isCompact && (
                                                            <span className={cn(
                                                                "px-2 py-1 rounded text-xs border whitespace-nowrap font-mono",
                                                                event.isComparison
                                                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                            )}>
                                                                Age {age}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {!isCompact && event.description && (
                                                    <div className="pl-[3.75rem] mt-2">
                                                        <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-white/10 pl-3 py-1">
                                                            {event.description}
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
