from django.urls import path
from . import views

urlpatterns = [
    path('', views.devotional_list, name='devotional-list'),
]