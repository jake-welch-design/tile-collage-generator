let img;
let font;
let pg;
let pg2; 
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
  pg2 = createGraphics(windowWidth, windowHeight); 
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

  tilesSlider = createSlider(2, 30, 15);
  tilesSlider.position(10, 10);
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
  saveImgButton.position(10, 60);
  saveImgButton.mousePressed(() => {
    save("collage.jpeg");
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

  if (img && img.width > 0) {
    windowRatio = windowWidth / windowHeight;
    let imgRatio = img.width / img.height;
    let drawWidth, drawHeight, xOffset = 0, yOffset = 0;

    if (imgRatio > windowRatio) {
      drawWidth = windowWidth;
      drawHeight = drawWidth / imgRatio;
      yOffset = (windowHeight - drawHeight) / 2;
    } else {
      drawWidth = windowWidth;
      drawHeight = drawWidth / imgRatio;
      yOffset = (windowHeight - drawHeight) / 2;
    }

    pg2.clear();
    pg2.image(img, xOffset, yOffset, drawWidth, drawHeight);
  }

  if (refresh) {
    rotationCollage();
    refresh = false;
    noLoop();
  }
}

function rotationCollage() {
  pg.clear(); 
  tilesX = max(1, tilesSlider.value());

  // if (tilesX <= 1) {
  //   return;
  // }

  let tilesY = tilesX * (windowHeight / windowWidth);
  let tileW = windowWidth / tilesX;
  let tileH = windowHeight / tilesY;

  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {
      let px = x * tileW;
      let py = y * tileH;

      pg.push();
      pg.translate(px + tileW / 2, py + tileH / 2);
      pg.rotate(radians(random(val)));
      pg.imageMode(CENTER);
      pg.image(pg2, 0, 0, tileW, tileH, px, py, tileW, tileH);
      pg.pop();
    }
  }

  imageMode(CORNER);
  image(pg, 0, 0, windowWidth, windowHeight);
}
