from django.contrib import admin
from api.models.user import Profile
from api.models.user import Role

from api.models.agency import Agency
from api.models.agency import AgencyQueue

from api.models.program import Program
from api.models.program import ProgramQueue

from api.models.action_log import ActionLog

from api.models.zip_code import ZipCodeData

from api.models.advocacy_report import AdvocacyReport

from api.models.app_settings import AppSettings


admin.site.register(Agency)
admin.site.register(AgencyQueue)

admin.site.register(Program)
admin.site.register(ProgramQueue)

admin.site.register(Profile)
admin.site.register(Role)

admin.site.register(ActionLog)
admin.site.register(ZipCodeData)

admin.site.register(AdvocacyReport)

admin.site.register(AppSettings)
