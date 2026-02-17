/**
 * Last Updated: Tue Feb 17 02:55:00 JST 2026
 */
"use client"

import { useState, useEffect } from "react"
import { CalendarImport } from "@/components/CalendarImport"
import { DateInput } from "@/components/DateInput"
import { StatsCard } from "@/components/StatsCard"
import { Timeline } from "@/components/Timeline"
import { ComparisonView } from "@/components/ComparisonView"
import { MOCK_PERSONS } from "@/data/mockData"
import { calculateDaysAlive, calculateRelativeDays } from "@/lib/utils"
import { Person, Event } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [birthDate, setBirthDate] = useState<string>("")
  const [daysAlive, setDaysAlive] = useState<number>(0)
  const [enrichedPersons, setEnrichedPersons] = useState<Person[]>([])
  const [myEvents, setMyEvents] = useState<Event[]>([])

  useEffect(() => {
    if (birthDate) {
      const days = calculateDaysAlive(birthDate)
      setDaysAlive(days)

      const enriched = MOCK_PERSONS.map(person => ({
        ...person,
        events: person.events.map(event => ({
          ...event,
          relativeDays: calculateRelativeDays(person.birthDate, event.date)
        }))
      }))
      setEnrichedPersons(enriched)

      if (myEvents.length > 0) {
        const updatedMyEvents = myEvents.map(event => ({
          ...event,
          relativeDays: calculateRelativeDays(birthDate, event.date)
        }));
        setMyEvents(updatedMyEvents);
      }
    }
  }, [birthDate, myEvents.length])

  const handleDateSubmit = (date: string) => {
    setBirthDate(date)
  }

  const handleCalendarImport = (events: Event[]) => {
    if (birthDate) {
      const processedEvents = events.map(e => ({
        ...e,
        relativeDays: calculateRelativeDays(birthDate, e.date)
      }))
      setMyEvents(processedEvents)
    } else {
      setMyEvents(events)
    }
  }

  if (!birthDate) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-black via-slate-900 to-black text-white">
        <DateInput onSubmit={handleDateSubmit} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-widest text-white">RELATIVE TIMELINE</h1>
          <p className="text-sm text-gray-500">Your Life Journey</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-full md:w-auto">
            <CalendarImport onImport={handleCalendarImport} />
          </div>
          <button onClick={() => setBirthDate("")} className="text-xs text-gray-500 hover:text-white transition-colors whitespace-nowrap">
            Reset
          </button>
        </div>
      </header>

      <div className="mb-8">
        <StatsCard daysAlive={daysAlive} birthDate={birthDate} />
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8 bg-white/5">
          <TabsTrigger value="timeline">My Timeline</TabsTrigger>
          <TabsTrigger value="compare">Compare with Legends</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          {myEvents.length > 0 ? (
            <Timeline
              events={myEvents}
              birthDate={birthDate}
              comparisonPersons={enrichedPersons}
            />
          ) : (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-lg">
              <p className="text-gray-400 mb-2">No events found.</p>
              <p className="text-sm text-gray-600">Import your calendar .ics file to visualize your history.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compare">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrichedPersons.map(person => (
              <ComparisonView key={person.id} person={person} currentDaysAlive={daysAlive} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
