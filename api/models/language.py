from django.db import models

from django.contrib import admin

from api.models.base import Base

class Language(Base):
  """
  Language
  """
  name = models.CharField(max_length=250, null=False)

  def __str__(self):
    return self.name

  class Meta:
    db_table = "api_languages"
    verbose_name = "Language"
    verbose_name_plural = "Languages"
    ordering = ['name']


class LanguageAdmin(admin.ModelAdmin):
  fields = ('name')

  def save_model(self, request, obj, form, change): 
        instance = form.save(commit=False)
        if not hasattr(instance,'created_by'):
            instance.created_by = request.user
        instance.edited_by = request.user
        instance.save()
        form.save_m2m()
        return instance
