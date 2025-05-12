from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        data = sociallogin.account.extra_data
        name = data.get("name")
        if name:
            user.full_name = name
            user.save()
        return user


# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from allauth.socialaccount.models import SocialLogin
# from rest_framework.exceptions import ValidationError
# import logging

# logger = logging.getLogger('google_oauth')

# class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
#     """
#     Custom Adapter to validate email domain during Google OAuth login.
#     """
#     print("✅ CustomGoogleOAuth2Adapter class loaded")
#     def save_user(self, request, sociallogin: SocialLogin, form=None):
#         """
#         This is called after populate_user — reliable for both token and code flows.
#         """
#         user = sociallogin.user
#         extra_data = sociallogin.account.extra_data

#         full_name = extra_data.get('name', '')
#         if not full_name:
#             logger.warning("Google OAuth returned no name")
#         else:
#             user.full_name = full_name

#         user.google_authenticated = True
#         user.save()

#         logger.info(f"Saved user: {user.email} with name: {user.full_name}")
#         return user


    # def populate_user(self, request, sociallogin: SocialLogin, data: dict):
    #     print("DEBUG raw Google data:", data)
    #     email = data.get('email', '')
    #     full_name = data.get('name', '')

    #     # Validate email domain
    #     if not email.endswith('@thapar.edu'):
    #         logger.error(f"Invalid email domain: {email}")
    #         raise ValidationError("Only thapar.edu email addresses are allowed.")

    #     # Validate name
    #     if not full_name:
    #         logger.error("Full name is missing from Google profile.")
    #         raise ValidationError("Full name is required for this application.")

    #     # Calling the default method first
    #     user = super().populate_user(request, sociallogin, data)

    #     # Assigning full name into the custom field
    #     user.full_name = full_name
    #     user.save()

    #     logger.info(f"Successfully populated user {email} with full_name = {full_name}")
    #     return user
