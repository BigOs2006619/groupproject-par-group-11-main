from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

# Replace the default username field with email for login
class User(AbstractUser):
    ROLE_CHOICES = [
        ('dog_owner', 'Dog Owner'),
        ('vet_clinic', 'Veterniary Clinic'),
        ('staff', 'Authorised Staff'),
        ('admin', 'Administrator'),
    ]
    
    username = None
    # Removes the default username field 
    objects = CustomUserManager()
    # Email is a unique login crediential and will be used as so
    email = models.EmailField(unique=True)
    # Role determines wether user what priveledges they gain after authorisation
    role = models.CharField(max_length=20, blank=True)
    # Contact details for Dog Owners
    mobile = models.CharField(max_length=15, blank=True)
    street = models.CharField(max_length=100, blank=True)
    suburb = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=30, blank=True)
    postcode = models.CharField(max_length=4, blank=True)

# Ensuring Django to use email and not username for authetification
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

# Linking 1 to 1 with the User Model
class VeterinaryClinic(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    clinic_name = models.CharField(max_length=100)
    clinic_contact_details = models.CharField(max_length=100)

    def __str__(self):
        return self.clinic_name

# Dogs are regiestered in the blood donation system
# Each dog is linked to a dog owner
# Each Dog has eligbility status
# Each Dog has a blood type
class DogDonor(models.Model):
    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female')]
    ELIGIBILITY_CHOICES = [
        ('Eligible', 'Eligible'),
        ('Temporarily Ineligible', 'Temporarily Ineligible'),
        ('Permanently Ineligible', 'Permanently Ineligible'),
        ('Pending', 'Pending'),
    ]
    BLOOD_TYPE_CHOICES = [
        ('DEA 1.1+', 'DEA 1.1+'),
        ('DEA 1.1-', 'DEA 1.1-'),
        ('DEA 1.2+', 'DEA 1.2+'),
        ('DEA 1.2-', 'DEA 1.2-'),
        ('DEA 3', 'DEA 3'),
        ('DEA 4', 'DEA 4'),
        ('DEA 7', 'DEA 7'),
        ('Unknown', 'Unknown'),
    ]
 # Dog Biometrics
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    dog_name = models.CharField(max_length=30)
    breed = models.CharField(max_length=50)
    age = models.PositiveIntegerField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
    blood_type = models.CharField(max_length=10, choices=BLOOD_TYPE_CHOICES, blank=True)
    vaccination_status = models.BooleanField(default=False)
    health_declaration = models.BooleanField(default=False)
    health_status = models.CharField(max_length=200, blank=True)
    eligibility_status = models.CharField(max_length=30, choices=ELIGIBILITY_CHOICES, default='Pending')
    next_eligible_date = models.DateField(null=True, blank=True)
    suspension_status = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.dog_name} ({self.owner})"

# Dog eligibility assessment and is determined by staff
# Records stored for auditing purposes
class EligibilityAssessment(models.Model):
    ELIGIBILITY_CHOICES = [
        ('Eligible', 'Eligible'),
        ('Temporarily Ineligible', 'Temporarily Ineligible'),
        ('Permanently Ineligible', 'Permanently Ineligible'),
    ]

    dog = models.ForeignKey(DogDonor, on_delete=models.CASCADE)
    assessed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    eligibility_status = models.CharField(max_length=30, choices=ELIGIBILITY_CHOICES)
    assessment_date = models.DateField()
    reason_for_ineligibility = models.TextField(blank=True)
    next_eligible_date = models.DateField(null=True, blank=True)
    decision_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.dog} - {self.eligibility_status} ({self.assessment_date})"

# Blood donation request submitted by veterinary clinic
# Set up for priority levels
class BloodDonationRequest(models.Model):
    URGENCY_CHOICES = [('Routine', 'Routine'), ('Emergency', 'Emergency')]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Deferred', 'Deferred'),
    ]
    BLOOD_TYPE_CHOICES = [
        ('DEA 1.1+', 'DEA 1.1+'),
        ('DEA 1.1-', 'DEA 1.1-'),
        ('DEA 1.2+', 'DEA 1.2+'),
        ('DEA 1.2-', 'DEA 1.2-'),
        ('DEA 3', 'DEA 3'),
        ('DEA 4', 'DEA 4'),
        ('DEA 7', 'DEA 7'),
    ]

    clinic = models.ForeignKey(VeterinaryClinic, on_delete=models.CASCADE)
    required_blood_type = models.CharField(max_length=10, choices=BLOOD_TYPE_CHOICES)
    quantity_required = models.PositiveIntegerField()
    urgency_level = models.CharField(max_length=10, choices=URGENCY_CHOICES)
    required_date = models.DateField()
    additional_clinical_notes = models.TextField(blank=True, max_length=500)
    request_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.clinic} - {self.required_blood_type} ({self.urgency_level})"

# As records match between The Donor Dog and a Blood Donation Request
# Donor Match is made by authorised staff
class DonorClinicMatch(models.Model):
    STATUS_CHOICES = [
        ('Proposed', 'Proposed'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    ]

    request = models.ForeignKey(BloodDonationRequest, on_delete=models.CASCADE)
    dog = models.ForeignKey(DogDonor, on_delete=models.CASCADE)
    matched_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    eligibility_confirmation = models.BooleanField(default=False)
    notes = models.TextField(blank=True, max_length=300)
    match_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Proposed')

    def __str__(self):
        return f"{self.dog} matched to {self.request}"

# Records the oucome of a completed blood donation
# Also triggers a recovery period on the donor dog as determined by authorised staff
class BloodDonation(models.Model):
    OUTCOME_CHOICES = [
        ('Completed', 'Completed'),
        ('Incomplete', 'Incomplete'),
        ('Cancelled', 'Cancelled'),
    ]

    dog = models.ForeignKey(DogDonor, on_delete=models.CASCADE)
    request = models.ForeignKey(BloodDonationRequest, on_delete=models.SET_NULL, null=True, blank=True)
    donation_date = models.DateField()
    receiving_clinic = models.ForeignKey(VeterinaryClinic, on_delete=models.SET_NULL, null=True)
    volume_donated = models.PositiveIntegerField()
    post_donation_notes = models.TextField(blank=True, max_length=500)
    recovery_period_end_date = models.DateField()
    donation_outcome = models.CharField(max_length=15, choices=OUTCOME_CHOICES, blank=True)

    def __str__(self):
        return f"{self.dog} - {self.donation_date}"

# Stores notifications which is sent to Dog owners
# Used for donation selection and outcome alerts
class Notification(models.Model):
    TYPE_CHOICES = [
        ('Selected', 'Selected for Donation'),
        ('Outcome', 'Donation Outcome'),
    ]
# The Dog owners receving the notification
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    related_dog = models.ForeignKey(DogDonor, on_delete=models.SET_NULL, null=True, blank=True)
    related_request = models.ForeignKey(BloodDonationRequest, on_delete=models.SET_NULL, null=True, blank=True)
    notification_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read_status = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} - {self.notification_type}"

# Stores permission assigned to each staff member
# These Staff permissions are only assigned and granted by the Admin
class StaffPermission(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    manage_donor_registrations = models.BooleanField(default=False)
    manage_eligibility_assessments = models.BooleanField(default=False)
    manage_donation_requests = models.BooleanField(default=False)
    perform_donor_clinic_matching = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'StaffPermission'
        verbose_name_plural = 'StaffPermission'

    def __str__(self):
        return f"Permissions for {self.user}"

# Records the eligibility policies made by the admin
# Displays created policies on eligibility requirements page
class EligibilityPolicy(models.Model):
    policy_name = models.CharField(max_length=100)
    policy_description = models.TextField()
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'EligibilityPolicy'
        verbose_name_plural = 'EligibilityPolicy'

    def __str__(self):
        return self.policy_name


    