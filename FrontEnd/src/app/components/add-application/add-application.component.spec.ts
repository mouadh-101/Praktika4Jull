import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddApplicationDialogComponent } from './add-application.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationService } from 'src/app/services/application.service';
import { of } from 'rxjs';

describe('AddApplicationDialogComponent', () => {
  let component: AddApplicationDialogComponent;
  let fixture: ComponentFixture<AddApplicationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddApplicationDialogComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { internshipId: 1 }
        },
        {
          provide: ApplicationService,
          useValue: {
            addApplication: jasmine.createSpy('addApplication').and.returnValue(of({}))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddApplicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
