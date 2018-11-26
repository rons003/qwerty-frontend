import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ExcludeElementsPipe } from '../shared/exclude-elements.pipe';

import { GroupService } from './group.service';
import { StudentService } from './student.service';
import { ChapterService } from '../chapters/chapter.service';

import { Group } from './group.model';
import { User } from '../shared/user.model';
import { Chapter } from '../chapters/chapter.model';

/**
 * This class represents the lazy loaded GroupsFormComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'cg-group-form',
  templateUrl: 'group-form.component.html',
  styleUrls: ['group-form.component.css'],
})
export class GroupFormComponent implements OnInit {

  groupForm: FormGroup;

  private group: Group;

  private students: User[] = [];
  private selectedStudents: User[] = [];

  private chapters: Chapter[] = [];
  private selectedChapters: Chapter[] = [];

  /**
   * Creates an instance of the GroupsFormComponent.
   */
  constructor(
    private groupService: GroupService,
    private studentService: StudentService,
    private chapterService: ChapterService,
    private excludeElementsPipe: ExcludeElementsPipe,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.createForm();

    studentService.getStudents().subscribe(function(students: User[]) {
      this.students = students;
    }.bind(this));

    chapterService.getAllChapters().subscribe(function(chapters: Chapter[]) {
      this.chapters = chapters;
    }.bind(this));
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { group: Group }) => {
        this.group = data.group;

        this.selectedStudents = data.group.students;
        this.selectedChapters = data.group.chapters;

        this.groupForm.patchValue({
          name: data.group.name,
          iconUrl: data.group.groupIcon
        });
      });
  }

  createForm() {
    // TODO char length validators
    this.groupForm = this.formBuilder.group({
      name: ['', Validators.required ],
      students: [],
      chapters: [],
      iconUrl: ''
    });
  }

  onSubmit() {
    const group = this.getGroupFormData();
    if (this.group) {
      this.groupService.updateGroup(this.group.id, group);
    } else {
      this.groupService.createGroup(group);
    }
    this.router.navigate(['/dashboard/admin']);
  }

  onCancel() {
    this.router.navigate(['/dashboard/admin']);
  }

  onStudentSelected(selectedStudent: any) {
    if (selectedStudent.firstName) {
      this.selectedStudents.push(selectedStudent);
    }
  }

  onChapterSelected(selectedChapter: any) {
    if (selectedChapter.name) {
      this.selectedChapters.push(selectedChapter);
    }
  }

  getGroupFormData(): Group {
    const formModel = this.groupForm.value;

    const group: Group = new Group(formModel.name);

    group.students = this.selectedStudents.slice();
    group.chapters = this.selectedChapters.slice();
    group.groupIcon = formModel.iconUrl;

    return group;
  }

  getSelectedChapters(): Chapter[] {
    return this.selectedChapters;
  }

  getStudents(keyword: any): Observable<any[]> {
    const filteredResults = this.excludeElementsPipe.transform(this.students, this.selectedStudents);
    if (keyword) {
      const searchResults = filteredResults.filter(res => {
        const name = res.firstName + ' ' + res.lastName + ' ' + res.email;
        return name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
      return Observable.of(searchResults);
    } else {
      return Observable.of(filteredResults);
    }
  }

  getChapters(keyword: any): Observable<any[]> {
    const filteredResults = this.excludeElementsPipe.transform(this.chapters, this.selectedChapters);
    if (keyword) {
      const searchResults = filteredResults.filter(res => {
        const name = res.name + ' ' + res.topic;
        return name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
      return Observable.of(searchResults);
    } else {
      return Observable.of(filteredResults);
    }
  }

  getStudentNameFormat(data: any): string {
    return `${data.firstName} ${data.lastName} (${data.email})`;
  }

  getChapterNameFormat(data: any): string {
    return `${data.name}`;
  }

  removeSelectedStudent(index: number) {
    this.selectedStudents.splice(index, 1);
  }

  removeSelectedChapter(index: number) {
    this.selectedChapters.splice(index, 1);
  }

}
