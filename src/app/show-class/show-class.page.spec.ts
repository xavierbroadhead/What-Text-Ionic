import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowClassPage } from './show-class.page';

describe('ShowClassPage', () => {
  let component: ShowClassPage;
  let fixture: ComponentFixture<ShowClassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowClassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowClassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
