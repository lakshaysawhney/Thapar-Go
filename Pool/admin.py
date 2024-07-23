from django.contrib import admin
from .models import Pool, PoolMember, PoolRequest

admin.site.register(Pool)
admin.site.register(PoolMember)
admin.site.register(PoolRequest)
