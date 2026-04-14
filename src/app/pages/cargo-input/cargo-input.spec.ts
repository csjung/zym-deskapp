import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoInput } from './cargo-input';

describe('CargoInput', () => {
  let component: CargoInput;
  let fixture: ComponentFixture<CargoInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargoInput],
    }).compileComponents();

    fixture = TestBed.createComponent(CargoInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
