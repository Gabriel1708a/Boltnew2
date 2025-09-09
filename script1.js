let jogos = [];
let dadosCarregados = false;
let layoutCriado = false;

// ==================== MODAL DE TERMOS ====================
function verificarModal() {
  const naoMostrar = localStorage.getItem("naoMostrarTermos");
  if (!naoMostrar) {
    document.getElementById("modal").style.display = "block";
  }

  document.getElementById("close-btn").onclick = function () {
    if (document.getElementById("naoMostrarCheckbox").checked) {
      localStorage.setItem("naoMostrarTermos", "true");
    }
    document.getElementById("modal").style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == document.getElementById("modal")) {
      if (document.getElementById("naoMostrarCheckbox").checked) {
        localStorage.setItem("naoMostrarTermos", "true");
      }
      document.getElementById("modal").style.display = "none";
    }
  };
}

// ==================== CARROSSEL ====================
function iniciarCarrossel() {
  let currentIndex = 0;
  const slides = document.querySelectorAll("#carrossel .slide");
  const totalSlides = slides.length;

  setInterval(() => {
    slides[currentIndex].classList.remove("active");
    slides[currentIndex].classList.add("prev");
    currentIndex = (currentIndex + 1) % totalSlides;
    slides[currentIndex].classList.remove("next");
    slides[currentIndex].classList.add("active");
    resetNextPrevClasses(slides, currentIndex, totalSlides);
  }, 4000);
}

function resetNextPrevClasses(slides, currentIndex, totalSlides) {
  slides.forEach((slide, index) => {
    if (index === (currentIndex + 1) % totalSlides) {
      slide.classList.remove("prev");
      slide.classList.add("next");
    } else if (index === (currentIndex - 1 + totalSlides) % totalSlides) {
      slide.classList.remove("next");
      slide.classList.add("prev");
    } else {
      slide.classList.remove("next", "prev");
    }
  });
}

// ==================== BITCOIN ====================
async function fetchBitcoinStatus() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=bitcoin");
    const data = await response.json();
    const bitcoin = data[0];
    const priceChange = bitcoin.price_change_percentage_24h;
    const currentPrice = bitcoin.current_price;

    const statusElement = document.getElementById("status");
    const priceElement = document.getElementById("price");

    if (priceChange >= 0) {
      statusElement.textContent = "Bitcoin em alta!";
      statusElement.className = "up";
      priceElement.textContent = currentPrice.toFixed(2).replace(".", ",");
      priceElement.className = "up";
    } else {
      statusElement.textContent = "Bitcoin em queda!";
      statusElement.className = "down";
      priceElement.textContent = currentPrice.toFixed(2).replace(".", ",");
      priceElement.className = "down";
    }
  } catch (error) {
    console.error("Erro ao buscar dados do Bitcoin:", error);
  }
}

// ==================== PORCENTAGENS E MINUTOS PAGANTES ====================
function getRandomPercentage() {
  return Math.floor(Math.random() * (97 - 30 + 1)) + 30;
}

function getColor(percentage) {
  if (percentage <= 35) return "red";
  if (percentage <= 45) return "orange";
  if (percentage <= 55) return "#d1b30b";
  if (percentage <= 60) return "#aaa810";
  if (percentage <= 80) return "#5ba000";
  return "green";
}

function getCurrentTimeKey() {
  const now = new Date();
  const roundedMinutes = Math.floor(now.getMinutes() / 10) * 10;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now.toISOString();
}

function updateProgressBars() {
  const timeKey = getCurrentTimeKey();
  if (
    localStorage.getItem(`progressBars_index1_${timeKey}`) &&
    localStorage.getItem(`progressBars_index2_${timeKey}`) &&
    localStorage.getItem(`progressBars_index3_${timeKey}`)
  ) return;

  const data1 = {}, data2 = {}, data3 = {};
  jogos.forEach(jogo => {
    data1[jogo.id] = getRandomPercentage();
    data2[jogo.id] = getRandomPercentage();
    data3[jogo.id] = getRandomPercentage();
  });

  localStorage.setItem(`progressBars_index1_${timeKey}`, JSON.stringify(data1));
  localStorage.setItem(`progressBars_index2_${timeKey}`, JSON.stringify(data2));
  localStorage.setItem(`progressBars_index3_${timeKey}`, JSON.stringify(data3));
}

function applyStoredPercentages() {
  const timeKey = getCurrentTimeKey();
  const data1 = JSON.parse(localStorage.getItem(`progressBars_index1_${timeKey}`)) || {};
  const data2 = JSON.parse(localStorage.getItem(`progressBars_index2_${timeKey}`)) || {};
  const data3 = JSON.parse(localStorage.getItem(`progressBars_index3_${timeKey}`)) || {};

  jogos.forEach(jogo => {
    updateBar(`bar${jogo.id}`, data1[jogo.id] || getRandomPercentage());
    updateBar(`bar${jogo.id}_2`, data2[jogo.id] || getRandomPercentage());
    updateBar(`bar${jogo.id}_3`, data3[jogo.id] || getRandomPercentage());
  });
}

function updateBar(id, percentage) {
  const bar = document.getElementById(id);
  if (bar) {
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = getColor(percentage);
    bar.textContent = `${percentage}%`;
  }
}

function getRandomNumbers() {
  const numbers = new Set();
  while (numbers.size < 3) {
    numbers.add(Math.floor(Math.random() * 10));
  }
  return [...numbers].sort((a, b) => a - b).join(", ");
}

function updateMinPagantesWithTimestamp() {
  const timeKey = getCurrentTimeKey();
  document.querySelectorAll(".square-container").forEach((container, index) => {
    const key = `minPagantes_${index}_${timeKey}`;
    const alreadyExists = localStorage.getItem(key);

    let minPagantesDiv = container.querySelector(".min-pagantes");
    if (!minPagantesDiv) {
      minPagantesDiv = document.createElement("div");
      minPagantesDiv.className = "min-pagantes";
      container.appendChild(minPagantesDiv);
    }

    if (alreadyExists) {
      minPagantesDiv.textContent = `Min Pagantes: ${alreadyExists}`;
    } else {
      const newNumbers = getRandomNumbers();
      minPagantesDiv.textContent = `Min Pagantes: ${newNumbers}`;
      localStorage.setItem(key, newNumbers);
    }
  });
}

// ==================== CONTADOR REGRESSIVO ====================
function iniciarContadorRegressivo() {
  const timerElement = document.getElementById("timer");
  if (!timerElement) return;

  function atualizarTimer() {
    const now = new Date();
    const proximoMultiplo = new Date(now);
    let minutos = now.getMinutes();
    let proximoMinutoMultiplo = minutos - (minutos % 10) + 10;
    if (proximoMinutoMultiplo === 60) {
      proximoMultiplo.setHours(proximoMultiplo.getHours() + 1);
      proximoMinutoMultiplo = 0;
    }
    proximoMultiplo.setMinutes(proximoMinutoMultiplo);
    proximoMultiplo.setSeconds(0);
    proximoMultiplo.setMilliseconds(0);

    const diffMs = proximoMultiplo - now;
    const diffMin = Math.floor(diffMs / 60000);
    const diffSec = Math.floor((diffMs % 60000) / 1000);
    timerElement.textContent = `${String(diffMin).padStart(2, "0")}:${String(diffSec).padStart(2, "0")}`;

    if (diffMs <= 1000 && !window._atualizou) {
      window._atualizou = true;

      setTimeout(() => {
        updateProgressBars();
        applyStoredPercentages();
        updateMinPagantesWithTimestamp();
        window._atualizou = false;
      }, 1000);
    }
  }

  atualizarTimer();
  setInterval(atualizarTimer, 1000);
}

// ============== rolagem ate o final ======================
document.getElementById("scrollBtn").addEventListener("click", function () {
    const section = document.getElementById("como-jogar");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
});




// ==================== LAYOUT E INICIALIZAÇÃO ====================
function criarLayoutDinamico() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  jogos.forEach((jogo) => {
    const html = `
      <div class="square-container">
        <div class="square"><img src="${jogo.imagem}" alt="Jogo ${jogo.id}"></div>
        <div class="progress-bar-container">
          <p>Aposta Padrão</p>
          <div class="progress-bar" id="bar${jogo.id}"></div>
        </div>
        <div class="progress-bar-container">
          <p>Aposta Mínima</p>
          <div class="progress-bar" id="bar${jogo.id}_2"></div>
        </div>
        <div class="progress-bar-container">
          <p>Aposta Máxima</p>
          <div class="progress-bar" id="bar${jogo.id}_3"></div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
  });

  layoutCriado = true;
  updateProgressBars();
  applyStoredPercentages();
  updateMinPagantesWithTimestamp();
}

document.addEventListener("DOMContentLoaded", () => {
  verificarModal();
  iniciarCarrossel();
  fetchBitcoinStatus();
  setInterval(fetchBitcoinStatus, 30000);
  iniciarContadorRegressivo();

  fetch("pg.json")
    .then((response) => response.json())
    .then((data) => {
      jogos = data;
      dadosCarregados = true;
      criarLayoutDinamico();
    })
    .catch((error) => console.error("Erro ao carregar jogos:", error));
});
