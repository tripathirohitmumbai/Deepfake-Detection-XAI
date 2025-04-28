from django.urls import path
from . import views

urlpatterns = [
    path('user_register', views.UserRegistrationView.as_view(),name="register"),
    path('user_login', views.LoginView.as_view(), name="login"),
    path('user_logout', views.LogoutView.as_view(), name="logout"),
    path('password/reset/', views.PasswordResetAPI.as_view(), name='api_password_reset'),  # send the reset passwpr link
    path('password/change/', views.PasswordChangeAPI.as_view(), name='password_reset_confirm'),
    # path('image_predict', views.ImageDetectionAPIView.as_view(), name='image_predict'),
    # path('video_predict', views.VideoDetectionAPIView.as_view(), name='video_predict'),
    path('predict_result', views.DetectionAPIView.as_view(), name='predict_result'),
    path('user_history', views.UserHistoryAPIView.as_view(), name='user_history'),
]
