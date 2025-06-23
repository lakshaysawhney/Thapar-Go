import logging

logger = logging.getLogger("django")

class LogRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Only log if an exception occurs
        try:
            response = self.get_response(request)
            return response
        except Exception as e:
            logger.error(
                f"Exception caught on request:\n"
                f"Path: {request.path}\n"
                f"Method: {request.method}\n"
                f"Headers: {dict(request.headers)}\n"
                f"Body: {request.body.decode('utf-8', errors='ignore')}\n"
                f"Exception: {str(e)}"
            )
            raise
