import { Person, Event } from "@/types";

export const MOCK_PERSONS: Person[] = [
    {
        id: "steve-jobs",
        name: "Steve Jobs",
        birthDate: "1955-02-24",
        deathDate: "2011-10-05",
        description: "Co-founder of Apple Inc.",
        themeColor: "bg-slate-800",
        events: [
            { id: "sj-1", date: "1976-04-01", title: "Founded Apple", description: "Apple Computer Company was founded.", age: 21 },
            { id: "sj-2", date: "1984-01-24", title: "Macintosh Launch", description: "Introduced the Macintosh 128K.", age: 28 },
            { id: "sj-3", date: "1985-09-16", title: "Resigned from Apple", description: "Left Apple to found NeXT.", age: 30 },
            { id: "sj-4", date: "1996-12-20", title: "Return to Apple", description: "Apple acquired NeXT.", age: 41 },
            { id: "sj-5", date: "2001-10-23", title: "iPod Launch", description: "Introduced the first iPod.", age: 46 },
            { id: "sj-6", date: "2007-06-29", title: "iPhone Launch", description: "Released the first iPhone.", age: 52 },
        ]
    },
    {
        id: "elon-musk",
        name: "Elon Musk",
        birthDate: "1971-06-28",
        description: "CEO of Tesla and SpaceX",
        themeColor: "bg-red-600",
        events: [
            { id: "em-1", date: "1995-01-01", title: "Founded Zip2", description: "First company, Zip2, was founded.", age: 23 },
            { id: "em-2", date: "1999-03-01", title: "Founded X.com", description: "Online financial services company.", age: 27 },
            { id: "em-3", date: "2002-05-06", title: "Founded SpaceX", description: "Space Exploration Technologies Corp.", age: 30 },
            { id: "em-4", date: "2004-02-01", title: "Joined Tesla", description: "Joined Tesla Motors as chairman.", age: 32 },
            { id: "em-5", date: "2008-09-28", title: "Falcon 1 Successful Launch", description: "First privately liquid-fueled rocket to reach orbit.", age: 37 },
            { id: "em-6", date: "2012-05-22", title: "Dragon Docks with ISS", description: "First commercial spacecraft to dock with ISS.", age: 40 },
        ]
    }
];
