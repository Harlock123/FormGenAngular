import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormgenLibComponent } from './formgen-lib.component';

describe('FormgenLibComponent', () => {
  let component: FormgenLibComponent;
  let fixture: ComponentFixture<FormgenLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormgenLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormgenLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
