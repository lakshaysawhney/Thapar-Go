from rest_framework import serializers
from Pool.models import Pool, PoolMember, PoolRequest
from authentication.serializers import CustomUserSerializer

class PoolSerializer(serializers.ModelSerializer):
    created_by = CustomUserSerializer(read_only = True)
    members = serializers.StringRelatedField(many = True)
    class Meta:
        model = Pool
        fields = '__all__'

class PoolMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PoolMember
        fields = '__all__'

class PoolRequestSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    class Meta:
        model = PoolRequest
        fields = '__all__'