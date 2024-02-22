import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecksTableComponent } from './decks-table.component';

describe('DecksTableComponent', () => {
  let component: DecksTableComponent;
  let fixture: ComponentFixture<DecksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecksTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DecksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
