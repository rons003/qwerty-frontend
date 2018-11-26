import { Chapter } from './chapters/chapter.model';

export class Module {
    id: string;
    title: string;
    desc: string;
    school_id: string;
    teacher_id: string;
    sectionList: Array<Module>;
    chapterList: Map<string, boolean>;

    static parse(obj: any): Module {
        const module = Object.setPrototypeOf(obj, Module.prototype);

        for (const key of Object.keys(obj)) {
            if (key === 'section_list' ||
                key === 'chapter_list') {

                if (this.isObjectEmpty(obj[key])) {
                    module[key] = new Map<string, boolean>();
                } else {
                    module[key] = new Map<string, boolean>(obj[key]);
                }
                // } else if (key === 'projects') {
                //   user[key] = obj[key].map((project: Project) => {
                //     return Project.parse(project);
                //   });
            } else {
                module[key] = obj[key];
            }
        }

        return module;
    }

    static isObjectEmpty(object: any) {
        return !object || (object.constructor === Object && Object.keys(object).length === 0);
    }

    toJson(): JSON {
        const json = JSON.stringify(this);
        return JSON.parse(json);
    }
}
