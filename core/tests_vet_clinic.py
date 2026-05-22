"""
Automated tests for Vet Clinic Registration.

Note: View tests avoid assertTemplateUsed due to a known incompatibility
between Python 3.14 and Django 4.2 (context copy bug). All logic is still
fully tested via status codes and database record checks.
"""

from django.test import TestCase, Client
from django.urls import reverse
from core.models import User, VeterinaryClinic
from core.forms_clinic import VetClinicRegistrationForm


# ─────────────────────────────────────────────────────────────────────────────
# MODEL TESTS
# ─────────────────────────────────────────────────────────────────────────────

class VeterinaryClinicModelTest(TestCase):
    """2 model tests: 1 fields test, 1 relationship test."""

    def setUp(self):
        self.user = User.objects.create_user(
            email='clinic@test.com',
            password='Secure@1234',
            role='vet_clinic',
            first_name='Happy Paws Clinic',
        )
        self.clinic = VeterinaryClinic.objects.create(
            user=self.user,
            clinic_name='Happy Paws Clinic',
            clinic_contact_details='0298765432',
        )

    def test_clinic_fields_stored_correctly(self):
        """
        Model Test 1 (fields): VeterinaryClinic stores clinic_name
        and clinic_contact_details correctly in the database.
        """
        clinic = VeterinaryClinic.objects.get(pk=self.clinic.pk)
        self.assertEqual(clinic.clinic_name, 'Happy Paws Clinic')
        self.assertEqual(clinic.clinic_contact_details, '0298765432')

    def test_clinic_user_relationship(self):
        """
        Model Test 2 (relationship): VeterinaryClinic links back to the
        correct User and the User role is set to vet_clinic.
        """
        clinic = VeterinaryClinic.objects.get(pk=self.clinic.pk)
        self.assertEqual(clinic.user, self.user)
        self.assertEqual(clinic.user.role, 'vet_clinic')
        self.assertEqual(self.user.veterinaryclinic, clinic)


# ─────────────────────────────────────────────────────────────────────────────
# VIEW TESTS
# ─────────────────────────────────────────────────────────────────────────────

class VetClinicRegistrationViewTest(TestCase):
    """
    View tests covering response codes, HTTP methods, authentication,
    permissions, and view logic.
    """

    def setUp(self):
        self.client = Client()
        self.url = reverse('register_vet_clinic')
        self.valid_data = {
            'clinic_name': 'City Vets',
            'clinic_contact_details': '0298887766',
            'email': 'cityvets@example.com',
            'password1': 'Secure@1234',
            'password2': 'Secure@1234',
        }

    def test_get_returns_200(self):
        """
        View Test 1 (response code): GET /register/vet-clinic/ returns
        HTTP 200.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_valid_post_creates_user_clinic_and_redirects(self):
        """
        View Test 2 (valid POST): A valid POST creates a User and a
        VeterinaryClinic record and redirects to the clinic dashboard.
        """
        response = self.client.post(self.url, self.valid_data)
        self.assertEqual(response.status_code, 302)
        user = User.objects.get(email='cityvets@example.com')
        self.assertEqual(user.role, 'vet_clinic')
        clinic = VeterinaryClinic.objects.get(user=user)
        self.assertEqual(clinic.clinic_name, 'City Vets')

    def test_duplicate_email_does_not_create_second_user(self):
        """
        View Test 3 (duplicate email): Submitting with an email that
        already exists does not create a new User.
        """
        self.client.post(self.url, self.valid_data)
        self.client.logout()
        count_before = User.objects.count()
        self.client.post(self.url, self.valid_data)
        self.assertEqual(User.objects.count(), count_before)

    def test_authenticated_user_redirected_away(self):
        """
        View Test 4 (authentication): An already logged-in user visiting
        the registration page is redirected to their dashboard.
        """
        existing = User.objects.create_user(
            email='existing@test.com',
            password='Secure@1234',
            role='vet_clinic',
            first_name='Existing Clinic',
        )
        VeterinaryClinic.objects.create(
            user=existing,
            clinic_name='Existing Clinic',
            clinic_contact_details='0211112222',
        )
        self.client.force_login(existing)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 302)

    def test_invalid_post_missing_fields_does_not_create_user(self):
        """
        View Test 5 (invalid POST): A POST with all fields empty does
        not create any User records in the database.
        """
        self.client.post(self.url, {
            'clinic_name': '',
            'clinic_contact_details': '',
            'email': '',
            'password1': '',
            'password2': '',
        })
        self.assertEqual(User.objects.count(), 0)


# ─────────────────────────────────────────────────────────────────────────────
# FORM TESTS
# ─────────────────────────────────────────────────────────────────────────────

class VetClinicRegistrationFormTest(TestCase):
    """
    Form tests: 1 valid data test, multiple invalid data tests.
    """

    def _base_data(self, **overrides):
        data = {
            'clinic_name': 'Paws and Claws Vets',
            'clinic_contact_details': '0312345678',
            'email': 'pawsandclaws@example.com',
            'password1': 'Secure@1234',
            'password2': 'Secure@1234',
        }
        data.update(overrides)
        return data

    def test_valid_data_form_is_valid(self):
        """Form Test 1 (valid): All correct fields — form is valid."""
        form = VetClinicRegistrationForm(data=self._base_data())
        self.assertTrue(form.is_valid(), msg=form.errors)

    def test_duplicate_email_is_invalid(self):
        """
        Form Test 2 (invalid — duplicate email): Email already in the
        database causes a validation error on the email field.
        """
        User.objects.create_user(
            email='pawsandclaws@example.com',
            password='Secure@1234',
            role='vet_clinic',
        )
        form = VetClinicRegistrationForm(data=self._base_data())
        self.assertFalse(form.is_valid())
        self.assertIn('email', form.errors)

    def test_password_mismatch_is_invalid(self):
        """
        Form Test 3 (invalid — password mismatch): password1 and
        password2 not matching causes a validation error.
        """
        form = VetClinicRegistrationForm(data=self._base_data(
            password1='Secure@1234',
            password2='Different@9999',
        ))
        self.assertFalse(form.is_valid())
        self.assertIn('password2', form.errors)

    def test_weak_password_is_invalid(self):
        """
        Form Test 4 (invalid — weak password): A password that does
        not meet the strength rules fails validation.
        """
        form = VetClinicRegistrationForm(data=self._base_data(
            password1='password',
            password2='password',
        ))
        self.assertFalse(form.is_valid())
        self.assertIn('password1', form.errors)

    def test_invalid_contact_format_is_invalid(self):
        """
        Form Test 5 (invalid — bad contact): A string that is neither
        a valid Australian phone nor an email fails validation.
        """
        form = VetClinicRegistrationForm(data=self._base_data(
            clinic_contact_details='not-valid',
        ))
        self.assertFalse(form.is_valid())
        self.assertIn('clinic_contact_details', form.errors)

    def test_missing_clinic_name_is_invalid(self):
        """
        Form Test 6 (invalid — missing required field): Empty clinic
        name fails validation.
        """
        form = VetClinicRegistrationForm(data=self._base_data(clinic_name=''))
        self.assertFalse(form.is_valid())
        self.assertIn('clinic_name', form.errors)

    def test_email_as_contact_details_is_valid(self):
        """
        Form Test 7 (valid): clinic_contact_details can be an email
        address as well as a phone number.
        """
        form = VetClinicRegistrationForm(data=self._base_data(
            clinic_contact_details='info@happypaws.com.au',
        ))
        self.assertTrue(form.is_valid(), msg=form.errors)
        