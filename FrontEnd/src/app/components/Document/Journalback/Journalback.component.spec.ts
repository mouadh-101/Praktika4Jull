/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JournalbackComponent } from './Journalback.component';

describe('JournalbackComponent', () => {
  let component: JournalbackComponent;
  let fixture: ComponentFixture<JournalbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
