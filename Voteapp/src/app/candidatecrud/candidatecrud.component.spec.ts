import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatecrudComponent } from './candidatecrud.component';

describe('CandidatecrudComponent', () => {
  let component: CandidatecrudComponent;
  let fixture: ComponentFixture<CandidatecrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatecrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatecrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
