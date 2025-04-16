import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExmanComponent } from './exman.component';

describe('ExmanComponent', () => {
  let component: ExmanComponent;
  let fixture: ComponentFixture<ExmanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExmanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
