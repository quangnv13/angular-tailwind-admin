import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDesignComponent } from './item-design.component';

describe('ItemDesignComponent', () => {
  let component: ItemDesignComponent;
  let fixture: ComponentFixture<ItemDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDesignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
