from rest_framework import serializers
from Pool.models import Pool, PoolMember, PoolRequest
from authentication.models import CustomUser
from authentication.serializers import CustomUserSerializer

class CustomUserLimitedSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['full_name', 'phone_number', 'gender']

class PoolMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PoolMember
        fields = '__all__'

class PoolSerializer(serializers.ModelSerializer):
    created_by = CustomUserLimitedSerializer(read_only = True)
    members = PoolMemberSerializer(many=True, read_only=True)
    class Meta:
        model = Pool
        fields = '__all__'

class PoolRequestSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    class Meta:
        model = PoolRequest
        fields = '__all__'