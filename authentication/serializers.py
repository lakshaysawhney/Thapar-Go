from rest_framework import serializers
from authentication.models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):    
    class Meta:
        model = CustomUser
        fields = ['email', 'full_name', 'phone_number', 'gender']
        
    def validate(self, data):
        # Validating Phone number
        if data.get('phone_number'):
            if len(data['phone_number']) != 10 or not data['phone_number'].isdigit():
                raise serializers.ValidationError("Invalid phone number")
        # Validate gender choices if provided
        if data.get('gender') and data['gender'] not in [choice[0] for choice in CustomUser.GENDER_CHOICES]:
            raise serializers.ValidationError(f"Invalid gender choice. Valid options are: {[choice[0] for choice in CustomUser.GENDER_CHOICES]}")
        return data

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    # Above is equivalent to:-
    # def update(self, instance, validated_data):
    #     instance.full_name = validated_data.get('full_name', instance.full_name)
    #     instance.email = validated_data.get('email', instance.email)
    #     instance.phone_number = validated_data.get('phone_number', instance.phone_number)
    #     instance.is_active = validated_data.get('is_active', instance.is_active)
    #     instance.is_staff = validated_data.get('is_staff', instance.is_staff)
    #     instance.save()
    #     return instance
