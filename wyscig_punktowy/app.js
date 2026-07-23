// ======================================
// WYŚCIG PUNKTOWY v3.0
// APP.JS
// ======================================



// ==============================
// ZNAKI
// ==============================


const signals = {


    "A":{
        bg:"#e53935",
        fg:"#ffffff"
    },


    "↑":{
        bg:"#e53935",
        fg:"#ffffff"
    },


    "-":{
        bg:"#f9a825",
        fg:"#000000"
    },


    "↓":{
        bg:"#2e7d32",
        fg:"#ffffff"
    },


    "H":{
        bg:"#2e7d32",
        fg:"#ffffff"
    },


    "S":{
        bg:"#1565c0",
        fg:"#ffffff"
    },


    "!↑":{
        bg:"#ffffff",
        fg:"#000000"
    },


    "O↑":{
        bg:"#ffffff",
        fg:"#000000"
    },


    "!↓":{
        bg:"#ffffff",
        fg:"#000000"
    },


    "O↓":{
        bg:"#ffffff",
        fg:"#000000"
    }


};







// ==============================
// ZMIENNE
// ==============================


let running = false;


let startTime = 0;


let timerInterval = null;


let blinkInterval = null;


let stopTimer = null;


let currentSignal = "A";



let totalLaps = 0;


let remainingLaps = 0;


let lapNumber = 0;


let trackLength = 200;


let lastLapTime = 0;


let laps = [];







// ==============================
// ELEMENTY
// ==============================


const signalArea =
document.getElementById("signalArea");


const signalLetter =
document.getElementById("signalLetter");


const lapCounter =
document.getElementById("lapCounter");


const speedDisplay =
document.getElementById("speedDisplay");


const timer =
document.getElementById("timer");


const lapsInput =
document.getElementById("lapsInput");


const trackInput =
document.getElementById("trackInput");


const finishMessage =
document.getElementById("finishMessage");







// ==============================
// ZNAKI
// ==============================


function setSignal(name){


    currentSignal = name;


    renderSignal();


}




function renderSignal(){


    let signal =
    signals[currentSignal];


    signalArea.style.background =
    signal.bg;


    signalLetter.innerHTML =
    currentSignal;


    signalLetter.style.color =
    signal.fg;


}






document
.querySelectorAll("#signalButtons button")
.forEach(button=>{


    button.addEventListener(
        "click",
        ()=>{


            setSignal(
                button.dataset.signal
            );


        }
    );


});








// ==============================
// START
// ==============================


document
.getElementById("startBtn")
.addEventListener(
"click",
startTraining
);






function startTraining(){


    if(running)
    return;



    let lapsValue =
    parseInt(
        lapsInput.value.trim()
    );



    let trackValue =
    parseInt(
        trackInput.value.trim()
    );



    if(!lapsValue || lapsValue <= 0){

        alert("Podaj ilość okrążeń");

        return;

    }



    if(!trackValue || trackValue <=0){

        alert("Podaj długość toru");

        return;

    }



    totalLaps = lapsValue;


    remainingLaps = lapsValue;


    trackLength = trackValue;



    lapNumber = 0;


    laps = [];


    lastLapTime = 0;



    lapCounter.innerHTML =
    remainingLaps;



    speedDisplay.innerHTML =
    "-";



    lapsInput.disabled = true;


    trackInput.disabled = true;




    running = true;


    startTime =
    Date.now();



    timerInterval =
    setInterval(
        updateTimer,
        30
    );



    startBlink();

}








// ==============================
// CZAS
// ==============================


function updateTimer(){


    let elapsed =
    Date.now() - startTime;


    timer.innerHTML =
    formatTime(elapsed);


}







function formatTime(ms){


    let min =
    Math.floor(ms / 60000);



    let sec =
    Math.floor(
        (ms % 60000) / 1000
    );



    let mil =
    ms % 1000;



    return (

        String(min).padStart(2,"0")
        +
        ":"
        +
        String(sec).padStart(2,"0")
        +
        "."
        +
        String(mil).padStart(3,"0")

    );


}









// ==============================
// OKRĄŻENIA
// ==============================


document
.getElementById("lapBtn")
.addEventListener(
"click",
recordLap
);







function recordLap(){


    if(!running)
    return;



    let total =
    Date.now() - startTime;



    let lapTime =
    total - lastLapTime;



    lastLapTime =
    total;



    lapNumber++;


    remainingLaps--;



    let speed =
    calculateSpeed(
        lapTime
    );



    speedDisplay.innerHTML =
    speed.toFixed(1)
    +
    " km/h";



    lapCounter.innerHTML =
    remainingLaps;



    laps.push({

        number:lapNumber,

        time:lapTime,

        speed:speed,

        signal:currentSignal

    });





    if(remainingLaps <=0){

        finishTraining();

    }


}








function calculateSpeed(time){


    let km =
    trackLength / 1000;


    let hours =
    time / 3600000;



    return km / hours;


}









// ==============================
// MIGANIE 0,5 SEKUNDY
// ==============================


function startBlink(){


    stopBlink();



    let inverse=false;



    blinkInterval =
    setInterval(()=>{


        inverse=!inverse;



        let s =
        signals[currentSignal];



        if(inverse){


            signalArea.style.background =
            s.fg;


            signalLetter.style.color =
            s.bg;


        }
        else{


            signalArea.style.background =
            s.bg;


            signalLetter.style.color =
            s.fg;


        }



    },500);


}





function stopBlink(){


    clearInterval(
        blinkInterval
    );


}










// ==============================
// STOP
// ==============================


document
.getElementById("stopBtn")
.addEventListener(
"pointerdown",
()=>{


    stopTimer =
    setTimeout(()=>{


        finishTraining();


    },1000);


});




document
.getElementById("stopBtn")
.addEventListener(
"pointerup",
()=>{


    clearTimeout(stopTimer);


});










function finishTraining(){


    if(!running)
    return;



    running=false;



    clearInterval(
        timerInterval
    );



    stopBlink();



    lapsInput.disabled=false;


    trackInput.disabled=false;



    finishMessage.style.display =
    "block";



    saveHistory();


    downloadReport();


}









// ==============================
// HISTORIA
// ==============================


function saveHistory(){


    let history =
    JSON.parse(
        localStorage.getItem(
            "trainingHistory"
        )
        ||
        "[]"
    );



    history.push({

        date:
        new Date()
        .toLocaleString(),


        track:
        trackLength,


        laps:
        laps


    });



    localStorage.setItem(

        "trainingHistory",

        JSON.stringify(history)

    );


}










// ==============================
// RAPORT TXT
// ==============================


function downloadReport(){


    let text =
    "WYŚCIG PUNKTOWY\n\n";



    text +=
    "Data: "
    +
    new Date()
    .toLocaleString()
    +
    "\n";



    text +=
    "Tor: "
    +
    trackLength
    +
    " m\n";



    text +=
    "Okrążenia: "
    +
    totalLaps
    +
    "\n\n";



    laps.forEach(l=>{


        text +=
        "Okrążenie "
        +
        l.number
        +
        "\n";


        text +=
        "Czas: "
        +
        formatTime(l.time)
        +
        "\n";


        text +=
        "Prędkość: "
        +
        l.speed.toFixed(1)
        +
        " km/h\n";


        text +=
        "Znak: "
        +
        l.signal
        +
        "\n\n";


    });





    let file =
    new Blob(

        [text],

        {
            type:"text/plain"
        }

    );



    let link =
    document.createElement("a");



    link.href =
    URL.createObjectURL(file);



    link.download =
    "wyscig_punktowy.txt";



    link.click();


}










// ==============================
// FULLSCREEN
// ==============================


document
.getElementById("fullscreenBtn")
.addEventListener(
"click",
()=>{


    document.documentElement
    .requestFullscreen();


});









// ==============================
// POWRÓT DO MENU
// ==============================


document
.getElementById("menuBtn")
.addEventListener(
"click",
()=>{


    window.location.href =
    "../index.html";


});









// ==============================
// STARTOWY WYGLĄD
// ==============================


renderSignal();







// ==============================
// SERVICE WORKER
// ==============================


if("serviceWorker" in navigator){


    window.addEventListener(
        "load",
        ()=>{


            navigator.serviceWorker.register(
                "service-worker.js"
            );


        }
    );


}