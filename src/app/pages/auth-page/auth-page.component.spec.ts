import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthFirestoreService } from '@services/fire-storage/auth-firestore.service';
import { LoaderService } from '@services/loader.service';
import { of } from 'rxjs';

import { AuthPageComponent } from './auth-page.component';

describe('AuthPageComponent', () => {
  let component: AuthPageComponent;
  let fixture: ComponentFixture<AuthPageComponent>;
  let authServiceMock: jest.Mocked<AuthFirestoreService>;
  let loaderServiceMock: jest.Mocked<LoaderService>;
  let locationMock: jest.Mocked<Location>;

  beforeEach(async () => {
    authServiceMock = {
      signIn: jest.fn(),
      createAccount: jest.fn(),
      sendSignInLink: jest.fn(),
    } as unknown as jest.Mocked<AuthFirestoreService>;

    loaderServiceMock = {
      show: jest.fn(),
      hide: jest.fn(),
    } as unknown as jest.Mocked<LoaderService>;

    locationMock = {
      path: jest.fn(() => '/login'),
    } as unknown as jest.Mocked<Location>;

    await TestBed.configureTestingModule({
      imports: [
        AuthPageComponent,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {
            path: 'login',
            component: AuthPageComponent,
          },
        ]),
      ],
      providers: [
        { provide: AuthFirestoreService, useValue: authServiceMock },
        { provide: LoaderService, useValue: loaderServiceMock },
        {
          provide: Location,
          useValue: locationMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with email controls', () => {
    expect(component.form.contains('email')).toBeTruthy();
  });

  it('should initialize form with password controls', () => {
    expect(component.form.contains('password')).toBeTruthy();
  });

  it('should toggle password field text type', () => {
    const initialValue = component.isPasswordFieldTextType();
    component.togglePasswordFieldTextType();
    expect(component.isPasswordFieldTextType()).toBe(!initialValue);
  });

  it('should call signIn when submitting login form with correct data', () => {
    authServiceMock.signIn.mockReturnValue(of(null));

    component.form.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
    });

    component.onSubmit();

    expect(authServiceMock.signIn).toHaveBeenCalledWith(
      'test@example.com',
      'Password123!'
    );
  });

  it('should initialize form with name controls', () => {
    locationMock.path.mockReturnValue('/signup');
    component.ngOnInit();

    expect(component.form.contains('name')).toBeTruthy();
  });

  it('should call createAccount when submitting registration form', () => {
    locationMock.path.mockReturnValue('/signup');
    component.ngOnInit();

    authServiceMock.createAccount.mockReturnValue(of(null));

    component.form.patchValue({
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    });

    component.onSubmit();

    expect(authServiceMock.createAccount).toHaveBeenCalledWith(
      'test@example.com',
      'Password123!',
      'Test User'
    );
  });

  it('should call sendSignInLink when registering for email', () => {
    authServiceMock.sendSignInLink.mockReturnValue(of(false));

    component.form.patchValue({
      email: 'test@example.com',
    });

    component.onRegisterForEmail();

    expect(authServiceMock.sendSignInLink).toHaveBeenCalledWith(
      'test@example.com'
    );
  });
});
