import logging

logger = logging.getLogger("django") 

class LogRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            logger.info(f"Request: {request.method} {request.get_full_path()} | IP: {get_client_ip(request)}")
        except Exception as e:
            logger.error(f"Request logging failed: {e}")
        return self.get_response(request)

def get_client_ip(request):
    # Handles cases behind proxy/load balancer
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")
