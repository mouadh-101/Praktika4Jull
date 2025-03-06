import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraActComponent } from './extra-act.component';

describe('ExtraActComponent', () => {
  let component: ExtraActComponent;
  let fixture: ComponentFixture<ExtraActComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraActComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
