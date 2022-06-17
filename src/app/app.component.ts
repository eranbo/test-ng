import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ThemePalette } from "@angular/material/core";

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'test-ng';
  public organizationFilterText: string = '';
  public merakiOrganizations: Array<any> = [];
  public filteredMerakiOrganizations: Array<any> = [];
  public isAllSelected: boolean = false;
  task: Task;

  allComplete: boolean = false;

  constructor() {
    this.task = {
      name: 'Indeterminate',
      completed: false,
      color: 'primary',
      subtasks: [
        {name: 'Primary', completed: false, color: 'primary'},
        {name: 'Accent', completed: false, color: 'accent'},
        {name: 'Warn', completed: false, color: 'warn'},
      ],
    }
  }

  public get organizationAllSelected(): boolean {
    return !this.merakiOrganizations.find(merakiOrganization => !merakiOrganization.selected);
  }

  setAllOrgs(isAllSelected: boolean) {
    this.isAllSelected = isAllSelected;
    this.merakiOrganizations.forEach(t => t.selected = isAllSelected);
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }

  organizationFilterTextChange(newValue: string) {
    if (_.isEmpty(newValue)) {
      this.filteredMerakiOrganizations = this.merakiOrganizations;
      return;
    }
    this.filteredMerakiOrganizations = this.merakiOrganizations.filter(merakiOrg =>
      _.includes(merakiOrg.name.toLowerCase().replaceAll(' ', ''), newValue.toLowerCase().replaceAll(' ', ''))
    )
  }

  someSelected() {
    return this.merakiOrganizations.filter(t => t.selected).length > 0 && !this.isAllSelected;
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  async ngOnInit() {
    this.filteredMerakiOrganizations = this.merakiOrganizations = await this.getMerakiOrganizations();
    this.isAllSelected = this.organizationAllSelected;
  }

  onOrganizationSelectionChange() {
    this.isAllSelected = this.merakiOrganizations.every(t => t.selected);
    // console.log(this.merakiOrganizations.map(t => t.selected));
  }

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }


  private async getMerakiOrganizations(): Promise<Array<any>> {
    const merakiOrganizations: Array<any> = [
      {id: 'a', name: 'AirEye', selected: false},
      {id: 'b', name: 'The Calvoz', selected: false},
      {id: 'c', name: 'Mickey Dev 5', selected: false},
      {id: 'd', name: 'hadassa', selected: false},
      {id: 'e', name: 'Malam Team', selected: false},
      {id: 'f', name: 'My Heritage', selected: false},
      {id: 'g', name: 'MTC', selected: false},
    ];

    return _.orderBy(merakiOrganizations, (org: { name: string; }) => org.name.toLowerCase(), 'asc')
  }
}
