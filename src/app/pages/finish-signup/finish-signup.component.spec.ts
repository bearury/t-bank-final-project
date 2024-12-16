import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { FinishSignupComponent } from '@pages/finish-signup/finish-signup.component';
import { AuthFirestoreService } from '@services/fire-storage/auth-firestore.service';
import { of } from 'rxjs';

describe('FinishSignupComponent', () => {
  let component: FinishSignupComponent;
  let fixture: ComponentFixture<FinishSignupComponent>;
  let authServiceMock: AuthFirestoreService;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      confirmSignIn: jest.fn().mockReturnValue(of(undefined))
    } as unknown as jest.Mocked<AuthFirestoreService>;

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [FinishSignupComponent, RouterModule.forRoot([{
        path: 'finish-signup',
        component: FinishSignupComponent
      }])],
      providers: [
        { provide: AuthFirestoreService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FinishSignupComponent);
    component = fixture.componentInstance;
    authServiceMock = TestBed.inject(AuthFirestoreService);
    router = TestBed.inject(Router); // убедитесь, что это правильно
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call confirmSignIn if email is in localStorage', () => {
    const email = 'test@example.com';
    window.localStorage.setItem('emailForSignIn', email);

    component.ngOnInit();

    expect(authServiceMock.confirmSignIn).toHaveBeenCalledWith(email);
  });

  it('should navigate if email is in localStorage', () => {
    const email = 'test@example.com';
    window.localStorage.setItem('emailForSignIn', email);

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not call confirmSignIn if email is not in localStorage', () => {
    window.localStorage.removeItem('emailForSignIn');

    component.ngOnInit();

    expect(authServiceMock.confirmSignIn).not.toHaveBeenCalled();
  });

  afterEach(() => {
    window.localStorage.removeItem('emailForSignIn');
  });
});

