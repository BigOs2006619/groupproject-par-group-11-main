from django.test import TestCase
from .models import User, DogDonor

# Create your tests here.

class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email= 'testowner@email.com',
            password='Test1234!',
            first_name= 'John',
            last_name='Doe',
            role='dog_owner',
        )

    def test_user_fields(self):
        self.assertEqual(self.user.email, 'testowner@email.com')
        self.assertEqual(self.user.first_name, 'John')
        self.assertEqual(self.user.last_name, 'Doe')
        self.assertEqual(self.user.role, 'dog_owner')

    def test_user_email_is_unique(self):
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                email='testowner@email.com',
                password='Test1234!',
                role='dog_owner',
            )

class DogDonorModelTest(TestCase):

    def setUp(self):
        self.owner = User.objects.create_user(
            email='dogowner@test.com',
            password='Test1234!',
            first_name='Jane',
            last_name='Doe',
            role='dog_owner'
        )
        self.dog = DogDonor.objects.create(
            owner=self.owner,
            dog_name='Buddy',
            breed='Labrador',
            age=3,
            weight=25.0,
            gender='Male',
            blood_type='DEA 1.1+',
            vaccination_status=True,
            health_declaration=True,
            eligibility_status='Pending'
        )

    def test_dog_donor_fields(self):
        self.assertEqual(self.dog.dog_name, 'Buddy')
        self.assertEqual(self.dog.breed, 'Labrador')
        self.assertEqual(self.dog.eligibility_status, 'Pending')

    def test_dog_donor_relationship(self):
        self.assertEqual(self.dog.owner, self.owner)
        dogs = DogDonor.objects.filter(owner=self.owner)
        self.assertEqual(dogs.count(), 1)
        self.assertEqual(dogs.first().dog_name, 'Buddy')