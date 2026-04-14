import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFilter } from './my-filter';

describe('MyFilter', () => {
  let component: MyFilter;
  let fixture: ComponentFixture<MyFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(MyFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
