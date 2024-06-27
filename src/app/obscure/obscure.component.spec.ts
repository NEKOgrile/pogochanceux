import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObscureComponent } from './obscure.component';

describe('ObscureComponent', () => {
  let component: ObscureComponent;
  let fixture: ComponentFixture<ObscureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObscureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObscureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
