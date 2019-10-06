from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.views import status
from rest_framework.response import Response

import logging

logger = logging.getLogger(__name__)

class UserAuthView(APIView):
  permission_classes = (permissions.AllowAny,)

  def post(self, request, *args, **kwargs):
    """
    Authenticate user
    """
    try:
      email = request.data.get("email", None)
      password = request.data.get("password", None)
      if not email or not password:
        return JsonResponse(
          {
            'error': "Email and password are required.",
          }
        )

      user_obj = User.objects.get(email=email)
      user = authenticate(request, username=user_obj.username, password=password)
      if user:
        jwt_tokens = RefreshToken.for_user(user)
        refresh_token = str(jwt_tokens)
        access_token = str(jwt_tokens.access_token)
        return JsonResponse(
          {
            'email': user.email,
            'access_token': access_token,
            'refresh_token': refresh_token
          }
        )
      return Response({
        'message': 'Invalid credentials.'
      }, status=status.HTTP_401_UNAUTHORIZED)
    except ObjectDoesNotExist:
      logger.error('User with {} does not exist.'.format(email))
      return JsonResponse(
          {
            'error': "Invalid credentials.",
          },
          status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
