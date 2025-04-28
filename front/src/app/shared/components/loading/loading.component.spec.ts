import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '@core/services/shared/loading/loading.service';
import { BehaviorSubject } from 'rxjs';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingServiceMock: Partial<LoadingService>;

  beforeEach(async () => {
    loadingServiceMock = {
      loading$: new BehaviorSubject(false)
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatProgressSpinnerModule, LoadingComponent],
      providers: [{ provide: LoadingService, useValue: loadingServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });
});
