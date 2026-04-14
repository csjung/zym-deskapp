import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoOrder } from './auto-order';

describe('AutoOrder', () => {
  let component: AutoOrder;
  let fixture: ComponentFixture<AutoOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(AutoOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
