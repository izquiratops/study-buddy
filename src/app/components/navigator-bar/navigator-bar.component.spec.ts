import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigatorBarComponent } from './navigator-bar.component';

describe('NavigatorBarComponent', () => {
  let component: NavigatorBarComponent;
  let fixture: ComponentFixture<NavigatorBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigatorBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavigatorBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
