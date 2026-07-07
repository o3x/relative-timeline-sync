declare module 'ical.js' {
    const ICAL: {
        parse(input: string): unknown;
        Component: typeof Component;
        Event: typeof Event;
    };
    export default ICAL;

    export class Component {
        constructor(jcal: unknown);
        getAllSubcomponents(name: string): Component[];
        getFirstPropertyValue(name: string): unknown;
    }

    export class Event {
        constructor(component: Component | null);
        summary: string;
        description: string;
        startDate: Time;
        endDate: Time;
    }

    export class Time {
        toJSDate(): Date;
        isDate: boolean;
    }
}
