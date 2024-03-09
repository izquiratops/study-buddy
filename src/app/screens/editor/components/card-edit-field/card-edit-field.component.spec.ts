import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEditFieldComponent } from './card-edit-field.component';

describe('CardEditFieldComponent', () => {
  let component: CardEditFieldComponent;
  let fixture: ComponentFixture<CardEditFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEditFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardEditFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
