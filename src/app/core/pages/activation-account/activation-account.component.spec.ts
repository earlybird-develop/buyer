import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationAccountComponent } from './activation-account.component';

describe('ActivationAccountComponent', () => {
  let component: ActivationAccountComponent;
  let fixture: ComponentFixture<ActivationAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
