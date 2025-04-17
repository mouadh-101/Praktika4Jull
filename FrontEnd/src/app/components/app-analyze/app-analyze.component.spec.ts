import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAnalyzeComponent } from './app-analyze.component';

describe('AppAnalyzeComponent', () => {
  let component: AppAnalyzeComponent;
  let fixture: ComponentFixture<AppAnalyzeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAnalyzeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
