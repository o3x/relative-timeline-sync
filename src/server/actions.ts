"use server";

export async function fetchCalendarFromUrl(url: string): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

        if (!response.ok) {
            return { success: false, error: `Failed to fetch calendar: ${response.status} ${response.statusText}` };
        }

        const text = await response.text();
        return { success: true, data: text };
    } catch (error) {
        console.error("Error fetching calendar from URL:", error);
        return { success: false, error: "Failed to fetch calendar. Please check the URL." };
    }
}
