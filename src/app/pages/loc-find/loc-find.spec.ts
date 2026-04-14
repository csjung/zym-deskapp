import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocFind } from './loc-find';

describe('LocFind', () => {
  let component: LocFind;
  let fixture: ComponentFixture<LocFind>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocFind],
    }).compileComponents();

    fixture = TestBed.createComponent(LocFind);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
