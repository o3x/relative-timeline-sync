import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
    daysAlive: number;
    birthDate: string;
}

export function StatsCard({ daysAlive, birthDate }: StatsCardProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-black/40 backdrop-blur-md border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Days Alive</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        {daysAlive.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Since {birthDate}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
