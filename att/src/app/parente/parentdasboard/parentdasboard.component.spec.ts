import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentdasboardComponent } from './parentdasboard.component';

describe('ParentdasboardComponent', () => {
  let component: ParentdasboardComponent;
  let fixture: ComponentFixture<ParentdasboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParentdasboardComponent]
    });
    fixture = TestBed.createComponent(ParentdasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
