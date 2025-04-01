import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermDetailComponent } from './term-detail.component';

describe('TermDetailComponent', () => {
  let component: TermDetailComponent;
  let fixture: ComponentFixture<TermDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
