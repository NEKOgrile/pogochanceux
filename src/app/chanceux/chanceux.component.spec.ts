import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanceuxComponent } from './chanceux.component';

describe('ChanceuxComponent', () => {
  let component: ChanceuxComponent;
  let fixture: ComponentFixture<ChanceuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChanceuxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChanceuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
