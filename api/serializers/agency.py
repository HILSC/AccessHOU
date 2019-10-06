from rest_framework import serializers

from api.models.agency import Agency


class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = ['name', 'phone', 'website']
