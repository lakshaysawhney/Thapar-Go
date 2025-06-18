from rest_framework.views import APIView 
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework import status  
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from authentication.permissions import IsGoogleAuthenticated
from authentication.models import CustomUser 
from authentication.serializers import CustomUserSerializer 
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_framework.authentication import SessionAuthentication
from datetime import timedelta
from rest_framework_simplejwt.exceptions import TokenError

# dj_rest_auth -> extension of DRF - provides out of box authentication solns. like Social Login
import logging
logger = logging.getLogger('google_oauth')

# Customised Google OAuth Login handling thapar.edu users only logic

@api_view(["GET"])
def lakshay_test_view(request):
    return Response({"message": "working"})

class GoogleLoginView(SocialLoginView):
    """
    Custom Google OAuth Login view with thapar.edu domain validation.
    """
    authentication_classes = [SessionAuthentication]
    adapter_class = GoogleOAuth2Adapter
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print("DEBUG: GoogleLoginView post method called")
        logger.debug("Starting Google OAuth login process.")
        logger.debug(f"Redirect URI being sent: {self.request.build_absolute_uri()}")

        response = super().post(request, *args, **kwargs)
        logger.info(f"Google OAuth login successful for user: {request.user.email}")

        try:
            social_user = SocialAccount.objects.filter(user=request.user).first()
            if not social_user:
                logger.error("Social account not found during login.")
                return Response(
                    {"error": "Social account not found. Login failed."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            email_domain = social_user.user.email.split('@')[-1]
            if email_domain != "thapar.edu":
                logger.warning(f"Non-thapar.edu email detected: {social_user.user.email}")
                request.user.delete()
                return Response(
                    {"error": "Only thapar.edu emails are allowed."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            
            # setting google_authenticated boolean field to true
            user = CustomUser.objects.get(id=request.user.id)
            user.google_authenticated = True
            user.save()

            logger.info(f"User {social_user.user.email} successfully logged in.")

            # Check if user profile is complete
            if user.phone_number and user.gender:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Login successful.",
                    "email": user.email,
                    "name": user.full_name,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                }, status=status.HTTP_200_OK)

            # Else: profile incomplete → send temporary token
            temp_token = AccessToken.for_user(user)
            temp_token.set_exp(lifetime=timedelta(minutes=5))

            return Response({
                "message": "Google login successful. Please complete your profile.",
                "email": user.email,
                "name": user.full_name,
                "temp_token": str(temp_token)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"Unexpected error during login: {str(e)}")
            return Response(
                {"error": f"{str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# View for adding additional user information (phone_number, gender)
class UserAdditionalInfoView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsGoogleAuthenticated]

    def put(self, request):
        user = request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
    
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "User profile updated successfully.",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CurrentUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllUsersView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({"error": "Refresh token missing."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)  # <-- changed to 200

        except TokenError:
            return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)