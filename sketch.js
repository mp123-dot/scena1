/*************************************************************
 *  KONFIG – zmieniasz tylko liczby w tym bloku
 *************************************************************/
const BTN_DIAMETER = 120;   // Ø przycisku "DALEJ" (px)
const BTN_OFFSET   = 100;   // odstęp od dołu pola input (px)
const HOVER_SCALE  = 1.05;  // powiększenie przy hoverze
/*************************************************************/

let font, kwiatekImg, tloImg, clickSound;
let rawDalejImg, dalejImg;      // oryginał + okrągła wersja
let startInput;
let dalejVisible = false;
let glitterParticles = [];

// pozycja przycisku – wyliczana co klatkę (zależna od inputa)
let btnX, btnY, btnR;

/***************** PRELOAD *****************/
function preload() {
  font        = loadFont('futura.ttf');            // (można zakomentować, jeśli brak)
  kwiatekImg  = loadImage('flowerMouse.png');      // kursor-kwiatek
  tloImg      = loadImage('t.login.png');          // tło logowania
  rawDalejImg = loadImage('PrzyciskDALEJ.png');    // okrągły PNG przycisku
  clickSound  = loadSound('glimmer.wav');          // dźwięk kliknięcia
}

/***************** SETUP *****************/
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  if (font) textFont(font);
  noCursor();

  // — maska: z owalnego PNG w idealne koło —
  const s = min(rawDalejImg.width, rawDalejImg.height);
  dalejImg = createImage(s, s);
  rawDalejImg.loadPixels();
  dalejImg.copy(
    rawDalejImg,
    (rawDalejImg.width  - s) / 2,
    (rawDalejImg.height - s) / 2,
    s, s,
    0, 0, s, s
  );
  const maskG = createGraphics(s, s);
  maskG.noStroke(); maskG.fill(255);
  maskG.circle(s / 2, s / 2, s);
  dalejImg.mask(maskG);

  // — INPUT —
  startInput = createInput('');
  styleInput(startInput);
  startInput.input(() => {
    dalejVisible = startInput.value().trim() !== '';
  });
}

/***************** DRAW *****************/
function draw() {
  background(220);

  // --- ekran logowania (jedyna scena) ---
  image(tloImg, 0, 0, width, height);

  // INPUT
  const inputW = 160, inputH = 32;
  const inputX = width / 2 - inputW / 2;
  const inputY = height / 2 - inputH - 8;
  startInput.position(inputX, inputY);
  startInput.size(inputW, inputH);

  // PRZYCISK DALEJ
  if (dalejVisible) {
    btnX = inputX + inputW / 2;
    btnY = inputY + inputH + BTN_OFFSET;
    btnR = BTN_DIAMETER / 2;

    const over = dist(mouseX, mouseY, btnX, btnY) < btnR;
    const d    = over ? BTN_DIAMETER * HOVER_SCALE : BTN_DIAMETER;

    imageMode(CENTER);
    image(dalejImg, btnX, btnY, d, d);
    imageMode(CORNER);
  }

  // efekt brokatu (wszędzie)
  for (let i = glitterParticles.length - 1; i >= 0; i--) {
    glitterParticles[i].update();
    glitterParticles[i].show();
    if (glitterParticles[i].finished()) {
      glitterParticles.splice(i, 1);
    }
  }

  // kursor-kwiatek
  imageMode(CENTER);
  image(kwiatekImg, mouseX, mouseY, 40, 40);
  imageMode(CORNER);
}

/***************** MOUSE PRESSED *****************/
function mousePressed() {
  // dźwięk przy każdej akcji
  if (clickSound.isLoaded()) clickSound.play();
  // brokat przy każdej akcji
  for (let i = 0; i < 18; i++) {
    glitterParticles.push(new Glitter(mouseX, mouseY));
  }

  // przejście do scena2 po kliknięciu w przycisk DALEJ
  if (
    dalejVisible &&
    typeof btnX !== "undefined" &&
    typeof btnY !== "undefined" &&
    typeof btnR !== "undefined" &&
    dist(mouseX, mouseY, btnX, btnY) < btnR
  ) {
    // Opóźnienie na czas animacji brokatu
    setTimeout(() => {
      window.location.href = "https://mp123-dot.github.io/scena2/";
    }, 150);
  }
}

/***************** WINDOW RESIZED *****************/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/***************** UTIL – wygląd inputa *****************/
function styleInput(inp) {
  inp.size(160, 32);
  inp.style('font-size', '18px');
  inp.style('border-radius', '16px');
  inp.style('border', '2px solid #e1a4e9');
  inp.style('text-align', 'center');
  inp.style('background', 'rgba(255,255,255,0.85)');
  inp.style('outline', 'none');
  inp.style('caret-color', '#e1a4e9');
}

/***************** KL. GLITTER *****************/
class Glitter {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.angle = random(TWO_PI);
    this.life   = 0;
    this.maxLife= random(20, 40);
    this.size   = random(3, 7);
    this.color  = color(
      random(180,255),
      random(120,200),
      random(200,255),
      200
    );
  }
  update() {
    this.life++;
    this.x += cos(this.angle) * 1.5;
    this.y += sin(this.angle) * 1.5;
  }
  finished() { return this.life > this.maxLife; }
  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}
