from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from django.conf import settings
from django.core import serializers

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import status

from api.models.language import Language

import os
import logging

logger = logging.getLogger(__name__)

class FrontendAppView(View):
  """
  Serves the compiled frontend entry point (only works if you have run `yarn
  run build`).
  """
  def get(self, request):
    print (os.path.join(settings.REACT_APP_DIR, 'build', 'index.html'))
    try:
      with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
        return HttpResponse(f.read())
    except FileNotFoundError:
      logging.exception('Production build of app not found')
      return HttpResponse(
        """
        This URL is only used when you have built the production
        version of the app. Visit http://localhost:3000/ instead, or
        run `yarn run build` to test the production version.
        """,
        status=status.HTTP_501_NOT_IMPLEMENTED,
      )


class LanguagesView(APIView):
  permission_classes = (permissions.AllowAny,)

  def get(self, request, *args, **kwargs):
    """
    Get languages
    """
    try:
      languages = Language.objects.all().values('name')
      language_list = list(languages)
      
      return JsonResponse(language_list, safe=False)
    except:
      logger.error('Error getting the languages')
      return JsonResponse(
        {
          'error': "Error getting the languages",
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
      )

