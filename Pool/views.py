from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend   
from rest_framework import filters
from .models import Pool, PoolMember, PoolRequest
from .serializers import PoolSerializer

class PoolViewSet(viewsets.ModelViewSet):
    queryset = Pool.objects.all()
    serializer_class = PoolSerializer
    permission_classes = [IsAuthenticated]  
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['start_point', 'end_point', 'departure_time', 'arrival_time', 'fare_per_head']
    search_fields = ['start_point', 'end_point']
    ordering_fields = ['departure_time', 'arrival_time', 'fare_per_head']

    def perform_create(self, serializer):
        serializer.save(created_by = self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        return Response({'detail' : 'Delete operation is not allowed,'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        pool = self.get_object()
        if PoolMember.objects.filter(pool = pool, user = request.user).exists():
            return Response({'detail': 'Already a member of this pool.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extracting gender and phone number from the request data
        gender = request.data.get('gender')
        phone_number = request.data.get('phone_number')

        # Validating the gender field
        if gender not in dict(PoolMember.GENDER_CHOICES).keys():
            return Response({'detail': 'Invalid gender choice.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Creating the PoolMember instance
        PoolMember.objects.create(pool=pool, user=request.user, name=request.user.full_name, gender=gender, phone_number=phone_number)
        return Response({'detail': 'Joined the pool successfully.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def accept_request(self, request, pk=None):
        pool_request = PoolRequest.objects.get(pk=pk)
        if pool_request.pool.created_by != request.user:
            return Response({'detail': 'Only the pool creator can accept requests.'}, status=status.HTTP_403_FORBIDDEN)
        pool_request.status = 'accepted'
        pool_request.save()
        return Response({'detail': 'Request accepted.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def reject_request(self, request, pk=None):
        pool_request = PoolRequest.objects.get(pk=pk)
        if pool_request.pool.created_by != request.user:
            return Response({'detail': 'Only the pool creator can reject requests.'}, status=status.HTTP_403_FORBIDDEN)
        pool_request.status = 'rejected'
        pool_request.save()
        return Response({'detail': 'Request rejected.'}, status=status.HTTP_200_OK)
        