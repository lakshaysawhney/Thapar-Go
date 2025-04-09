from django.db import models
from authentication.models import CustomUser

class Pool(models.Model):
    start_point = models.CharField(max_length=255, default = "Thapar University")
    end_point = models.CharField(max_length=255)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    transport_mode = models.CharField(max_length=50)
    total_persons = models.IntegerField()
    current_persons = models.IntegerField(default=1)
    fare_per_head = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_by = models.ForeignKey(CustomUser, related_name='created_pools', on_delete=models.CASCADE)
    description = models.CharField(max_length = 400, null = True, blank = True)
    is_female_only = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.start_point} to {self.end_point} by {self.created_by.full_name}"

class PoolMember(models.Model):
    pool = models.ForeignKey(Pool, related_name='members', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name='pools', on_delete=models.CASCADE)
    is_creator = models.BooleanField(default=False)

    def __str__(self):
        return self.user.full_name

