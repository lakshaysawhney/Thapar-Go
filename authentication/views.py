from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework import status  
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken 
from authentication.models import CustomUser 
from authentication.serializers import CustomUserSerializer 
from authentication.adapters import CustomGoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
# dj_rest_auth -> extension of DRF - provides out of box authentication solns. like Social Login
import logging
logger = logging.getLogger('google_oauth')

# Customised Google OAuth Login handling thapar.edu users only logic

class GoogleLoginView(SocialLoginView):
    """
    Custom Google OAuth Login view with thapar.edu domain validation.
    """
    adapter_class = CustomGoogleOAuth2Adapter

    def post(self, request, *args, **kwargs):
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

            logger.info(f"User {social_user.user.email} successfully logged in.")
        except Exception as e:
            logger.exception(f"Unexpected error during login: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return response

        
# View for adding additional user information (phone_number, gender)
class UserAdditionalInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User information updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AllUsersView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            token = RefreshToken(refresh_token)
            token.blacklist() #invalidates the previous token while logging out
            return Response({"message": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token or token is missing."}, status=status.HTTP_400_BAD_REQUEST)