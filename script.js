const classesData = [
  {
    name: "Scout",
    desc: "Быстрый фланговик.",
    role: "attack",
    img: "scout.png",
    wiki: "https://wiki.teamfortress.com/wiki/Scout"
  },
  {
    name: "Soldier",
    desc: "Универсальный урон.",
    role: "attack",
    img: "soldier.png",
    wiki: "https://wiki.teamfortress.com/wiki/Soldier"
  },
  {
    name: "Pyro",
    desc: "Ближний бой.",
    role: "defense",
    img: "pyro.png",
    wiki: "https://wiki.teamfortress.com/wiki/Pyro"
  },
  {
    name: "Demoman",
    desc: "Контроль зон.",
    role: "attack",
    img: "demoman.png",
    wiki: "https://wiki.teamfortress.com/wiki/Demoman"
  },
  {
    name: "Heavy",
    desc: "Танк команды.",
    role: "defense",
    img: "heavy.png",
    wiki: "https://wiki.teamfortress.com/wiki/Heavy"
  },
  {
    name: "Engineer",
    desc: "Постройки и контроль.",
    role: "defense",
    img: "engineer.png",
    wiki: "https://wiki.teamfortress.com/wiki/Engineer"
  },
  {
    name: "Medic",
    desc: "Лечение и ÜberCharge.",
    role: "support",
    img: "medic.png",
    wiki: "https://wiki.teamfortress.com/wiki/Medic"
  },
  {
    name: "Sniper",
    desc: "Дальний урон.",
    role: "attack",
    img: "sniper.png",
    wiki: "https://wiki.teamfortress.com/wiki/Sniper"
  },
  {
    name: "Spy",
    desc: "Саботаж и бэкстабы.",
    role: "support",
    img: "spy.png",
    wiki: "https://wiki.teamfortress.com/wiki/Spy"
  }
];

const list = document.getElementById("classesList");

function render(role) {
  list.innerHTML = "";

  classesData
    .filter(c => role === "all" || c.role === role)
    .forEach(c => {
      const div = document.createElement("div");
      div.className = "class-card";

      div.innerHTML = `
        <img src="${c.img}" alt="${c.name}">
        <h3>${c.name}</h3>
        <p>${c.desc}</p>
        <a href="${c.wiki}" target="_blank" class="wiki-link">
          Подробнее на Wiki
        </a>
      `;

      list.appendChild(div);
    });
}

render("all");

document.querySelectorAll(".controls button")
  .forEach(btn => {
    btn.onclick = () => render(btn.dataset.role);
  });


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const grid = 20;

let snake, food, dx, dy, loop, running = false;

function resetGame() {
  snake = [{ x: 200, y: 200 }];
  food = {
    x: Math.floor(Math.random() * 21) * grid,
    y: Math.floor(Math.random() * 21) * grid
  };
  dx = grid;
  dy = 0;
}

function step() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= 420 || head.y >= 420 ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    stopGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = {
      x: Math.floor(Math.random() * 21) * grid,
      y: Math.floor(Math.random() * 21) * grid
    };
  } else {
    snake.pop();
  }

  ctx.clearRect(0, 0, 420, 420);

  ctx.fillStyle = "lime";
  snake.forEach(s => ctx.fillRect(s.x, s.y, grid - 2, grid - 2));

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, grid - 2, grid - 2);
}

function stopGame() {
  clearInterval(loop);
  running = false;
  document.getElementById("snakeOverlay").style.display = "flex";
}

document.getElementById("startBtn").onclick = () => {
  if (running) return;
  running = true;
  document.getElementById("snakeOverlay").style.display = "none";
  resetGame();
  loop = setInterval(step, 150);
};

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "w") { dx = 0; dy = -grid; }
  if (e.key === "ArrowDown" || e.key === "s") { dx = 0; dy = grid; }
  if (e.key === "ArrowLeft" || e.key === "a") { dx = -grid; dy = 0; }
  if (e.key === "ArrowRight" || e.key === "d") { dx = grid; dy = 0; }
});
