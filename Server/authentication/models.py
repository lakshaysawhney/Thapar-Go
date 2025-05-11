from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, full_name, phone_number=None, gender=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not full_name:
            raise ValueError('The Full Name field must be set')
        email = self.normalize_email(email)
        user = self.model(email = email, full_name = full_name, phone_number = phone_number, gender = gender, **extra_fields)
        user.set_unusable_password()  # Google OAuth users do not have passwords
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, full_name, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email=email, full_name=full_name, **extra_fields)

# Custom User Model using AbstractBaseUser class i.e. defining all fields from scratch
class CustomUser(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Others', 'Others') 
    ]
    google_authenticated = models.BooleanField(default=False)
    #user related fields
    email = models.EmailField(unique = True)
    full_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15, null=True, blank=True, unique=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    # admin related fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    # miscellaneous fields
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    

    def __str__(self):
        return f"{self.full_name} ({self.email})"