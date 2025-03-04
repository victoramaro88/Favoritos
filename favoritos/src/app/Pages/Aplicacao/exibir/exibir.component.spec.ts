import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExibirComponent } from './exibir.component';

describe('ExibirComponent', () => {
  let component: ExibirComponent;
  let fixture: ComponentFixture<ExibirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExibirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExibirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
