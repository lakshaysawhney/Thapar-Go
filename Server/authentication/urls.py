from django.urls import path
from authentication.views import GoogleLoginView, UserAdditionalInfoView, AllUsersView, LogoutView
from rest_framework_simplejwt import views as jwt_views

app_name = 'authentication' # Adding namespace for frontend integration ease

urlpatterns = [
    # Google OAuth login
    path('google/', GoogleLoginView.as_view(), name='google_login'),

    # Additional info
    path('user/register-info/', UserAdditionalInfoView.as_view(), name='register_info'),

    # JWT-based endpoints
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', AllUsersView.as_view(), name='all_users'),
    path('logout/', LogoutView.as_view(), name='logout'),
]           