# devotionals/views.py
from django.http import JsonResponse
from .models import *

def devotional_list(request):
    return JsonResponse({'devotionals': [], 'message': 'Devotionals endpoint ready'})