import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsclientComponent } from './formationsclient.component';

describe('FormationsclientComponent', () => {
  let component: FormationsclientComponent;
  let fixture: ComponentFixture<FormationsclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationsclientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationsclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
