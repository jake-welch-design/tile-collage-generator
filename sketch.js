let img;
let font;
let pg;
let val = [0, 90, 180, 270, 360];
let windowRatio;
let refresh = false;
let tilesSlider;
let tilesX;

function preload() {
  font = loadFont('fonts/Satoshi-Regular.otf');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);
  canvas.drop(gotFile);

  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(36);
  background(0);

  push();
  translate(windowWidth / 2, windowHeight / 2);
  fill(255);
  text("Drag & drop your image file into the window", 0, 0);
  pop();

  tilesSlider = createSlider(0,30,15);
  tilesSlider.position(10,10);
  tilesSlider.input(() => { 
    refresh = true;
    loop(); 
  });

  refreshButton = createButton('Refresh');
  refreshButton.position(10, 35);
  refreshButton.mousePressed(() => {
    refresh = true; 
    loop();
  });

  saveImgButton = createButton('Save');
  saveImgButton.position(10,60);
  saveImgButton.mousePressed(() => {
  save("collage.jpeg")
  });
}

function gotFile(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
    loadImage(event.target.result, (loadedImage) => {
      img = loadedImage;
      refresh = true; 
      loop(); 
    });
  };
  reader.readAsDataURL(file.file);
}

function draw() {
  if (refresh) {
    windowRatio = windowWidth / windowHeight;

    if (img && img.width > 0) {
      let imgRatio = img.width / img.height;
      let drawWidth, drawHeight, xOffset = 0, yOffset = 0;
      if (imgRatio > windowRatio) {
        drawHeight = windowHeight;
        drawWidth = img.width * (drawHeight / img.height);
        xOffset = (windowWidth - drawWidth) / 2;
      } else {
        drawWidth = windowWidth;
        drawHeight = img.height * (drawWidth / img.width);
        yOffset = (windowHeight - drawHeight) / 2;
      }
      image(img, xOffset, yOffset, drawWidth, drawHeight);
    }
    rotationCollage();
    refresh = false;
    noLoop(); 
  }
}

function rotationCollage() {
  if (!img || img.width <= 0) return;

  pg.clear(); 
  
  tilesX = tilesSlider.value();
  let tilesY = tilesX / windowRatio;
  let tileW = ceil(pg.windowWidth / tilesX);
  let tileH = ceil(pg.windowHeight / tilesY);

  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {
      let px = int(x * tileW);
      let py = int(y * tileH);

      pg.push();
      pg.translate(px + tileW / 2, py + tileH / 2);
      pg.rotate(radians(random(val))); 
      pg.imageMode(CENTER);
      pg.image(img, -tileW / 2, -tileH / 2, tileW, tileH, px, py, int(tileW), int(tileH));
      pg.pop();
    }
  }

  imageMode(CORNER);
  image(pg, 0, 0, width, height);
}
