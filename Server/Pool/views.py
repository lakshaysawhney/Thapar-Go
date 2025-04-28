from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend   
from rest_framework import filters
from .models import Pool, PoolMember
from .serializers import PoolSerializer
import logging

logger = logging.getLogger(__name__)

class PoolViewSet(viewsets.ModelViewSet):
    queryset = Pool.objects.all()
    serializer_class = PoolSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['start_point', 'end_point', 'is_female_only', 'departure_time', 'arrival_time', 'fare_per_head']
    search_fields = ['start_point', 'end_point']
    ordering_fields = ['departure_time', 'arrival_time', 'fare_per_head']

    def perform_create(self, serializer):
        if serializer.validated_data.get('is_female_only', False) and self.request.user.gender != 'Female':
            raise PermissionDenied("Only female users can create female-only pools.")

        pool = serializer.save(created_by=self.request.user)
        PoolMember.objects.create(pool=pool, user=self.request.user, is_creator=True)

    def update(self, request, *args, **kwargs):
        pool = self.get_object()
        if pool.created_by != request.user:
            raise PermissionDenied("You do not have permission to update this pool.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        pool = self.get_object()
        if pool.created_by != request.user:
            raise PermissionDenied("You do not have permission to update this pool.")
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return Response({'detail' : 'Delete operation is not allowed,'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def join(self, request, pk=None):
        pool = self.get_object()

        # Check if the requester is the creator of the pool 
        if pool.created_by == request.user:
            return Response({'detail': 'Creators cannot join their own pool.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Checking if already member of pool 
        if PoolMember.objects.filter(pool = pool, user = request.user).exists():
            return Response({'detail': 'Already a member of this pool.'}, status=status.HTTP_400_BAD_REQUEST)
        
        #Checking if pool has reached its capacity 
        if pool.current_persons >= pool.total_persons:
            return Response({'detail': 'This pool is already full.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the pool is female-only and the user is not female 
        if pool.is_female_only and request.user.gender != 'Female':
            return Response({'detail': 'Only female users can join this pool.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Add the user to the pool 
        PoolMember.objects.create(pool=pool, user=request.user)
        pool.current_persons += 1
        pool.save()

        return Response({'detail': 'Joined the pool successfully.'}, status=status.HTTP_200_OK)