from django.db import models
from django.contrib.auth.models import User


class Base(models.Model):
  """
  A base class that add useful created_at and updated_at fields 
  to models inheriting from it
  """
  created_at = models.DateTimeField(
    auto_now_add=True,
    editable=False,
    blank=True,
  )

  updated_at = models.DateTimeField(
    auto_now_add=True,
    editable=False,
    blank=True,
  )

  class Meta:
    abstract = True
