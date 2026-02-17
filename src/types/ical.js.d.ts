declare module 'ical.js' {
    const ICAL: {
        parse(input: string): any[];
        Component: typeof Component;
        Event: typeof Event;
    };
    export default ICAL;

    export class Component {
        constructor(jcal: any[] | string);
        getAllSubcomponents(name: string): Component[];
        getFirstPropertyValue(name: string): any;
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
    }
}
