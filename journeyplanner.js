function JourneyForm(event){
    event.preventDefault();
    console.log('form submited');
    console.log(start.value)

    //getting the form data
    var start   = getElementById("start").value;
    var finish  = getElementById("finish").value;
    var SOC     = getElementById("SOC").value;
    var EVrange = getElementById("EVrange").value;
    var charger = getElementById("charger").value;
    
}

// get Journey planner Form
const journeyForm = document.getElementById('journey');

// add listener to the form
journeyForm.addEventListener('submit', JourneyForm)

// evStateOfCharge()
//a.	Full Battery Power in kWh
// b.	Car range at full charge in Mile 


// 4.	Collect information for the journey
// a.	Start Point
// b.	End Point
// c.	Calculate the length and duration of the journey.

// var start = 52.1716
// var destination = 41.91716


function evStateOfCharge(){

    var SOC = document.getElementById(SOC).value

    //to get a safe drivable 
    SOC - 
    console.log(SOC)
 };

