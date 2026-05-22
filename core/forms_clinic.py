from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.validators import RegexValidator
from .models import User, VeterinaryClinic


# ── Validators ────────────────────────────────────────────────────────────────

# Password must be 8+ chars with uppercase, lowercase, number, special character
password_validator = RegexValidator(
    regex=r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
    message=(
        'Password must be at least 8 characters and include an uppercase letter, '
        'a lowercase letter, a number, and a special character (@$!%*?&).'
    ),
)

# Contact details: Australian phone (10 digits starting with 02/03/04/07/08) OR email
phone_or_email_validator = RegexValidator(
    regex=r'^(0[2-478]\d{8}|[^\s@]+@[^\s@]+\.[^\s@]+)$',
    message=(
        'Enter a valid Australian phone number (e.g. 0298765432 or 0412345678) '
        'or a valid email address.'
    ),
)


# ── Vet Clinic Registration Form ──────────────────────────────────────────────

class VetClinicRegistrationForm(UserCreationForm):
    """
    Registration form for veterinary clinic accounts.
    On save: creates a User (role='vet_clinic') and a linked VeterinaryClinic.
    """

    clinic_name = forms.CharField(
        min_length=2,
        max_length=100,
        widget=forms.TextInput(attrs={
            'id': 'id_clinic_name',
            'placeholder': 'Enter your clinic name',
        }),
    )

    clinic_contact_details = forms.CharField(
        max_length=100,
        validators=[phone_or_email_validator],
        widget=forms.TextInput(attrs={
            'id': 'id_clinic_contact_details',
            'placeholder': 'e.g. 0298765432 or contact@clinic.com.au',
        }),
    )

    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'id': 'id_email',
            'placeholder': 'clinic@example.com',
        }),
    )

    password1 = forms.CharField(
        label='Password',
        validators=[password_validator],
        widget=forms.PasswordInput(attrs={
            'id': 'id_password1',
            'placeholder': 'Create a strong password',
        }),
    )

    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={
            'id': 'id_password2',
            'placeholder': 'Re-enter your password',
        }),
    )

    class Meta:
        model = User
        fields = ('email', 'password1', 'password2')

    # ── Server-side field validation ───────────────────────────────────────

    def clean_email(self):
        """Reject duplicate email addresses (case-insensitive)."""
        email = self.cleaned_data['email'].lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError(
                'An account with this email address already exists.'
            )
        return email

    def clean_clinic_name(self):
        return self.cleaned_data['clinic_name'].strip()

    def clean_clinic_contact_details(self):
        return self.cleaned_data['clinic_contact_details'].strip()

    # ── Save: create User + VeterinaryClinic ──────────────────────────────

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = 'vet_clinic'
        # Store clinic name in first_name so the nav bar "Welcome, X" works
        user.first_name = self.cleaned_data['clinic_name']
        if commit:
            user.save()
            VeterinaryClinic.objects.create(
                user=user,
                clinic_name=self.cleaned_data['clinic_name'],
                clinic_contact_details=self.cleaned_data['clinic_contact_details'],
            )
        return user