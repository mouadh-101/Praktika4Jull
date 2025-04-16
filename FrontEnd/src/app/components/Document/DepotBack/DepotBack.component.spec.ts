/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DepotBackComponent } from './DepotBack.component';

describe('DepotBackComponent', () => {
  let component: DepotBackComponent;
  let fixture: ComponentFixture<DepotBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepotBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
