import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParenteComponent } from './parente.component';

describe('ParenteComponent', () => {
  let component: ParenteComponent;
  let fixture: ComponentFixture<ParenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParenteComponent]
    });
    fixture = TestBed.createComponent(ParenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
