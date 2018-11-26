export class Section {
    id: string;
    title: string;
    name: string;
    studentList: Array<Section>;

    static parse(obj: any): Section {
        const section = Object.setPrototypeOf(obj, Section.prototype);

        for (const key of Object.keys(obj)) {
            if (key === 'student_list') {
                // key === 'sectionList' ||
                // key === 'chapterList') {

                if (this.isObjectEmpty(obj[key])) {
                    section[key] = new Map<string, boolean>();
                } else {
                    section[key] = new Map<string, boolean>(obj[key]);
                }
                // } else if (key === 'projects') {
                //   user[key] = obj[key].map((project: Project) => {
                //     return Project.parse(project);
                //   });
            } else {
                section[key] = obj[key];
            }
        }

        return section;
    }

    static isObjectEmpty(object: any) {
        return !object || (object.constructor === Object && Object.keys(object).length === 0);
    }

    toJson(): JSON {
        const json = JSON.stringify(this);
        return JSON.parse(json);
    }
}
