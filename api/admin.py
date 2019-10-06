from django.contrib import admin
from api.models.language import Language
from api.models.user import UserProfile

admin.site.register(Language)
admin.site.register(UserProfile)
