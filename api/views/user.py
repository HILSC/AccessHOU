import logging
import datetime
import json

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator
from django.db import transaction
from django.db import models
from django.http import JsonResponse

from rest_framework import permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.views import status
from rest_framework.response import Response

from api.models.user import Role
from api.models.user import Profile

from api.utils import randomStringGenerator

logger = logging.getLogger(__name__)


class UserAuthView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        try:
            email = request.data.get("email", None)
            password = request.data.get("password", None)
            if not email or not password:
                return JsonResponse(
                    {
                        "message": "Email and password are required."
                    }, status=500
                )

            user_obj = User.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=password)
            
            if user:
                user.last_login = datetime.datetime.now()
                user.save()

                jwt_tokens = RefreshToken.for_user(user)
                refresh_token = str(jwt_tokens)
                access_token = str(jwt_tokens.access_token)
                return JsonResponse(
                    {
                        "email": user.email,
                        "access_token": access_token,
                        "refresh_token": refresh_token,
                        "role": {
                            "id": user.profile.role.id,
                            "name": user.profile.role.name,
                            "approve_queue": user.profile.role.approve_queue,
                            "skip_queue": user.profile.role.skip_queue,
                            "advocacy_reports": user.profile.role.add_advocacy_reports,
                        }
                    }
                )
            return Response(
                {
                    "message": "Invalid credentials."
                }, status=status.HTTP_401_UNAUTHORIZED
            )
        except ObjectDoesNotExist:
            logger.error("User with {} does not exist.".format(email))
            return JsonResponse(
                {
                    "message": "Invalid credentials."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserView(APIView):
    @transaction.atomic
    def put(self, request):
        try:
            if request.user and request.user.profile.is_admin:
                action = request.data.get("action", None)
                user_id = request.data.get("id", None)
                user = User.objects.get(id=user_id)

                if action and action == "status":
                    user.is_active = not user.is_active
                    user.save()
                else:
                    email = request.data.get("email", None)

                    if email != user.email:
                        try:
                            user_with_email = User.objects.filter(email=email).exclude(id=user.id)
                            if user_with_email:
                                return JsonResponse({
                                    "error": True,
                                    "message": "The email {} is already in use.".format(email)
                                })
                        except User.DoesNotExist:
                            logger.info("Email is unique")

                    role_id = request.data.get("role_id", None)
                    role = user.profile.role
                    if role.id != role_id:
                        role = Role.objects.get(id=role_id)

                    first_name = request.data.get("first_name", None)
                    password = request.data.get("password", None)

                    user.email = email
                    user.first_name = first_name
                    user.last_name = request.data.get("last_name", first_name)

                    if password and len(password) >= 6:
                        user.set_password(password)
                    
                    user.profile.role = role
                    user.profile.agency = request.data.get("agency", None)
                    user.save()

                return JsonResponse({
                        "email": user.email,
                        "is_active": user.is_active,
                    },
                    safe=False,
                ) 

        except:
            logger.error("User couldn't be updated.")
            return JsonResponse(
                {
                    "message": "User cannot be updated."
                }, status=500
            )

    @transaction.atomic
    def post(self, request):
        try:
            if request.user and request.user.profile.is_admin:
                role = None
                role_id = request.data.get("role_id", None)
                if role_id:
                    role = Role.objects.get(id=role_id)

                first_name = request.data.get("first_name", None)

                # Validate if email is unique
                email = request.data.get("email", None)
                try:
                    user_with_email = User.objects.get(email=email)
                    if user_with_email:
                        return JsonResponse({
                            "error": True,
                            "message": "The email {} is already in use by another user.".format(email)
                        })
                except User.DoesNotExist:
                            logger.info("Emil is unique")
                
                user = User.objects.create_user(
                    email=request.data.get("email", None),
                    first_name=first_name,
                    last_name=request.data.get("last_name", first_name),
                    username=randomStringGenerator(),
                    password=request.data.get("password", None),
                )

                profile = Profile.objects.get(user_id=user.id)
                profile.agency = request.data.get("agency", None)
                profile.role = role
                profile.save()

                return JsonResponse({
                        "email": user.email,
                    },
                    safe=False,
                ) 
        except:
            logger.error("User couldn't be created.")
            return JsonResponse(
                {
                    "message": "User cannot be created."
                }, status=500
            )


class UserListView(APIView):
    def get(self, request):
        users = None
        try:
            if request.user and request.user.profile.is_admin:
                page = request.GET.get("page", 1)
                search = request.GET.get("search", None)
                
                if search:
                    user_filters = models.Q()
                    user_filters &= models.Q(email__icontains=search,)
                    user_filters |= models.Q(first_name__icontains=search,)
                    user_filters |= models.Q(last_name__icontains=search,)
                    users = User.objects.filter(user_filters).exclude(id__in=[1,2, request.user.id]).order_by("-is_active", "email")
                else:
                    users = User.objects.all().exclude(id__in=[1,2, request.user.id]).order_by("-is_active", "email")

                paginator = Paginator(users, 10)  # Show 10 users per page
                users = paginator.get_page(page)

                formatted_users = []
                roles_json = json.dumps([{'id': ob.id, 'name': ob.name} for ob in Role.objects.all()])
                if users.object_list:
                    for user in users.object_list:
                        last_login = None
                        if user.last_login:
                            last_login = user.last_login.strftime('%b/%d/%Y')

                        formatted_users.append(
                            {
                                "id": user.id,
                                "email": user.email,
                                "first_name": user.first_name,
                                "last_name": user.last_name,
                                "last_login": last_login,
                                "agency": user.profile.agency,
                                "is_active": user.is_active,
                                "role": {
                                    "id": user.profile.role.id,
                                    "name": user.profile.role.name
                                }
                                
                            }
                        )

                users_json = json.dumps([ob for ob in formatted_users])
                return JsonResponse(
                    {
                        "results": json.loads(users_json),
                        "total_records": paginator.count,
                        "total_pages": paginator.num_pages,
                        "page": users.number,
                        "has_next": users.has_next(),
                        "has_prev": users.has_previous(),
                        "roles": json.loads(roles_json),
                    },
                    safe=False,
                )
        except ObjectDoesNotExist:
            logger.error("User does not exists.")
            return JsonResponse(
                {
                    "message": "Error while trying to get the list of users.",
                }, status=500
            )


class UserProfileView(APIView):
    def get(self, request):
        try:
            if request.user:
                user_profile = Profile.objects.get(user=request.user)
                return JsonResponse(
                    {
                        "id": user_profile.user.id,
                        "email": user_profile.user.email,
                        "first_name": user_profile.user.first_name,
                        "last_name": user_profile.user.last_name,
                        "agency": user_profile.agency,
                        "role": user_profile.role.name,
                    },
                    safe=False,
                )  
        except Exception as e:
            logger.error("Error while getting user info by id")
            return JsonResponse(
                {
                    "message": "Error getting user info.",
                }, status=500
            )

    def put(self, request):
        try:
            if request.user:
                email = request.data.get("email", None)
                user_with_email = User.objects.filter(email=request.data.get("email")).exclude(id=request.user.id)
                if user_with_email:
                    return JsonResponse(
                    {
                        "error": True,
                        "message": "Email [{}] is already in use.".format(email),
                    }
                )

                user = request.user

                current_password =  request.data.get("old_password", None)
                new_password = request.data.get("password", None)
                current_password_valid = request.user.check_password(current_password)
                if new_password and current_password_valid:
                    user.set_password(new_password)
                
                user.email = email
                user.profile.agency = request.data.get("agency", None)
                user.first_name = request.data.get("first_name", None)
                user.last_name = request.data.get("last_name", None)
                user.save()

                return JsonResponse(
                    {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "agency": user.profile.agency,
                        "role": user.profile.role.name,
                    },
                    safe=False,
                )
        except Exception as e:
            return JsonResponse(
                {
                    "message": "Error while trying to update profile, Try again!",
                }, status=500
            )

