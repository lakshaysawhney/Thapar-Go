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

class PoolMember(models.Model):
    pool = models.ForeignKey(Pool, related_name='members', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name='pools', on_delete=models.CASCADE)
    is_creator = models.BooleanField(default=False)

    def __str__(self):
        return self.user.full_name

class PoolRequest(models.Model):
    pool = models.ForeignKey(Pool, related_name='requests', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name='requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')