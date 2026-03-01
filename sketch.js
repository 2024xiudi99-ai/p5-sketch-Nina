let flowers = [];
let flowerImg;

let sounds = [];
const sound_files = [
  "sound/Sound1.wav", // collapse
  "sound/Sound2.wav"  // expand
];

function preload(){
  flowerImg = loadImage("assets/flower.png");

  for(let i=0;i<sound_files.length;i++){
    sounds.push(loadSound(sound_files[i]));
  }
}

function setup(){
  createCanvas(400,400);

  userStartAudio();

  let cols = 10;
  let rows = 10;

  for(let i = 0;i < cols; i ++ ){
    for(let j = 0;j < rows; j ++){
      let x = i * width/cols + random(-20,20);
      let y = j * height/rows + random(-20,20);
      flowers.push(new Flower(x,y));
    }
  }
}

function draw(){
  background(0,80,40);

  for(let f of flowers){
    f.move();
    f.display();
  }
}

function mousePressed(){
  for(let f of flowers){
    let d = dist(mouseX,mouseY,f.x,f.y);
    if(d < f.currentSize/2){
      f.toggle();
      f.playSound();
    }
  }
}


class Flower{
  constructor(x,y){
    this.x = x;
    this.y = y;

    this.size = random(20,90);
    this.currentSize = this.size;

    this.colOuter = color(random(180,255), random(120,200), random(120,200));
    this.colCenter = color(255, random(180,230), random(120,180));

    
    this.collapseSoundIndex = 0; // collapse
    this.expandSoundIndex   = 1; // expand

    this.collapsed = false;
    this.animating = false;
    this.t = 0;
    this.pngAlpha = 255;
    this.circleAlpha = 0;
  }


  playSound(){
    let snd;
    if(this.collapsed){
      snd = sounds[this.expandSoundIndex];
    } else {

      snd = sounds[this.collapseSoundIndex];
    }

    if(snd && snd.isLoaded()){
      
      snd.stop(); 
      
      snd.play();
    }
  }

  toggle(){
    this.animating = true;
    this.t = 0;
    this.collapsed = !this.collapsed;
  }

  move(){
    let baseAngle = -PI*0.75;
    let speed = map(this.size, 20, 90, 1.5, 0.3);
    this.x += cos(baseAngle) * speed;
    this.y += sin(baseAngle) * speed;
    if(this.y < -80){
      this.x = random(width);
      this.y = random(height);
    }
  }

  display(){
    push();
    translate(this.x, this.y);
    imageMode(CENTER);
    noStroke();

    if(this.animating){
      this.t += 0.015;

      if(this.collapsed){
        this.currentSize = lerp(this.size, this.size * 0.35, this.t);
        this.pngAlpha = lerp(255, 0, this.t);
        this.circleAlpha = lerp(0, 255, this.t);
      } else {
        this.currentSize = lerp(this.size * 0.35, this.size, this.t);
        this.pngAlpha = lerp(0, 255, this.t);
        this.circleAlpha = lerp(255, 0, this.t);
      }

      if(this.t >= 1){
        this.animating = false;
      }
    }

    if(this.pngAlpha > 1){
      tint(red(this.colOuter), green(this.colOuter), blue(this.colOuter), this.pngAlpha);
      image(flowerImg, 0, 0, this.currentSize, this.currentSize);
      noTint();

      fill(red(this.colCenter), green(this.colCenter), blue(this.colCenter), this.pngAlpha);
      circle(0, 0, this.currentSize * 0.15);
    }

    
    if(this.circleAlpha > 1){
      fill(red(this.colOuter), green(this.colOuter), blue(this.colOuter), this.circleAlpha);
      circle(0,0,this.currentSize);
    }

    pop();
  }
}