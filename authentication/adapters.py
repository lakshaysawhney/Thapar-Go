from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.models import SocialLogin
# django-allauth - library for social logins
from rest_framework.exceptions import ValidationError
# social account module handles soical media accounts connected via OAuth
# google.views - django-allauth -> handles the integration between the app and Google's OAuth 2.0 provider
import logging

logger = logging.getLogger('google_oauth')

class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
    """
    Custom Adapter to validate email domain during Google OAuth login.
    """
    def populate_user(self, request, sociallogin: SocialLogin, data: dict):
        email = data.get('email', '')

        # Validate the email domain 
        if not email.endswith('@thapar.edu'):
            logger.error(f"Invalid email domain: {email}")
            raise ValidationError("Only thapar.edu email addresses are allowed.")

        # Validate the full name
        full_name = data.get('name')
        if not full_name:
            logger.error("Full name is missing from Google profile.")
            raise ValidationError("Full name is required for this application.")

        # Proceed with the standard user population process
        logger.info(f"Successfully validated user {email} with name {full_name}. Proceeding with population.")
        return super().populate_user(request, sociallogin, data)