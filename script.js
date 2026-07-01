const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwJueVwAGCEjzNX0WaKRnGQ_wbH_0eZJByfXH5E02X__m65cUenUwLd1_NPIBIiPTEA/exec";

document.getElementById("bmiForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const sex = document.getElementById("sex").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const heightCm = parseFloat(document.getElementById("height").value);

    const requiredFields = ["name", "age", "sex", "weight", "height"];
    let valid = true;
    requiredFields.forEach(function(id) {
        const value = document.getElementById(id).value.trim();
        if (value === "") {
            valid = false;
        }
    });
    
    if (!valid) {
        alert("Please complete all required fields.");
        return;
    }

    if (age < 1 || age > 120) {
        alert("Please enter a valid age.");
        return;
    } else if (weight <= 0 || heightCm <= 0) {
        alert("Weight and height must be greater than zero.");
        return;
    }

    const heightM = heightCm / 100;
    const bmi = +(weight / (heightM * heightM)).toFixed(1);

    let category;
    let message;
    let color;

    switch (true) {
        case bmi < 18.5:
            category = "Underweight";
            color = "#5DADE2";
            message = "Consider a balanced, calorie-sufficient diet and consult a healthcare professional if needed.";
            break;
        case bmi < 25:
            category = "Normal";
            color = "#58D68D";
            message = "Great! Keep maintaining your healthy eating habits and regular exercise.";
            break;
        case bmi < 30:
            category = "Overweight";
            color = "#F5B041";
            message = "Increase physical activity and maintain a healthy, balanced diet.";
            break;
        default:
            category = "Obese";
            color = "#EC7063";
            message = "It is recommended that you consult a healthcare professional for proper guidance.";
    }

    showResult(name, bmi, category, message, color);

    recordSubmission({
        name: name,
        age: parseInt(age),
        sex: sex,
        weight: weight,
        heightCm: heightCm,
        bmi: bmi,
        category: category
    });
});

const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
    resetBtn.addEventListener("click", function() {
        document.getElementById("bmiForm").reset();

        document.getElementById("resultCard").classList.add("hidden");

        document.getElementById("resultCard").style.backgroundColor = "";

        document.getElementById("resultName").textContent = "";
        document.getElementById("resultBMI").textContent = "";
        document.getElementById("resultCategory").textContent = "";
        document.getElementById("resultMessage").textContent = "";
        
        console.log("Form has been reset");

        document.getElementById("name").focus();
    });
} else {
    console.error("Reset button not found! Check the ID.");
}

function showResult(name, bmi, category, message, color) {
    const resultCard = document.getElementById("resultCard");
    resultCard.classList.remove("hidden");
    resultCard.style.backgroundColor = color;
    document.getElementById("resultName").textContent = name;
    document.getElementById("resultBMI").textContent = bmi;
    document.getElementById("resultCategory").textContent = category;
    document.getElementById("resultMessage").textContent = message;
}

function recordSubmission(record) {
    console.log("Sending data:", record);
    
    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(record)
    })
    .then(response => {
        console.log("Response received:", response);
        alert("Data sent successfully! Check your Google Sheets.");
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error sending data. Check console for details.");
    });
}