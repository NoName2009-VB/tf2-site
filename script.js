const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const startBtn = document.getElementById("startBtn");

const GRID = 21;            // 21x21 клеток
const CELL = canvas.width / GRID;

let snake, dir, food, score, best, loopId, running, paused, speedMs;

best = Number(localStorage.getItem("tf2SnakeBest") || 0);
bestEl.textContent = String(best);

function resetGame(){
  snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
  dir = {x:1,y:0};
  score = 0;
  speedMs = 140;
  running = false;
  paused = false;
  scoreEl.textContent = "0";
  spawnFood();
  draw();
}

function spawnFood(){
  while(true){
    const fx = Math.floor(Math.random()*GRID);
    const fy = Math.floor(Math.random()*GRID);
    const onSnake = snake.some(s => s.x===fx && s.y===fy);
    if(!onSnake){
      food = {x:fx,y:fy};
      return;
    }
  }
}

function drawGrid(){
  ctx.fillStyle = "#0a0f16";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = "#ffffff";
  for(let i=0;i<=GRID;i++){
    ctx.beginPath();
    ctx.moveTo(i*CELL,0);
    ctx.lineTo(i*CELL,canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,i*CELL);
    ctx.lineTo(canvas.width,i*CELL);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function overlay(text){
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "#eaf2ff";
  ctx.font = "700 18px system-ui, Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width/2, canvas.height/2);

  ctx.font = "400 13px system-ui, Arial";
  ctx.fillStyle = "rgba(234,242,255,0.8)";
  ctx.fillText("WASD/Стрелки • P пауза • R рестарт • Enter старт", canvas.width/2, canvas.height/2+26);
  ctx.textAlign = "left";
}

function draw(){
  drawGrid();

  // food
  ctx.fillStyle = "#ffb000";
  ctx.fillRect(food.x*CELL + 3, food.y*CELL + 3, CELL - 6, CELL - 6);

  // snake
  for(let i=0;i<snake.length;i++){
    const seg = snake[i];
    ctx.fillStyle = i===0 ? "#40c9ff" : "#eaf2ff";
    ctx.globalAlpha = i===0 ? 1 : 0.9;
    ctx.fillRect(seg.x*CELL + 2, seg.y*CELL + 2, CELL - 4, CELL - 4);
  }
  ctx.globalAlpha = 1;

  if(!running){
    overlay("Нажми «Старт» или Enter");
  } else if(paused){
    overlay("Пауза (P)");
  }
}

function startGame(){
  if(running) return;
  running = true;
  paused = false;
  clearInterval(loopId);
  loopId = setInterval(step, speedMs);
  draw();
}

function endGame(){
  running = false;
  paused = false;
  clearInterval(loopId);

  if(score > best){
    best = score;
    localStorage.setItem("tf2SnakeBest", String(best));
    bestEl.textContent = String(best);
  }

  draw();
  overlay("Конец игры! Нажми R для рестарта");
}

function setDirection(nx, ny){
  // запрет разворота на 180°
  if(dir.x === -nx && dir.y === -ny) return;
  dir = {x:nx, y:ny};
}

function step(){
  if(!running || paused) return;

  const head = snake[0];
  const newHead = {x: head.x + dir.x, y: head.y + dir.y};

  // wall collision
  if(newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID){
    endGame();
    return;
  }

  // self collision
  if(snake.some(s => s.x===newHead.x && s.y===newHead.y)){
    endGame();
    return;
  }

  snake.unshift(newHead);

  // eat
  if(newHead.x === food.x && newHead.y === food.y){
    score++;
    scoreEl.textContent = String(score);

    if(score % 5 === 0){
      speedMs = Math.max(70, speedMs - 10);
    }
    spawnFood();
  } else {
    snake.pop();
  }

  draw();

  clearInterval(loopId);
  loopId = setInterval(step, speedMs);
}

document.addEventListener("keydown", (e)=>{
  const k = e.key.toLowerCase();

  if(k === "enter") startGame();
  if(k === "r"){
    resetGame();
    startGame();
  }
  if(k === "p"){
    if(!running) return;
    paused = !paused;
    draw();
  }

  if(k === "arrowup" || k === "w") setDirection(0, -1);
  if(k === "arrowdown" || k === "s") setDirection(0, 1);
  if(k === "arrowleft" || k === "a") setDirection(-1, 0);
  if(k === "arrowright" || k === "d") setDirection(1, 0);
});

startBtn.addEventListener("click", startGame);

resetGame();
