// ======================================
// START ZATRZYMANY v1.0
// APP.JS
// ======================================



// ==============================
// ZMIENNE
// ==============================


let running = false;

let countdownRunning = false;

let riding = false;


let countdownValue = 10;


let countdownInterval = null;

let timerInterval = null;


let startTime = 0;

let lastLapTime = 0;


let totalLaps = 0;

let remainingLaps = 0;


let trackLength = 0;


let lapTimes = [];

let previousLap = null;



let audioContext = null;








// ==============================
// ELEMENTY
// ==============================


const riderArea =
document.getElementById(
    "riderArea"
);


const countdownDisplay =
document.getElementById(
    "countdownDisplay"
);


const lapDisplay =
document.getElementById(
    "lapDisplay"
);


const differenceDisplay =
document.getElementById(
    "differenceDisplay"
);


const timer =
document.getElementById(
    "timer"
);


const lapsInput =
document.getElementById(
    "lapsInput"
);


const trackInput =
document.getElementById(
    "trackInput"
);









// ==============================
// TYLKO LICZBY
// ==============================


[trackInput,lapsInput]
.forEach(input=>{


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
// START ODLICZANIA
// ==============================


document
.getElementById("countdownBtn")
.addEventListener(
"click",
startCountdown
);







function startCountdown(){


    if(countdownRunning || riding)
    return;



    totalLaps =
    parseInt(
        lapsInput.value
    );



    trackLength =
    parseInt(
        trackInput.value
    );



    if(!totalLaps || !trackLength){

        alert(
            "Uzupełnij TOR i OKR"
        );

        return;

    }



    lockSettings();



    countdownRunning=true;


    countdownValue=10;


    countdownDisplay.innerHTML =
    countdownValue;



    playShort();


    countdownInterval =
    setInterval(()=>{


        countdownValue--;



        if(
            [
                5,
                4,
                3,
                2,
                1
            ]
            .includes(countdownValue)
        ){

            playShort();

        }





        if(countdownValue===0){


            countdownDisplay.innerHTML =
            "0";


            playLong();



            clearInterval(
                countdownInterval
            );


            setTimeout(
                startRide,
                300
            );


            return;


        }



        countdownDisplay.innerHTML =
        countdownValue;



    },1000);



}









// ==============================
// START JAZDY RĘCZNY
// ==============================


document
.getElementById("startBtn")
.addEventListener(
"click",
startRide
);






function startRide(){


    if(riding)
    return;



    clearInterval(
        countdownInterval
    );



    countdownDisplay.innerHTML =
    "";



    riding=true;


    running=true;



    startTime =
    Date.now();



    lastLapTime =
    startTime;



    lapTimes=[];


    previousLap=null;



    remainingLaps =
    totalLaps;



    lapDisplay.innerHTML =
    remainingLaps;



    timerInterval =
    setInterval(
        updateTimer,
        30
    );


}








// ==============================
// TIMER
// ==============================


function updateTimer(){


    if(!riding)
    return;



    let elapsed =
    Date.now()
    -
    startTime;



    timer.innerHTML =
    formatTime(elapsed);


}








function formatTime(ms){


    let min =
    Math.floor(
        ms/60000
    );


    let sec =
    Math.floor(
        (ms%60000)/1000
    );


    let mil =
    ms%1000;



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
// OKRĄŻENIE
// ==============================


document
.getElementById("lapBtn")
.addEventListener(
"click",
recordLap
);







function recordLap(){


    if(!riding)
    return;



    let now =
    Date.now();



    let lapTime =
    now -
    lastLapTime;



    lastLapTime =
    now;



    remainingLaps--;



    lapDisplay.innerHTML =
    remainingLaps;



    let difference = 0;



    if(previousLap !== null){


        difference =
        lapTime -
        previousLap;



        showDifference(
            difference
        );


    }



    previousLap =
    lapTime;



    lapTimes.push({

        time:lapTime,

        difference:difference

    });



}








// ==============================
// KOLOR EKRANU
// ==============================


function showDifference(value){


    differenceDisplay.innerHTML =
    formatDifference(
        value
    );



    if(value < 0){


        riderArea.style.background =
        "#2e7d32";


    }
    else{


        riderArea.style.background =
        "#c62828";


    }


}







function formatDifference(value){


    let sign =
    value < 0
    ?
    "-"
    :
    "+";



    return (

        sign +

        Math.abs(value/1000)
        .toFixed(3)

    );


}









// ==============================
// STOP
// ==============================


document
.getElementById("stopBtn")
.addEventListener(
"click",
stopRide
);







function stopRide(){


    if(!riding)
    return;



    riding=false;


    running=false;



    clearInterval(
        timerInterval
    );



    generateReport();



    unlockSettings();


}








// ==============================
// RAPORT TXT
// ==============================


function generateReport(){



let totalTime =
Date.now()
-
startTime;



let speed =

(

(trackLength*totalLaps)
/1000

)

/

(

totalTime/3600000

);





let text =

`START ZATRZYMANY


Data:
${new Date().toLocaleString()}


Tor:
${trackLength} m


Okrążenia:
${totalLaps}



`;





lapTimes.forEach((lap,index)=>{


text +=

`Okrążenie ${index+1}

Czas:
${formatTime(lap.time)}

Różnica:
${formatDifference(lap.difference)}


`;



});





text +=

`
Czas całkowity:
${formatTime(totalTime)}


Średnia prędkość:
${speed.toFixed(1)} km/h

`;





let blob =
new Blob(
[text],
{
type:"text/plain"
}
);



let link =
document.createElement("a");



link.href =
URL.createObjectURL(blob);



link.download =
"start_zatrzymany.txt";


link.click();



}









// ==============================
// BLOKADA PÓL
// ==============================


function lockSettings(){

    lapsInput.readOnly=true;

    trackInput.readOnly=true;

}



function unlockSettings(){

    lapsInput.readOnly=false;

    trackInput.readOnly=false;

}








// ==============================
// DŹWIĘKI
// ==============================


function createAudio(){


    if(!audioContext){

        audioContext =
        new(
        window.AudioContext ||
        window.webkitAudioContext
        )();

    }


}





function playShort(){


    createAudio();


    let osc =
    audioContext.createOscillator();


    let gain =
    audioContext.createGain();



    osc.connect(gain);

    gain.connect(
        audioContext.destination
    );


    osc.frequency.value=1000;


    gain.gain.value=.15;



    osc.start();


    osc.stop(
        audioContext.currentTime+.15
    );


}






function playLong(){


    createAudio();


    let osc =
    audioContext.createOscillator();


    let gain =
    audioContext.createGain();



    osc.connect(gain);

    gain.connect(
        audioContext.destination
    );



    osc.frequency.value=700;


    gain.gain.value=.2;



    osc.start();


    osc.stop(
        audioContext.currentTime+1
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