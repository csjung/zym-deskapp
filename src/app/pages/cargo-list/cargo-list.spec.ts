import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoList } from './cargo-list';

describe('CargoList', () => {
  let component: CargoList;
  let fixture: ComponentFixture<CargoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargoList],
    }).compileComponents();

    fixture = TestBed.createComponent(CargoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
