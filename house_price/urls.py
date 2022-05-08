from django.urls import path

from .views import HomeView

app_name = "house_price"
urlpatterns = [
    path("", HomeView.as_view(), name="home"),
]