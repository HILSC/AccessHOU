from django.urls import path

from api.views.user import UserAuthView

from api.views.agency import AgencyView
from api.views.agency import AgencyListView

from api.views.agency import AgencyQueueView
from api.views.agency import AgencyQueueListView

from api.views.program import ProgramView
from api.views.program import ProgramListView
from api.views.program import ProgramQueueView

from api.views.index import LanguagesView

urlpatterns = [
    path('auth/', UserAuthView.as_view()),

    path('agency/', AgencyView.as_view()),
    path('agency/<str:property_name>/<str:property_value>/', AgencyView.as_view()),
    path('agencies/<str:property_name>/<str:property_value>/', AgencyListView.as_view()),

    path('agency/queue/', AgencyQueueView.as_view()),
    path('agencies/queue/', AgencyQueueListView.as_view()),

    path('program/', ProgramView.as_view()),
    path('program/<str:property_name>/<str:property_value>/', ProgramView.as_view()),
    path('programs/<str:property_name>/<str:property_value>/', ProgramListView.as_view()),

    path('program/queue/', ProgramQueueView.as_view()),
    
    path('languages/', LanguagesView.as_view()),
]
