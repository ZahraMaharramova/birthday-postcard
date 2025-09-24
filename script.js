const stages = {
  start: document.getElementById("start-stage"),
  balloons: document.getElementById("balloon-stage"),
  gifts: document.getElementById("gift-stage"),
  cake: document.getElementById("cake-stage"),
  slideshow: document.getElementById("slideshow-stage")
};


const startBtn = document.getElementById("start-btn");
const balloonContainer = document.getElementById("balloon-container");
const giftContainer = document.getElementById("gift-container");
const blowBtn = document.getElementById("blow-btn");
const bgMusic = document.getElementById("bg-music");
const popSound = document.getElementById("pop-sound");
const confettiSound = document.getElementById("confetti-sound");
const cheersSound = document.getElementById("cheers-sound");
const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");

const giftImages = [
  "assets/images/gift1.png",
  "assets/images/gift2.png",
  "assets/images/gift3.png",
  "assets/images/gift4.png",
  "assets/images/gift5.png",
  "assets/images/funny1.png",
  "assets/images/funny2.png",
  "assets/images/funny3.png",
  "assets/images/funny4.png"
];

for (let i = 0; i < 5; i++) {
  let g = document.createElement("div");
  g.classList.add("gift");

  let imgPath = giftImages[i];
  g.style.backgroundImage = `url('${imgPath}')`;

  g.addEventListener("click", () => {
    if (i === correct) {
      showCake();
    } else {
      g.style.transform = "rotate(20deg)";
      setTimeout(() => g.style.transform = "rotate(0deg)", 500);
    }
  });

  giftContainer.appendChild(g);
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let confettiPieces = [];

function createConfetti() {
  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      w: 10,
      h: 10,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speed: Math.random() * 3 + 2,
      rotation: Math.random() * 360
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();

    p.y += p.speed;
    p.rotation += 5;
    if (p.y > confettiCanvas.height) p.y = -10;
  });
  requestAnimationFrame(drawConfetti);
}

blowBtn.addEventListener("click", () => {
  document.querySelector(".flame").style.display = "none";
  confettiSound.play();
  cheersSound.play();
  createConfetti();
  drawConfetti();
  setTimeout(() => showSlideshow(), 5000);
});


let popped = 0;
const requiredPops = 15;

function showStage(name) {
  Object.values(stages).forEach(s => s.classList.remove("active"));
  stages[name].classList.add("active");
}

startBtn.addEventListener("click", () => {
  showStage("balloons");
  bgMusic.play();
  spawnBalloons();
});

const colors = ["red", "blue", "green", "yellow", "purple", "orange"];

function spawnBalloons() {
  const interval = setInterval(() => {
    if (popped >= requiredPops) {
      clearInterval(interval);
      setTimeout(() => showGifts(), 1000);
      return;
    }

    let b = document.createElement("div");
    b.classList.add("balloon", colors[Math.floor(Math.random() * colors.length)]);
    b.style.left = Math.random() * 90 + "vw";
    balloonContainer.appendChild(b);

    let duration = 6000 + Math.random() * 4000;
    let start = Date.now();

    function animate() {
      let progress = (Date.now() - start) / duration;
      if (progress >= 1) {
        b.remove();
        return;
      }
      b.style.bottom = progress * 100 + "vh";
      requestAnimationFrame(animate);
    }
    animate();

    ["click", "touchstart"].forEach(eventType => {
      b.addEventListener(eventType, () => {
        popped++;
        popSound.play();
        b.remove();
      }, { once: true }); 
    });


  }, 800);
}

function showGifts() {
  showStage("gifts");
  giftContainer.innerHTML = "";

  const boxImages = [
    "assets/images/gift1.png",
    "assets/images/gift2.png",
    "assets/images/gift3.png",
    "assets/images/gift4.png",
    "assets/images/gift5.png"
  ];

  const funnyImages = [
    "assets/images/funny1.jpg",
    "assets/images/funny2.jpg",
    "assets/images/funny3.jpg",
    "assets/images/funny4.jpeg"
  ];

  const correctIndex = Math.floor(Math.random() * 5);

  for (let i = 0; i < 5; i++) {
    const g = document.createElement("div");
    g.classList.add("gift");
    g.style.backgroundImage = `url('${boxImages[i]}')`;

    g.addEventListener("click", () => {
      if (i === correctIndex) {
        showCake();
      } else {
        const funnyIndex = i < correctIndex ? i : i - 1;
        g.style.backgroundImage = `url('${funnyImages[funnyIndex]}')`;
        g.style.pointerEvents = "none";
      }
    });

    giftContainer.appendChild(g);
  }
}


function showCake() {
  showStage("cake");
}

blowBtn.addEventListener("click", () => {
  document.querySelector(".flame").style.display = "none";
  confettiSound.play();
  setTimeout(() => showSlideshow(), 3000);
});

const photos = [
  { src: "assets/images/photo1.JPG", text: "С днём рождения, Фатюшка🎉" },
  { src: "assets/images/photo2.jpg", text: "Я желаю тебе всего самого наилучшего и исполнения всех желаний ✨" },
  { src: "assets/images/photo3.jpg", text: "Я рада что ты есть в моей жизни, безумно люблю тебя! ❤️" }
];

function showSlideshow() {
  showStage("slideshow");
  let i = 0;
  const slideshow = document.getElementById("slideshow");
  const caption = document.getElementById("caption");

  function next() {
    if (i >= photos.length) i = 0;
    slideshow.innerHTML = `<img src="${photos[i].src}" style="max-height:70vh; border-radius:20px;">`;
    caption.textContent = photos[i].text;
    i++;
  }
  next();
  setInterval(next, 4000);
}
