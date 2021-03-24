import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingpageComponent } from './listingpage.component';

describe('ListingpageComponent', () => {
  let component: ListingpageComponent;
  let fixture: ComponentFixture<ListingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
