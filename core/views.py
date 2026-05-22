from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from functools import wraps
from .forms import DogOwnerRegistrationForm, EligibilityPolicyForm, StaffPermissionForm, DogOwnerProfileForm
from .forms_clinic import VetClinicRegistrationForm
from .models import EligibilityPolicy, StaffPermission, User, DogDonor, Notification, BloodDonation


# ─── Helpers ──────────────────────────────────────────────────────────────────

def get_dashboard_url(user):
    role_map = {
        'dog_owner': 'owner_dashboard',
        'vet_clinic': 'clinic_dashboard',
        'staff':      'staff_dashboard',
        'admin':      'admin_dashboard',
    }
    return role_map.get(user.role, 'home')


# ─── Home ─────────────────────────────────────────────────────────────────────

def home(request):
    if request.user.is_authenticated:
        return redirect(get_dashboard_url(request.user))
    return render(request, 'core/home.html')


def index(request):
    return render(request, 'core/index.html')


# ─── Authentication ───────────────────────────────────────────────────────────

def login_view(request):
    if request.user.is_authenticated:
        return redirect(get_dashboard_url(request.user))

    if request.method == 'POST':
        email    = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')

        if not email or not password:
            messages.error(request, 'Please enter both your email and password.')
            return render(request, 'core/login.html', {'email_value': email})

        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            next_url = request.GET.get('next', '')
            if next_url:
                return redirect(next_url)
            return redirect(get_dashboard_url(user))
        else:
            messages.error(request, 'Invalid email or password. Please try again.')
            return render(request, 'core/login.html', {'email_value': email})

    return render(request, 'core/login.html', {'email_value': ''})


def logout_view(request):
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('login')


# ─── Staff Permission Decorator ───────────────────────────────────────────────

def requires_staff_permission(permission_field):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect('/login/')
            try:
                perm = request.user.staffpermission
                if not getattr(perm, permission_field):
                    messages.error(request, 'You do not have permission to access this function.')
                    return redirect('/dashboard/')
            except StaffPermission.DoesNotExist:
                messages.error(request, 'You do not have permission to access this function.')
                return redirect('/dashboard/')
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


# ─── Staff Permissions (Stephen) ─────────────────────────────────────────────

def assign_staff_permissions(request, permission_id=None):
    if not request.user.is_authenticated:
        messages.error(request, 'You do not have access to this page. Please log in.')
        return redirect('/admin/login/')

    if request.user.role != 'admin':
        messages.error(request, 'You are not authorised to manage staff permissions.')
        return redirect('/dashboard/')

    permission = StaffPermission.objects.get(pk=permission_id) if permission_id else None

    if request.method == 'POST':
        user_id = request.POST.get('user')
        try:
            selected_user = User.objects.get(pk=user_id)
            obj, _ = StaffPermission.objects.get_or_create(user=selected_user)
            form = StaffPermissionForm(request.POST, instance=obj)
        except User.DoesNotExist:
            form = StaffPermissionForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Permissions saved successfully.')
            return redirect('/assign-staff-permissions/')
    else:
        form = StaffPermissionForm(instance=permission)

    permissions = StaffPermission.objects.select_related('user').all()
    return render(request, 'core/assign-staff-permissions.html', {'form': form, 'permission': permission, 'permissions': permissions})


def delete_staff_permission(request, permission_id):
    if not request.user.is_authenticated:
        messages.error(request, 'You do not have access to this page. Please log in.')
        return redirect('/admin/login/')

    if request.user.role != 'admin':
        messages.error(request, 'You are not authorised to delete staff permissions.')
        return redirect('/dashboard/')

    if request.method == 'POST':
        StaffPermission.objects.filter(pk=permission_id).delete()
        messages.success(request, 'Staff permissions deleted successfully.')

    return redirect('/assign-staff-permissions/')


# ─── Eligibility Policy (Stephen) ────────────────────────────────────────────

def manage_eligibility_policy(request, policy_id=None):
    if not request.user.is_authenticated:
        messages.error(request, 'You do not have access to this page. Please log in.')
        return redirect('/admin/login/')

    if request.user.role != 'admin':
        messages.error(request, 'You are not authorised to manage eligibility policies.')
        return redirect('/dashboard/')

    policy = EligibilityPolicy.objects.get(pk=policy_id) if policy_id else None

    if request.method == 'POST':
        form = EligibilityPolicyForm(request.POST, instance=policy)
        if form.is_valid():
            saved_policy = form.save(commit=False)
            saved_policy.updated_by = request.user
            saved_policy.save()
            messages.success(request, 'Policy saved successfully.')
            return redirect('/manage-eligibility-policy/')
    else:
        form = EligibilityPolicyForm(instance=policy)

    policies = EligibilityPolicy.objects.all().order_by('-updated_at')
    return render(request, 'core/manage_eligibility_policy.html', {'form': form, 'policy': policy, 'policies': policies})


def delete_eligibility_policy(request, policy_id):
    if not request.user.is_authenticated:
        messages.error(request, 'You do not have access to this page. Please log in.')
        return redirect('/admin/login/')

    if request.user.role != 'admin':
        messages.error(request, 'You are not authorised to delete eligibility policies.')
        return redirect('/dashboard/')

    if request.method == 'POST':
        policy = EligibilityPolicy.objects.get(pk=policy_id)
        policy.delete()
        messages.success(request, 'Policy deleted successfully.')

    return redirect('/manage-eligibility-policy/')


def eligibility_requirements(request):
    policies = EligibilityPolicy.objects.all().order_by('-updated_at')
    return render(request, 'core/eligibility_requirements.html', {'policies': policies})


# ─── Dog Owner Registration (Khalid) ─────────────────────────────────────────

def register_dog_owner(request):
    if request.user.is_authenticated:
        return redirect(get_dashboard_url(request.user))

    if request.method == 'POST':
        form = DogOwnerRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Account created successfully. Welcome!')
            return redirect('owner_dashboard')
    else:
        form = DogOwnerRegistrationForm()

    return render(request, 'core/register_dog_owner.html', {'form': form})


# ─── Role-Based Dashboards ────────────────────────────────────────────────────

@login_required
def owner_dashboard(request):
    if request.user.role != 'dog_owner':
        messages.error(request, 'You are not authorised to access this page.')
        return redirect('register_dog_owner')

    dogs = DogDonor.objects.filter(owner=request.user)
    notifications = Notification.objects.filter(user=request.user, read_status=False)

    return render(request, 'core/owner_dashboard.html', {
        'user': request.user,
        'dogs': dogs,
        'notifications': notifications,
    })


@login_required
def owner_profile(request):
    if request.user.role != 'dog_owner':
        messages.error(request, 'You are not authorised to view this page.')
        return redirect('owner_dashboard')

    if request.method == 'POST':
        form = DogOwnerProfileForm(request.POST, instance=request.user, user=request.user)
        if form.is_valid():
            user = form.save(commit=False)
            new_password = form.cleaned_data.get('new_password')
            if new_password:
                user.set_password(new_password)
            user.save()
            messages.success(request, 'Your profile has been updated successfully.')
            return redirect('owner_dashboard')
    else:
        form = DogOwnerProfileForm(instance=request.user, user=request.user)

    return render(request, 'core/owner_profile.html', {'form': form})

# ─── Vet Clinic Registration ──────────────────────────────────────────────────

def register_vet_clinic(request):
    if request.user.is_authenticated:
        return redirect(get_dashboard_url(request.user))

    if request.method == 'POST':
        form = VetClinicRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(
                request,
                f'Welcome, {user.first_name}! Your clinic account has been created.'
            )
            return redirect('clinic_dashboard')
    else:
        form = VetClinicRegistrationForm()

    return render(request, 'core/register_vet_clinic.html', {'form': form})


@login_required
def donation_history(request):
    if request.user.role != 'dog_owner':
        messages.error(request, 'You are not authorised to access this page!')
        return redirect('owner_dashboard')

    dogs = DogDonor.objects.filter(owner=request.user)
    dog_data = []
    for dog in dogs:
        donations = BloodDonation.objects.filter(dog=dog).order_by('-donation_date')
        dog_data.append({
            'dog': dog,
            'donations': donations,
        })

    return render(request, 'core/donation_history.html', {'dog_data': dog_data})


@login_required
def clinic_dashboard(request):
    if request.user.role != 'vet_clinic':
        return redirect(get_dashboard_url(request.user))
    return render(request, 'core/dashboard_clinic.html')


@login_required
def staff_dashboard(request):
    if request.user.role != 'staff':
        return redirect(get_dashboard_url(request.user))
    return render(request, 'core/dashboard_staff.html')


@login_required
def admin_dashboard(request):
    if request.user.role != 'admin':
        return redirect(get_dashboard_url(request.user))
    return render(request, 'core/dashboard_admin.html')



@login_required
def register_dog_donor(request):
    return render(request, 'core/register_dog_donor.html')

@login_required
def donation_eligibility(request):
    return render(request, 'core/donation_eligibility.html')

@login_required
def notifications(request):
    return render(request, 'core/notifications.html')

@login_required
def donor_eligibility_assessment(request):
    return render(request, 'core/donor_eligibility_assessment.html')

@login_required
def donor_clinic_matching(request):
    return render(request, 'core/donor_clinic_matching.html')

@login_required
def blood_donation_request(request):
    return render(request, 'core/blood_donation_request.html')

@login_required
def record_blood_donation(request):
    return render(request, 'core/record_blood_donation.html')

def eligibility_policy(request):
    return render(request, 'core/eligibility_policy.html')

def contact_us(request):
    return render(request, 'core/contact_us.html')

def register_vet_clinic(request): 
    if request.user.is_authenticated:
        return redirect(get_dashboard_url(request.user))

    if request.method == 'POST':
        form = VetClinicRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(
                request,
                f'Welcome, {user.first_name}! Your clinic account has been created.'
            )
            return redirect('clinic_dashboard')
    else:
        form = VetClinicRegistrationForm()

    return render(request, 'core/register_vet_clinic.html', {'form': form})