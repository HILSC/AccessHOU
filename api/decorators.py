import logging

from django.core.exceptions import PermissionDenied
from django.conf import settings

logger = logging.getLogger(__name__)

def is_registered_api_consumer(function):
  def wrap(self, request, *args, **kwargs):
    # TODO: If we try to open the API, we need to create API keys to limit the access
    referer = request.META.get('HTTP_REFERER')
    return function(self, request, *args, **kwargs)

    # if referer.startswith(settings.ALLOWED_CLIENTS):
    #   return function(self, request, *args, **kwargs)
    # else:
    #   # TODO: Maybe send an email to see who is trying to access the API
    #   logger.warning("This referer {} is trying to access the API".format(referer))
    #   raise PermissionDenied

  wrap.__doc__ = function.__doc__
  wrap.__name__ = function.__name__
  return wrap
