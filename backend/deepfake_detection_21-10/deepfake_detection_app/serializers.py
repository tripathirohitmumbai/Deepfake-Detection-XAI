from rest_framework import serializers
from django.contrib.auth.models import User
from .models import History_DB

#Registration Serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password',
                  'first_name', 'last_name', 'email', 'is_staff']

    def validate_email(self, value):
        """
        Check if the email address is unique.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email address is already in use.')
        return value

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])

        if 'is_staff' in validated_data:
            user.is_staff = validated_data['is_staff']

        user.save()
        return user


class HistoryDBSerializers(serializers.ModelSerializer):
    class Meta:
        model=History_DB
        feilds='__all__'
