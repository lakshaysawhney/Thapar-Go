from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend   
from rest_framework import filters
from .models import Pool, PoolMember, PoolRequest
from .serializers import PoolSerializer, PoolRequestSerializer
import logging

logger = logging.getLogger(__name__)

class PoolViewSet(viewsets.ModelViewSet):
    queryset = Pool.objects.all()
    serializer_class = PoolSerializer
    permission_classes = [IsAuthenticated]  
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['start_point', 'end_point', 'departure_time', 'arrival_time', 'fare_per_head']
    search_fields = ['start_point', 'end_point']
    ordering_fields = ['departure_time', 'arrival_time', 'fare_per_head']

    def perform_create(self, serializer):
        pool = serializer.save(created_by = self.request.user)
        PoolMember.objects.create(pool=pool, user=self.request.user, is_creator=True)

    def destroy(self, request, *args, **kwargs):
        return Response({'detail' : 'Delete operation is not allowed,'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
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
        
        # Creating the PoolMember instance
        PoolRequest.objects.create(pool=pool, user=request.user)
        return Response({'detail': 'Request to join pool sent successfully.'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def requests(self, request, pk=None):
        pool = self.get_object()
        requests = PoolRequest.objects.filter(pool = pool)
        serializer = PoolRequestSerializer(requests, many = True)
        return Response(serializer.data)

class PoolRequestViewSet(viewsets.ModelViewSet):
    queryset = PoolRequest.objects.all()
    serializer_class = PoolRequestSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def accept(self, request, pk=None):
        try:
            pool_request = self.get_object()
        except PoolRequest.DoesNotExist:
            logger.error(f'PoolRequest with pk {pk} does not exist.')
            return Response({'detail': f'PoolRequest with id {pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        
        if pool_request.pool.created_by != request.user:
            return Response({'detail': 'Only the pool creator can accept requests.'}, status=status.HTTP_403_FORBIDDEN)
        
        if pool_request.pool.current_persons >= pool_request.pool.total_persons:
            return Response({'detail': 'This pool is already full.'}, status=status.HTTP_400_BAD_REQUEST)
        
        pool_request.status = 'accepted'
        pool_request.save()

        # Add the user to the pool members
        PoolMember.objects.create(pool=pool_request.pool, user=pool_request.user)
    
        # Update the current number of persons in the pool
        pool_request.pool.current_persons += 1
        pool_request.pool.save()

        #Delete the pool request
        pool_request.delete()

        return Response({'detail': 'Request accepted.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        try:
            pool_request = self.get_object()
        except PoolRequest.DoesNotExist:
            logger.error(f'PoolRequest with pk {pk} does not exist.')
            return Response({'detail': f'PoolRequest with id {pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        
        if pool_request.pool.created_by != request.user:
            return Response({'detail': 'Only the pool creator can reject requests.'}, status=status.HTTP_403_FORBIDDEN)
        
        pool_request.status = 'rejected'
        pool_request.save()

        # Delete the pool request
        pool_request.delete()
        
        return Response({'detail': 'Request rejected.'}, status=status.HTTP_200_OK)

