from django.urls import path

from .views import HomeView, HousePricePredict

app_name = "house_price"
urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("house-price-predict/", HousePricePredict.as_view(), name="house-price-predict"),
]