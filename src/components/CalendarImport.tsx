"use client"

import * as React from "react"
import { Upload, Calendar, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseICS } from "@/lib/utils"
import { Event } from "@/types"
import { fetchCalendarFromUrl } from "@/server/actions"

interface CalendarImportProps {
    onImport: (events: Event[]) => void;
}

export function CalendarImport({ onImport }: CalendarImportProps) {
    const [isDragging, setIsDragging] = React.useState(false)
    const [fileName, setFileName] = React.useState<string | null>(null)
    const [url, setUrl] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [autoFetched, setAutoFetched] = React.useState(false);

    // Load URL from local storage and auto-import
    React.useEffect(() => {
        const savedUrl = localStorage.getItem("rts_calendarUrl");
        if (savedUrl) {
            setUrl(savedUrl);
            // Auto fetch if we have a saved URL and haven't fetched yet
            if (!autoFetched) {
                fetchCalendarFromUrl(savedUrl).then(result => {
                    if (result.success && result.data) {
                        processFileContent(result.data, "Imported from URL (Auto)");
                        setFileName("Calendar URL");
                    }
                    setAutoFetched(true);
                });
            }
        }
    }, [])

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const processFileContent = (content: string, name: string) => {
        try {
            const events = parseICS(content)
            if (events.length === 0) {
                alert("No events found in the file.");
                return;
            }
            setFileName(name)
            onImport(events)
        } catch (e) {
            console.error("Parse error", e)
            alert("Failed to parse the calendar file.")
        }
    }

    const processFile = async (file: File) => {
        if (!file.name.endsWith('.ics')) {
            alert("Please upload a valid .ics file")
            return
        }
        const text = await file.text()
        processFileContent(text, file.name)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0])
        }
    }

    const handleUrlImport = async () => {
        if (!url) return;
        setIsLoading(true);

        const result = await fetchCalendarFromUrl(url);

        if (result.success && result.data) {
            processFileContent(result.data, "Imported from URL");
            setFileName("Calendar URL");
            // Save URL to local storage
            localStorage.setItem("rts_calendarUrl", url);
        } else {
            alert(result.error || "Failed to import from URL");
        }
        setIsLoading(false);
    }

    const clearFile = () => {
        setFileName(null)
        onImport([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    if (fileName) {
        return (
            <Card className="border-white/20 bg-black/20 md:w-[400px]">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-green-400">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium truncate max-w-[200px] text-sm">{fileName}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-white/10"
                        onClick={clearFile}
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-white/20 bg-black/20 w-full md:w-[400px]">
            <CardContent className="p-0">
                <Tabs defaultValue="file" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 rounded-none bg-white/5 p-0">
                        <TabsTrigger value="file" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white">File Upload</TabsTrigger>
                        <TabsTrigger value="url" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white">URL Import</TabsTrigger>
                    </TabsList>

                    <TabsContent value="file" className="p-6 m-0">
                        <div
                            className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:bg-white/5'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".ics"
                                onChange={handleFileSelect}
                            />
                            <Upload className={`w-8 h-8 mb-2 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
                            <p className="text-xs text-gray-400 text-center">
                                <span className="font-semibold text-white">Click or Drag</span> .ics file
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="url" className="p-6 m-0 space-y-3">
                        <div className="space-y-2">
                            <Input
                                placeholder="https://calendar.google.com/..."
                                className="bg-black/50 border-white/10 text-xs text-white placeholder:text-gray-500"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <Button
                                size="sm"
                                className="w-full bg-white text-black hover:bg-gray-200"
                                onClick={handleUrlImport}
                                disabled={!url || isLoading}
                            >
                                {isLoading ? (
                                    <>Importing...</>
                                ) : (
                                    <><Download className="w-3 h-3 mr-2" /> Import from URL</>
                                )}
                            </Button>
                            <p className="text-[10px] text-gray-500 text-center">
                                Google Calendar settings &gt; "Secret address in iCal format"
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
