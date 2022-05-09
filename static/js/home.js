const homeForm = document.getElementById("home__form");
const houseArea = document.getElementById("house_area");
const totalRooms = document.getElementById("total_rooms");
const houseStyle = document.getElementById("house_style");
const totalBathrooms = document.getElementById("total_bathrooms");
const totalKitchens = document.getElementById("total_kitchens");
const totalFireplaces = document.getElementById("total_fireplaces");
const garageArea = document.getElementById("garage_area");
const carCapacity = document.getElementById("car_capacity");
const basementArea = document.getElementById("basement_area");
const poolArea = document.getElementById("pool_area");
const centralAir = document.getElementById("central_air");
const overallQual = document.getElementById("overall_quality");
const errorMsgDiv = document.getElementById("error__msgDiv");
const predictedResult = document.getElementById("predicted__result");
const housePredictionResultModal = document.getElementById("house__predictionResultModal");
const closePredictionModal = document.getElementById("close__predictionModal");
const submitButton = document.getElementById("submit__button");
const buttonLoaderSpinner = document.getElementById("button__loader");

const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie != "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
};

homeForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    errorMsgDiv.classList.add("hidden");

    submitButton.disabled = true;
    submitButton.classList.remove("bg-indigo-500", "ripple__button");
    submitButton.classList.add("bg-slate-500");
    buttonLoaderSpinner.classList.remove("hidden");

    if (!houseArea.value || houseArea.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Area of the house field is empty!"
    } else if (!totalRooms.value || totalRooms.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Number of rooms field is empty!"
    } else if (!houseStyle.value || houseStyle.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Please select a house style!"
    } else if (!totalBathrooms.value || totalBathrooms.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Number of bathrooms field is empty!"
    } else if (!totalKitchens.value || totalKitchens.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Number of kitchens field is empty!"
    } else if (!totalFireplaces.value || totalFireplaces.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Number of fireplaces field is empty!"
    } else if (!garageArea.value || garageArea.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Area of the garage field is empty!"
    } else if (!carCapacity.value || carCapacity.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Car capacity in the garage field is empty!"
    } else if (!basementArea.value || basementArea.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Area of the basement field is empty!"
    } else if (!poolArea.value || poolArea.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Area of the pool field is empty!"
    } else if (!centralAir.value || centralAir.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Please select central air condition!"
    } else if (!overallQual.value || overallQual.value.trim() === "") {
        errorMsgDiv.classList.remove("hidden");
        errorMsgDiv.querySelector("p").innerText = "Please select overall quality!"
    } else {
        const CSRFTOKEN = getCookie("csrftoken");

        let formData = new FormData();
        formData.append("houseArea", houseArea.value.trim().normalize());
        formData.append("totalRooms", totalRooms.value.trim().normalize());        
        formData.append("houseStyle", houseStyle.value.trim().normalize());        
        formData.append("totalBathrooms", totalBathrooms.value.trim().normalize());        
        formData.append("totalKitchens", totalKitchens.value.trim().normalize());        
        formData.append("totalFireplaces", totalFireplaces.value.trim().normalize());        
        formData.append("garageArea", garageArea.value.trim().normalize());        
        formData.append("carCapacity", carCapacity.value.trim().normalize());        
        formData.append("basementArea", basementArea.value.trim().normalize());        
        formData.append("poolArea", poolArea.value.trim().normalize());        
        formData.append("centralAir", centralAir.value.trim().normalize());        
        formData.append("overallQual", overallQual.value.trim().normalize());        

        await fetch("/house-price-predict/", {
            method: "POST",
            headers: {
                "X-CSRFToken": CSRFTOKEN
            },
            body: formData
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                alert("Something is wrong! Please try again...");
            }
        }).then(data => {
            if (data.success) {
                predictedResult.innerText = `\$${data.result}`;
                housePredictionResultModal.classList.add("show__predictedResult");
                homeForm.reset();
            } else if (data.failed) {
                alert("Something is wrong! Please try again...");
            }
        }).catch(err => console.error(err));
    }

    submitButton.disabled = false;
    submitButton.classList.remove("bg-slate-500");
    submitButton.classList.add("bg-indigo-500", "ripple__button");
    buttonLoaderSpinner.classList.add("hidden");
});

closePredictionModal.addEventListener("click", () => {
    housePredictionResultModal.classList.remove("show__predictedResult");
    predictedResult.innerText = "";
})