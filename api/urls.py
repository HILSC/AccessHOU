from django.urls import path

from api.views.user import UserAuthView
from api.views.user import UserListView
from api.views.user import UserView
from api.views.user import UserProfileView

from api.views.agency import AgencyView
from api.views.agency import AgencyListView

from api.views.agency import AgencyQueueView
from api.views.agency import AgencyQueueListView
from api.views.agency import AgencyQueueDeleteView

from api.views.program import ProgramView
from api.views.program import ProgramListView

from api.views.program import ProgramQueueView
from api.views.program import ProgramQueueListView
from api.views.program import ProgramQueueDeleteView

from api.views.index import SearchAppView
from api.views.index import EmergencyModeView

from api.views.queue import QueueListView
from api.views.queue import QueueAgencyView
from api.views.queue import QueueProgramView

from api.views.app_settings import AppSettingsView


urlpatterns = [
    path('auth/', UserAuthView.as_view()),

    path('app/settings/', AppSettingsView.as_view()),
    path('app/emergency/', EmergencyModeView.as_view()),

    path('agency/', AgencyView.as_view()),
    path('agency/<str:property_name>/<str:property_value>/', AgencyView.as_view()),
    path('agency/<int:id>', AgencyView.as_view()),
    path('agencies/<str:property_name>/<str:property_value>/<int:page>', AgencyListView.as_view()),
    
    path('agency/queue/', AgencyQueueView.as_view()),
    path('agency/queue/delete', AgencyQueueDeleteView.as_view()),
    path('agencies/queue/', AgencyQueueListView.as_view()),

    path('program/', ProgramView.as_view()),
    path('program/<str:property_name>/<str:property_value>/', ProgramView.as_view()),
    path('programs/<str:property_name>/<str:property_value>/<int:page>', ProgramListView.as_view()),
    path('program/<int:id>', ProgramView.as_view()),

    path('program/queue/', ProgramQueueView.as_view()),
    path('program/queue/delete', ProgramQueueDeleteView.as_view()),
    path('programs/queue/', ProgramQueueListView.as_view()),

    path('search/', SearchAppView.as_view()),

    path('users/', UserListView.as_view()),
    path('user/', UserView.as_view()),

    path('queue/', QueueListView.as_view()),

    path('queue/agency/<int:id>', QueueAgencyView.as_view()),
    path('queue/program/<int:id>', QueueProgramView.as_view()),

    path('queue/agency/', QueueAgencyView.as_view()),
    path('queue/program/', QueueProgramView.as_view()),

    path('user/profile/', UserProfileView.as_view()),

]
