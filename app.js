// ======================================
// TRENER TOROWY BETA 2.3
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

let running=false;

let startTime=0;

let timerInterval=null;

let blinkInterval=null;


let currentSignal="A";


let plannedLaps=0;

let remainingLaps=0;

let completedLaps=0;



let trackLength=200;



let lastLapTime=0;



let laps=[];








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
document.getElementById("trackLength");


const finishMessage =
document.getElementById("finishMessage");






// ==============================
// ZNAK
// ==============================


function changeSignal(sign){


currentSignal=sign;


showSignal();


}




function showSignal(){


let s=
signals[currentSignal];


signalArea.style.background=
s.bg;


signalLetter.innerHTML=
currentSignal;


signalLetter.style.color=
s.fg;


}








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



let amount=
Number(lapsInput.value);



let length=
Number(trackInput.value);



if(!amount || amount<1){

alert("Podaj ilość okrążeń");

return;

}




if(!length || length<=0){

alert("Podaj długość toru");

return;

}





plannedLaps=amount;


remainingLaps=amount;


trackLength=length;



completedLaps=0;


laps=[];


lastLapTime=0;



lapCounter.innerHTML=
remainingLaps;



speedDisplay.innerHTML="-";



lapsInput.disabled=true;

trackInput.disabled=true;



running=true;



startTime=
Date.now();





timerInterval=
setInterval(
updateTimer,
30
);



startBlink();



}







// ==============================
// TIMER
// ==============================


function updateTimer(){


let elapsed=
Date.now()-startTime;


timer.innerHTML=
formatTime(elapsed);


}




function formatTime(ms){


let min=
Math.floor(ms/60000);


let sec=
Math.floor(
(ms%60000)/1000
);


let mil=
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


if(!running)
return;



let total=
Date.now()-startTime;



let lapTime=
total-lastLapTime;



lastLapTime=total;



completedLaps++;


remainingLaps--;



// =====================
// PRĘDKOŚĆ
// =====================


// metry -> km

let distanceKm =
trackLength / 1000;


// czas -> godziny

let timeHours =
lapTime / 3600000;



let speed =
distanceKm / timeHours;



let speedText =
speed.toFixed(1)
+
" km/h";



speedDisplay.innerHTML=
speedText;




lapCounter.innerHTML=
remainingLaps;




laps.push({

number:
completedLaps,


time:
lapTime,


total:
total,


signal:
currentSignal,


speed:
speedText


});





if(remainingLaps<=0){


finishTraining();


}


}








// ==============================
// MIGANIE 0.5 SEK
// ==============================


function startBlink(){


stopBlink();


let reverse=false;



blinkInterval=
setInterval(()=>{


reverse=!reverse;


let s=
signals[currentSignal];



if(reverse){


signalArea.style.background=
s.fg;


signalLetter.style.color=
s.bg;


}

else{


signalArea.style.background=
s.bg;


signalLetter.style.color=
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


let stopHold;



document
.getElementById("stopBtn")
.addEventListener(
"pointerdown",
()=>{


stopHold=setTimeout(()=>{


finishTraining();


},1000);



});





document
.getElementById("stopBtn")
.addEventListener(
"pointerup",
()=>{


clearTimeout(stopHold);


});






function finishTraining(){


if(!running)
return;



running=false;



clearInterval(timerInterval);



stopBlink();



lapsInput.disabled=false;


trackInput.disabled=false;



finishMessage.style.display=
"block";



beep();


exportTXT();


}







// ==============================
// DŹWIĘK
// ==============================


function beep(){


let ctx=
new AudioContext();


let osc=
ctx.createOscillator();



osc.frequency.value=800;


osc.connect(
ctx.destination
);


osc.start();


osc.stop(
ctx.currentTime+0.4
);


}







// ==============================
// RAPORT TXT
// ==============================


function exportTXT(){


let text=
"TRENING TOROWY\n\n";



text+=
"Tor: "
+
trackLength
+
" m\n";


text+=
"Plan okrążeń: "
+
plannedLaps
+
"\n";


text+=
"Wykonano: "
+
completedLaps
+
"\n";


text+=
"Czas całkowity: "
+
timer.innerHTML
+
"\n\n";



text+=
"====================\n\n";





laps.forEach(l=>{


text+=

"Okrążenie "
+
l.number
+
"\n";


text+=

"Czas: "
+
formatTime(l.time)
+
"\n";


text+=

"Prędkość: "
+
l.speed
+
"\n";


text+=

"Czas całkowity: "
+
formatTime(l.total)
+
"\n";


text+=

"Znak: "
+
l.signal
+
"\n\n";



});





let blob=
new Blob(
[text],
{
type:"text/plain"
}
);



let link=
document.createElement("a");



link.href=
URL.createObjectURL(blob);



link.download=
"trening_torowy.txt";



link.click();



}








// ==============================
// FULLSCREEN
// ==============================


document
.getElementById("fullBtn")
.addEventListener(
"click",
()=>{


document.documentElement
.requestFullscreen();


});







showSignal();