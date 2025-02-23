import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseTabComponent } from './use-tab.component';

describe('UseTabComponent', () => {
  let component: UseTabComponent;
  let fixture: ComponentFixture<UseTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UseTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
