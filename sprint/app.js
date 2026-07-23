// ======================================
// SPRINT v1.2
// APP.JS
// ======================================


// ==============================
// ZMIENNE
// ==============================


let running = false;

let sprintStarted = false;

let sprintStartTime = 0;

let sprintEndTime = 0;

let timerInterval = null;


let totalLaps = 0;

let remainingLaps = 0;

let trackLength = 0;


let audioContext = null;






// ==============================
// ELEMENTY
// ==============================


const lapsDisplay =
document.getElementById("lapsDisplay");


const lapsInput =
document.getElementById("lapsInput");


const trackInput =
document.getElementById("trackInput");


const timer =
document.getElementById("timer");







// ==============================
// TYLKO LICZBY
// ==============================


[trackInput, lapsInput].forEach(input => {


    input.addEventListener(
        "input",
        ()=>{


            input.value =
            input.value.replace(
                /[^0-9]/g,
                ""
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
startSprint
);






function startSprint(){


    if(running)
    return;



    totalLaps =
    parseInt(
        lapsInput.value
    );



    trackLength =
    parseInt(
        trackInput.value
    );



    if(!totalLaps || totalLaps<=0){

        alert(
            "Podaj ilość okrążeń"
        );

        return;

    }



    if(!trackLength || trackLength<=0){

        alert(
            "Podaj długość toru"
        );

        return;

    }




    remainingLaps =
    totalLaps;



    lapsDisplay.innerHTML =
    remainingLaps;



    lapsInput.readOnly = true;

    trackInput.readOnly = true;



    running = true;


    sprintStarted = false;



    timer.innerHTML =
    "00:00.000";



    timerInterval =
    setInterval(
        updateTimer,
        30
    );


}









// ==============================
// OKRĄŻENIE
// ==============================


document
.getElementById("lapBtn")
.addEventListener(
"click",
lap
);






function lap(){


    if(!running)
    return;



    playBell();



    if(remainingLaps > 0){


        remainingLaps--;



        lapsDisplay.innerHTML =
        remainingLaps;



        if(remainingLaps === 0){


            startSprintTimer();


        }


    }


}









// ==============================
// START WŁAŚCIWEGO POMIARU
// ==============================


function startSprintTimer(){


    sprintStarted = true;


    sprintStartTime =
    Date.now();



}









// ==============================
// TIMER
// ==============================


function updateTimer(){


    if(!running)
    return;



    if(!sprintStarted){


        timer.innerHTML =
        "00:00.000";


        return;

    }



    let elapsed =
    Date.now()
    -
    sprintStartTime;



    timer.innerHTML =
    formatTime(elapsed);


}








function formatTime(ms){


    let min =
    Math.floor(
        ms / 60000
    );



    let sec =
    Math.floor(
        (ms % 60000)
        /
        1000
    );



    let mil =
    ms % 1000;



    return (

        String(min)
        .padStart(2,"0")

        +

        ":"

        +

        String(sec)
        .padStart(2,"0")

        +

        "."

        +

        String(mil)
        .padStart(3,"0")

    );


}









// ==============================
// STOP
// ==============================


document
.getElementById("stopBtn")
.addEventListener(
"click",
stopSprint
);






function stopSprint(){


    if(!running)
    return;



    if(!sprintStarted){


        alert(
            "Pomiar jeszcze się nie rozpoczął"
        );


        return;


    }




    sprintEndTime =
    Date.now();



    let sprintTime =
    sprintEndTime
    -
    sprintStartTime;




    running = false;



    clearInterval(
        timerInterval
    );



    lapsInput.readOnly = false;

    trackInput.readOnly = false;



    generateReport(
        sprintTime
    );


}









// ==============================
// PRĘDKOŚĆ
// tylko 0 -> STOP
// ==============================


function calculateSpeed(time){


    let distance =

    (

        trackLength *
        totalLaps

    )
    /
    1000;



    let hours =
    time / 3600000;



    return distance / hours;


}









// ==============================
// RAPORT TXT
// ==============================


function generateReport(time){



    let speed =
    calculateSpeed(
        time
    );



    let report =

`SPRINT

Data:
${new Date().toLocaleString()}


Tor:
${trackLength} m


Okrążenia:
${totalLaps}


Czas sprintu:
${formatTime(time)}


Średnia prędkość:
${speed.toFixed(1)} km/h

`;





    let file =
    new Blob(

        [report],

        {
            type:
            "text/plain"
        }

    );



    let link =
    document.createElement(
        "a"
    );



    link.href =
    URL.createObjectURL(
        file
    );



    link.download =
    "sprint.txt";



    link.click();


}









// ==============================
// DŹWIĘK
// ==============================


function playBell(){


    if(!audioContext){


        audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    }



    let oscillator =
    audioContext.createOscillator();


    let gain =
    audioContext.createGain();



    oscillator.connect(gain);


    gain.connect(
        audioContext.destination
    );



    oscillator.frequency.value =
    1000;



    gain.gain.value =
    0.15;



    oscillator.start();



    oscillator.stop(
        audioContext.currentTime + 0.15
    );


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
// MENU
// ==============================


document
.getElementById("menuBtn")
.addEventListener(
"click",
()=>{


    window.location.href =
    "../index.html";


});