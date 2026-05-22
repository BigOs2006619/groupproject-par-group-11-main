from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.validators import RegexValidator
from .models import EligibilityPolicy, StaffPermission, User

# --- Dog Owner Form --- Khalid, form is not complete ...

# Mobile Validation
mobile_Validator = RegexValidator(
    regex=r'^04\d{8}$',
    message='Enter a valid Australian mobile number starting with 04, and must be TEN digits long.',
)

#Postcode Validation
postcode_Validator = RegexValidator(
    regex=r'^\d{4}$',
    message='Enter a valid Australian postcode, postcode can only be FOUR digits.',
)

# Alphabetic Validation
alphabetic_Validator = RegexValidator(
    regex=r'^[a-zA-Z]+$', 
    message='Last name must contain alphabetic characters only.',

)

# User creation form for potential Dog Owner

class DogOwnerRegistrationForm(UserCreationForm):
    first_name = forms.CharField(
        min_length=2,
        max_length=50,
        validators=[alphabetic_Validator]
    )

    last_name = forms.CharField(
        min_length=2,
        max_length=50,
        validators=[alphabetic_Validator]
    )

    mobile = forms.CharField(
        max_length=10,
        validators=[mobile_Validator]
    )

    email = forms.EmailField()
    street = forms.CharField(max_length=70)
    suburb = forms.CharField(max_length=70)
    state = forms.ChoiceField(choices=[
        ('NSW', 'NSW'), ('VIC', 'VIC'),
        ('WA', 'WA'), ('SA', 'SA'), ('ACT', 'ACT'), ('NT', 'NT'),
    ])

    postcode = forms.CharField(
        max_length=4,
        validators=[postcode_Validator]
    )

    class Meta:
        model =  User
        fields = ('email', 'first_name', 'last_name', 'mobile', 
            'street', 'suburb', 'state', 'postcode', 'password1',
            'password2',)

    # checking if an email address already exists. And ensure it wouldnt be over used
    def clean_email(self):
        email = self.cleaned_data['email'].lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError('An account with this email already exists.')
        return email
        
    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = 'dog_owner'
        user.mobile = self.cleaned_data['mobile']
        user.street = self.cleaned_data['street']
        user.suburb = self.cleaned_data['suburb']
        user.state = self.cleaned_data['state']
        user.postcode = self.cleaned_data['postcode']
        if commit:
            user.save()
        return user

class DogOwnerProfileForm(forms.ModelForm):
    new_password = forms.CharField(
        required=False,
        widget=forms.PasswordInput,
        min_length=8,
        validators=[RegexValidator(
            regex=r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])',
            message='Password must include uppercase, lowercase, number and special character.'
        )]
    )
    confirm_password = forms.CharField(
        required=False,
        widget=forms.PasswordInput
    )

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'mobile', 'street', 'suburb', 'state', 'postcode')

    def __init__(self, *args, **kwargs):
        # Stores the current user to check email uniquness
        self.current_user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

    def clean_email(self):
        email = self.cleaned_data['email'].lower().strip()
        if User.objects.filter(email__iexact=email).exclude(pk=self.current_user.pk).exists():
            raise forms.ValidationError('This email is already used by another account.')
        return email

    def clean(self):
        cleaned_data = super().clean()
        new_password = cleaned_data.get('new_password')
        confirm_password = cleaned_data.get('confirm_password')
        # Only validate if user entered a new password
        if new_password and new_password != confirm_password:
            raise forms.ValidationError('Passwords do not match.')
        return cleaned_data
          

class StaffPermissionForm(forms.ModelForm):
    user = forms.ModelChoiceField(
        queryset=User.objects.filter(role='staff'),
        label='Staff Member',
    )
    # Django form
    class Meta:
        model = StaffPermission
        fields = [
            'user',
            'manage_donor_registrations',
            'manage_eligibility_assessments',
            'manage_donation_requests',
            'perform_donor_clinic_matching',
        ]
        labels = {
            'manage_donor_registrations': 'Manage Donor Registrations',
            'manage_eligibility_assessments': 'Manage Eligibility Assessments',
            'manage_donation_requests': 'Manage Donation Requests',
            'perform_donor_clinic_matching': 'Perform Donor–Clinic Matching',
        }


# Create/update an eligibility policy
class EligibilityPolicyForm(forms.ModelForm):
    # Policy name is required
    policy_name = forms.CharField(max_length=100)

    # Policy description is required
    policy_description = forms.CharField(widget=forms.Textarea)

    class Meta:
        model = EligibilityPolicy
        fields = ['policy_name', 'policy_description']

