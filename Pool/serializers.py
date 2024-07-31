from rest_framework import serializers
from Pool.models import Pool, PoolMember, PoolRequest
from authentication.models import CustomUser

class CustomUserLimitedSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['full_name', 'phone_number', 'gender']

class PoolMemberSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField(source='user.full_name')
    phone_number = serializers.ReadOnlyField(source='user.phone_number')
    gender = serializers.ReadOnlyField(source='user.gender')
    class Meta:
        model = PoolMember
        fields = ['full_name', 'phone_number', 'gender', 'is_creator', 'pool']

class PoolSerializer(serializers.ModelSerializer):
    created_by = CustomUserLimitedSerializer(read_only = True)
    members = PoolMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Pool
        fields = '__all__'

    def get_members (self, obj):
        members = PoolMember.objects.filter(self = obj)
        return PoolMemberSerializer(members, many=True).data

class PoolRequestSerializer(serializers.ModelSerializer):
    user = CustomUserLimitedSerializer(read_only=True)
    class Meta:
        model = PoolRequest
        fields = '__all__'