from rest_framework.permissions import BasePermission

class IsGoogleAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return request.user and getattr(request.user, 'google_authenticated', False)
