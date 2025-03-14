import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillListComponent } from './billlist.component';

describe('BilllistComponent', () => {
  let component: BillListComponent;
  let fixture: ComponentFixture<BillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
