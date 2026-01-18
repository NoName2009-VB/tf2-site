
const classesData = [
  { name: "Scout", desc: "Быстрый фланговик.", role: "attack" },
  { name: "Soldier", desc: "Универсальный боец.", role: "attack" },
  { name: "Pyro", desc: "Ближний бой.", role: "defense" },
  { name: "Engineer", desc: "Постройки и контроль.", role: "defense" },
  { name: "Medic", desc: "Лечение и ÜberCharge.", role: "support" },
  { name: "Sniper", desc: "Контроль дальних линий.", role: "attack" }
];

const container = document.getElementById("classesList");

function renderCards(list) {
  container.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "class";

    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <button class="btn">Подробнее</button>
    `;

    card.querySelector("button")
      .addEventListener("click", () => openModal(item));

    container.appendChild(card);
  });
}

renderCards(classesData);

document.querySelectorAll(".controls button").forEach(btn => {
  btn.addEventListener("click", () => {
    const role = btn.dataset.role;
    renderCards(role === "all"
      ? classesData
      : classesData.filter(c => c.role === role)
    );
  });
});


const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");

function openModal(item) {
  modalTitle.textContent = item.name;
  modalDesc.textContent = item.desc;
  modal.classList.remove("hidden");
}

document.getElementById("closeModal").onclick = () =>
  modal.classList.add("hidden");

modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let snake = [{x:10,y:10}];
let dir = {x:1,y:0};
let food = {x:5,y:5};

function draw(){
  ctx.fillStyle = "#0a0f16";
  ctx.fillRect(0,0,420,420);

  ctx.fillStyle = "#ffb000";
  ctx.fillRect(food.x*20, food.y*20, 20, 20);

  ctx.fillStyle = "#40c9ff";
  snake.forEach(s => ctx.fillRect(s.x*20, s.y*20, 20, 20));
}

function step(){
  const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
  snake.unshift(head);
  snake.pop();
  draw();
}

setInterval(step, 150);

document.addEventListener("keydown", e => {
  if(e.key === "ArrowUp") dir={x:0,y:-1};
  if(e.key === "ArrowDown") dir={x:0,y:1};
  if(e.key === "ArrowLeft") dir={x:-1,y:0};
  if(e.key === "ArrowRight") dir={x:1,y:0};
});
