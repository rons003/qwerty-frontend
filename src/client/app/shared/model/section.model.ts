
export class Section {
    id: string;
    name: string;
    section_start: string;
    section_end: string;

    static parse(obj: any): Section {
        const section = Object.setPrototypeOf(obj, Section.prototype);

        for (const key of Object.keys(obj)) {
            section[key] = obj[key];
        }
        return section;
    }


}
