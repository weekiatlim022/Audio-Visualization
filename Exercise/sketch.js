var mySound;
var playStopButton;

var fft;
var analyzer;
var borderSize;
var rectColour;
var rectBorderColour;
var opacity;
var rectSize;

function preload() {
  mySound = loadSound('/sounds/Kalte_Ohren_(_Remix_).mp3');
}

function setup() { 
    createCanvas(1000, 700);
    background(180);
    angleMode(DEGREES);
    
    playStopButton = createButton('play');
    playStopButton.position(200, 20); 
    playStopButton.mousePressed(playStopSound);
  
    fft = new p5.FFT(0.2, 2048);
    
    if (typeof Meyda === "undefined"){
        console.log("Meyda could not be found!");
    }else{
        analyzer = Meyda.createMeydaAnalyzer({
            "audioContext":getAudioContext(),
            "source":mySound,
            "bufferSize":512,
            "featureExtractors":["rms","zcr","energy","spectralCentroid","spectralSpread"],
            "callback":features =>{
                console.log(features);
                borderSize = features.rms*100;
                rectColour = features.zcr*3,
                rectBorderColour = features.energy*20,
                opacity = features.spectralCentroid,
                rectSize = features.spectralSpread;
            }
        })
    }
}

function draw() {
    background(180, 100);
 
    fill(0);                
    
    let spectrum = fft.analyze();
   
    push(); 
    translate(200,50);
    scale(0.33, 0.20);  
    noStroke(); 
    fill(60);
    rect(0, 0, width, height);
    fill(255, 0, 0);
    for (let i = 0; i< spectrum.length; i++){ 
        let x = map(i, 0, spectrum.length, 0, width); 
        let h = -height + map(spectrum[i], 0, 255, height, 0);  
        rect(x, height, width/spectrum.length, h); 
    } 
    pop();
  
    push();
    fill(0, 255, 255);
    stroke(0);
    strokeWeight(borderSize);
    rect(25,350,170,100);
    pop();
    
    push();
    fill(100,rectColour,100);
    rect(210,320,200,150);
    pop();
    
    push();
    stroke(255, 0, rectBorderColour);
    strokeWeight(8);
    fill('#222222');
    rect(420,350,160,100);
    pop();
    
    push();
    squareColor = color(0);
    squareColor.setAlpha(opacity);
    fill(squareColor);
    rect(590,320,150,150);
    pop();
    
    push();
    fill('blue');
    stroke(255,255,255);
    strokeWeight(rectSize/3);
    rect(760,350,100,100);
    pop();
    
}


function playStopSound() {
  
    if (mySound.isPlaying())
    {
        mySound.stop();
        analyzer.stop();  
        playStopButton.html('play');   
        background(180); 
    } else {   
        mySound.loop();
        analyzer.start();
        playStopButton.html('stop');  
    }  
}