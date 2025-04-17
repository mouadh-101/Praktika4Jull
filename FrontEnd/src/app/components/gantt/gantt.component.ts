
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  EditSettingsModel,
  ToolbarItem,
  GanttComponent as EJ2GanttComponent
} from '@syncfusion/ej2-angular-gantt';

import { PlanDeTravail, TacheGantt } from 'src/app/models/plan-de-travail.model';



@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css']
})
export class GanttComponent implements OnInit {
  @Input() planDeTravail!: PlanDeTravail;
  @ViewChild('ganttRef', { static: false }) ganttObj!: EJ2GanttComponent;

  public taskSettings: any;
  public data: any[] = [];
  public columns: any[] = [];
  public toolbar: ToolbarItem[] = [];
  public editSettings!: EditSettingsModel;

  ngOnInit(): void {
    this.data = this.transformTaches(this.planDeTravail.planning);

    this.taskSettings = {
      id: 'id',
      name: 'nomTache',
      startDate: 'dateDebut',
      endDate: 'dateFin'
    };

    this.columns = [
      { field: 'nomTache', headerText: 'Tâche', width: '250' },
      { field: 'dateDebut', headerText: 'Début', width: '150' },
      { field: 'dateFin', headerText: 'Fin', width: '150' }
    ];

    this.toolbar = ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'ExcelExport', 'PdfExport'];

    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: false
    };
  }

  transformTaches(taches: TacheGantt[]): any[] {
    return taches.map((t, index) => ({
      id: index + 1,
      nomTache: t.nomTache,
      dateDebut: new Date(t.dateDebut),
      dateFin: new Date(t.dateFin)
    }));
  }

  public toolbarClick(args: any): void {
    if (args.item.id === 'Gantt_excelexport') {
      this.ganttObj.excelExport();
    } else if (args.item.id === 'Gantt_pdfexport') {
      this.ganttObj.pdfExport({ fileName: 'ProjectDate.pdf', enableFooter: false });
    }
  }
  
}
