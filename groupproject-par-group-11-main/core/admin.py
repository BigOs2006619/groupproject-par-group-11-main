from django.contrib import admin
from .models import EligibilityPolicy, StaffPermission

# Admin registration
admin.site.register(StaffPermission)

@admin.register(EligibilityPolicy)
class EligibilityPolicyAdmin(admin.ModelAdmin):
    readonly_fields = ('updated_at', 'updated_by')
