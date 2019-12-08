from django.conf import settings

from enum import Enum

import googlemaps
import random
import string
import logging

logger = logging.getLogger(__name__)


class UserActions(Enum):
  ADD = 'new'
  DELETE = 'delete'
  UPDATE = 'edited'


def randomStringGenerator():
  digits = "".join([random.choice(string.digits) for i in range(8)])
  chars = "".join([random.choice(string.ascii_letters) for i in range(15)])
  return "{}{}".format(chars, digits)

def getMapURL(address_model):
  address = address_model.street
  if address_model.street and address_model.city and address_model.state and address_model.zip_code:
    address = '{},{},{} {}'.format(address_model.street, address_model.city, address_model.state, address_model.zip_code)
    return 'https://www.google.com/maps/embed/v1/place?key={}&q={}&zoom=11'.format(settings.GEOLOCATOR_API_KEY, address)

  return None

def isProgramAccessibilityCompleted(program=None, **extra_fields):
  agency = program.agency
  if agency and program:
    if program.languages is None:
      return False

    if program.immigration_statuses is None:
      return False

    if agency.accepted_ids_current is None:
      return False

    if agency.accepted_ids_expired is None:
      return False

    if agency.proof_of_address is None:
      return False

    if program.service_same_day_intake is None:
      return False

    if agency.website_languages is None:
      return False

    if agency.interpretations_available is None :
      return False

    if program.schedule is None:
      return False

    if agency.assistance_with_forms is None:
      return False

    if agency.visual_aids is None:
      return False

    if program.client_consult is None:
      return False

    if agency.response_requests is None:
      return False

    if agency.cultural_training is None:
      return False

  return True

def getZipCodeRadiusRawSQL(model_name, latitude, longitude):
  # http://zips.sourceforge.net/
  return ("(degrees(acos(sin(radians(cast("+ latitude +" as double precision)))"
      "*sin(radians(cast("+model_name+".geocode ->> 'latitude' as double precision)))"
      "+cos(radians(cast("+ latitude +" as double precision)))"
      "*cos(radians(cast("+model_name+".geocode ->> 'latitude' as double precision)))"
      "*cos(radians(cast("+ longitude +" as double precision)"
      "-cast("+model_name+".geocode ->> 'longitude' as double precision)))))) * 69.09"
  )

def getGeocodingByAddress(street=None, city=None, state=None, zip_code=None):
  try:
    query = "{},{},{} {}".format(street,city,state,zip_code)
    gmaps = googlemaps.Client(key=settings.GEOLOCATOR_API_KEY)

    # Geocoding an address
    geocode_result = gmaps.geocode(query)

    if geocode_result:
      geometry = geocode_result[0].get('geometry')
      location = geometry.get('location')
      return {
        'latitude': location.get('lat', ''),
        'longitude': location.get('lng', ''),
      }
  except Exception as e:
    logger.error("Error getting geocoding: {}".format(str(e)))
    return None
