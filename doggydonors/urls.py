from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    
    # Dog donor (stub)
    path('register/dog-donor/', views.register_dog_donor, name='register_dog_donor'),
    path('donation/eligibility/', views.donation_eligibility, name='donation_eligibility'),
    path('assessment/eligibility/', views.donor_eligibility_assessment, name='donor_eligibility_assessment'),
    path('matching/donor-clinic/', views.donor_clinic_matching, name='donor_clinic_matching'),
    path('donation/request/', views.blood_donation_request, name='blood_donation_request'),
    path('donation/record/', views.record_blood_donation, name='record_blood_donation'),
    path('eligibility-policy/', views.eligibility_policy, name='eligibility_policy'),
    
    # Landing page
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),

    # Authentication
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # Dog owner
    path('register/dog-owner/', views.register_dog_owner, name='register_dog_owner'),
    path('dashboard/owner/', views.owner_dashboard, name='owner_dashboard'),
    path('profile/', views.owner_profile, name='owner_profile'),
    path('donation-history/', views.donation_history, name='donation_history'),

    # Vet clinic
    path('dashboard/clinic/', views.clinic_dashboard, name='clinic_dashboard'),

    # Staff
    path('dashboard/staff/', views.staff_dashboard, name='staff_dashboard'),

    # Admin
    path('dashboard/admin/', views.admin_dashboard, name='admin_dashboard'),

    # Notifications
    path('notifications/', views.notifications, name='notifications'),

    # Contact
    path('contact/', views.contact_us, name='contact_us'),

    # Staff permissions (admin only)
    path('assign-staff-permissions/', views.assign_staff_permissions, name='assign_staff_permissions'),
    path('assign-staff-permissions/<int:permission_id>/', views.assign_staff_permissions, name='edit_staff_permission'),
    path('assign-staff-permissions/<int:permission_id>/delete/', views.delete_staff_permission, name='delete_staff_permission'),

    # Eligibility policy (admin only)
    path('manage-eligibility-policy/', views.manage_eligibility_policy, name='manage_eligibility_policy'),
    path('manage-eligibility-policy/<int:policy_id>/', views.manage_eligibility_policy, name='edit_eligibility_policy'),
    path('manage-eligibility-policy/<int:policy_id>/delete/', views.delete_eligibility_policy, name='delete_eligibility_policy'),

    # Public eligibility requirements
    path('eligibility-requirements/', views.eligibility_requirements, name='eligibility_requirements'),
]
# Dog donor (stub)
