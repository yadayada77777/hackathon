import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAndFilterBarComponent } from './nav-and-filter-bar.component';

describe('NavAndFilterBarComponent', () => {
  let component: NavAndFilterBarComponent;
  let fixture: ComponentFixture<NavAndFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavAndFilterBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavAndFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
