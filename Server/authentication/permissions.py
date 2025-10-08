from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied

class IsGoogleAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return request.user and getattr(request.user, 'google_authenticated', False)

class IsProfileComplete(BasePermission):
    message = "Please complete your profile before creating or joining pools."

    def has_permission(self, request, view):
        u = request.user
        if not (u and u.is_authenticated and u.phone_number and u.gender):
            raise PermissionDenied(self.message)
        return True