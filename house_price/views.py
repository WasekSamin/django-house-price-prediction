from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
import pickle
import numpy as np
# Create your views here.

class HomeView(View):
    def get(self, request):
        return render(request, "house_price/home.html")


class HousePricePredict(View):
    def post(self, request):
        house_area = request.POST.get("houseArea", None)
        total_rooms = request.POST.get("totalRooms", None)
        house_style = request.POST.get("houseStyle", None)
        total_bathrooms = request.POST.get("totalBathrooms", None)
        total_kitchens = request.POST.get("totalKitchens", None)
        total_fireplaces = request.POST.get("totalFireplaces", None)
        garage_area = request.POST.get("garageArea", None)
        car_capacity = request.POST.get("carCapacity", None)
        basement_area = request.POST.get("basementArea", None)
        pool_area = request.POST.get("poolArea", None)
        central_air = request.POST.get("centralAir", None)
        overall_qual = request.POST.get("overallQual", None)

        json_response = {}

        if house_area is not None or total_rooms is not None or house_style is not None or \
            total_bathrooms is not None or total_kitchens is not None or total_fireplaces is not None or \
            garage_area is not None or car_capacity is not None or basement_area is not None or \
            pool_area is not None or central_air is not None or overall_qual is not None:
            model = pickle.load(open(r"./house_price/house_prediction_model.pkl", "rb"))

            # For HouseStyle
            # 1Story = 2
            # 2Story = 5
            # 1.5Fin = 0
            # SLvl = 7
            # SFoyer = 6
            # 1.5Unf = 1
            # 2.5Unf = 4
            # 2.5Fin = 3

            if house_style.lower() == "1story":
                house_style = 2
            elif house_style.lower() == "2story":
                house_style = 5
            elif house_style.lower() == "1.5fin":
                house_style = 0
            elif house_style.lower() == "slvl":
                house_style = 7
            elif house_style.lower() == "sfoyer":
                house_style = 6
            elif house_style.lower() == "1.5unf":
                house_style = 1
            elif house_style.lower() == "2.5unf":
                house_style = 4
            elif house_style.lower() == "2.5fin":
                house_style = 3

            if central_air.lower() == "yes":
                central_air = 1
            else:
                central_air = 0

            # For CentralAir
            # Y = 1
            # N = 0

            # Data serial -> house_area, total_rooms, total_bathrooms, total_kitchens, total_fireplaces, 
            # garage_area, car_capacity, basement_area, pool_area, overall_qual, house_style, central_air
            dataset = [
                [
                    float(house_area), int(total_rooms), int(total_bathrooms), int(total_kitchens), int(total_fireplaces), float(garage_area),
                    int(car_capacity), float(basement_area), float(pool_area), int(overall_qual), int(house_style), int(central_air)
                ]
            ]
            # print(dataset)

            result = np.round(model.predict(dataset))   # -> Returns a list
            # print(result)
            json_response = {
                "success": True,
                "result": result[0]
            }
        else:
            json_response = {
                "failed": True,
            }

        return JsonResponse(json_response, safe=False)