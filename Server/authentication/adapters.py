from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.models import SocialLogin
from rest_framework.exceptions import ValidationError
import logging

logger = logging.getLogger('google_oauth')

class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
    """
    Custom Adapter to validate email domain during Google OAuth login.
    """
    def populate_user(self, request, sociallogin: SocialLogin, data: dict):
        email = data.get('email', '')
        full_name = data.get('name', '')

        # Validate email domain
        if not email.endswith('@thapar.edu'):
            logger.error(f"Invalid email domain: {email}")
            raise ValidationError("Only thapar.edu email addresses are allowed.")

        # Validate name
        if not full_name:
            logger.error("Full name is missing from Google profile.")
            raise ValidationError("Full name is required for this application.")

        # Calling the default method first
        user = super().populate_user(request, sociallogin, data)

        # Assigning full name into the custom field
        user.full_name = full_name

        logger.info(f"Successfully populated user {email} with full_name = {full_name}")
        return user
