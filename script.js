// ==========================================
// 1. SEMÁFORO EMOCIONAL
// ==========================================
function setSemaphore(color) {
  const resultDiv = document.getElementById('sem-result');
  resultDiv.style.display = 'block';

  if (color === 'green') {
    resultDiv.style.borderLeftColor = '#10b981';
    resultDiv.innerHTML = "<strong>Estado: Estable</strong><br>¡Nos alegra que tengas un buen día! Recuerda ser apoyo o escuchar a un compañero que pueda necesitarlo hoy.";
  } else if (color === 'yellow') {
    resultDiv.style.borderLeftColor = '#f59e0b';
    resultDiv.innerHTML = "<strong>Estado: En Pausa</strong><br>Está bien sentirse abrumado a veces. Tómate 5 minutos para respirar profundo, tomar agua y resolver una sola cosa a la vez.";
  } else if (color === 'red') {
    resultDiv.style.borderLeftColor = '#ef4444';
    resultDiv.innerHTML = "<strong>Estado: Alerta de Sobrecarga</strong><br>No tienes que cargar todo a solas. Recuerda que puedes escribir en el Buzón Anónimo o hacer clic en el botón de abajo para hablar con un líder en privado.";
  }
}

// ==========================================
// 2. PROMESA / AFIRMACIÓN DEL DÍA
// ==========================================
const promises = [
  "\"No te impacientes por el mañana; cada día trae sus propios retos y sus propias fortalezas.\"",
  "\"Tu valor no está determinado por tus notas ni por la aprobación de los demás.\"",
  "\"Pedir ayuda no es síntoma de debilidad, sino el primer paso para fortalecerte.\"",
  "\"Aun en medio del caos, siempre hay espacio para empezar de nuevo con tranquilidad.\"",
  "\"Nunca estás solo/a. Hay un equipo y una comunidad dispuesta a caminar contigo.\""
];

function generatePromise() {
  const textElem = document.getElementById('promise-text');
  const randomIndex = Math.floor(Math.random() * promises.length);
  textElem.textContent = promises[randomIndex];
}

// ==========================================
// 3. QUIZ DIAGNÓSTICO
// ==========================================
const questions = [
  {
    q: "1/4. ¿Qué ocurre cuando te enfrentas a semanas de alta presión escolar?",
    options: [
      { text: "Mi mente se paraliza pensando en lo que saldrá mal.", category: "Ansiedad" },
      { text: "Me irrito fácilmente con la gente a mi alrededor.", category: "Estrés/Irritabilidad" },
      { text: "Hago una pausa, me organizo y voy paso a paso.", category: "Sistema Estable" }
    ]
  },
  {
    q: "2/4. ¿Cómo reaccionas cuando sientes un vacío o desánimo?",
    options: [
      { text: "Me aislo y finjo que todo está perfecto.", category: "Aislamiento" },
      { text: "Siento cansancio extremo y pierdo el interés.", category: "Desánimo" },
      { text: "Busco a alguien de confianza para desahogarme.", category: "Sistema Estable" }
    ]
  },
  {
    q: "3/4. En tus relaciones de amistad o pares, ¿cuál es tu mayor reto?",
    options: [
      { text: "Cambio mi forma de ser para encajar.", category: "Dependencia" },
      { text: "Me cuesta confiar y pongo barreras por miedo.", category: "Miedo al Rechazo" },
      { text: "Mantengo mis límites y valoro quién soy.", category: "Sistema Estable" }
    ]
  },
  {
    q: "4/4. Cuando un proyecto no sale como esperabas...",
    options: [
      { text: "Me frustro rápido y lo abandono todo.", category: "Frustración" },
      { text: "Sufro por no cumplir con mis altas expectativas.", category: "Expectativas" },
      { text: "Ajusto el plan y sigo adelante con paciencia.", category: "Sistema Estable" }
    ]
  }
];

let currentQ = 0;
let userAnswers = [];

const qText = document.getElementById('question-text');
const optsContainer = document.getElementById('options-container');
const resultBox = document.getElementById('result-box');
const resultText = document.getElementById('result-text');

function loadQuestion() {
  if (currentQ < questions.length) {
    qText.textContent = questions[currentQ].q;
    optsContainer.innerHTML = '';
    questions[currentQ].options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-pill';
      btn.textContent = "● " + opt.text;
      btn.onclick = () => selectOption(opt.category);
      optsContainer.appendChild(btn);
    });
  } else {
    showResults();
  }
}

function selectOption(category) {
  userAnswers.push(category);
  currentQ++;
  loadQuestion();
}

function showResults() {
  document.getElementById('quiz-box').style.display = 'none';
  resultBox.style.display = 'block';

  const counts = {};
  userAnswers.forEach(cat => counts[cat] = (counts[cat] || 0) + 1);
  const topCategory = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

  let advice = "";
  if (topCategory === "Ansiedad" || topCategory === "Estrés/Irritabilidad") {
    advice = "SISTEMA EN SOBRECARGA: Tu recomendación es enfocar la atención en el presente. Suelta la presión del futuro y resuelve solo lo de hoy.";
  } else if (topCategory === "Aislamiento" || topCategory === "Desánimo") {
    advice = "SISTEMA EN DESÁNIMO: Tu recomendación es romper el aislamiento. Expresar lo que sientes reduce la carga emocional.";
  } else if (topCategory === "Dependencia" || topCategory === "Miedo al Rechazo") {
    advice = "SISTEMA EN BÚSQUEDA DE AFECTO: Tu recomendación es fortalecer tu identidad. Tu valor no depende de la aprobación ajena.";
  } else {
    advice = "SISTEMA EN BALANCE: Cuentas con herramientas saludables de autorregulación. Sigue manteniendo tus principios firmes.";
  }

  resultText.textContent = advice;
  sendDataToSheet({ type: 'QUIZ', result: topCategory, details: userAnswers.join(', ') });
}

loadQuestion();

// ==========================================
// 4. ENVÍO DE BUZÓN ANÓNIMO
// ==========================================
const bugForm = document.getElementById('bug-form');
const formStatus = document.getElementById('form-status');

bugForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const category = document.getElementById('bug-category').value;
  const message = document.getElementById('bug-text').value;

  sendDataToSheet({ type: 'BUG_ANONIMO', category: category, message: message });

  bugForm.reset();
  formStatus.style.display = 'block';
  setTimeout(() => formStatus.style.display = 'none', 4000);
});

// ==========================================
// 5. CONEXIÓN CON GOOGLE SHEETS
// ==========================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwtI5DD7mATexJ-NGEnws3aVBIGesJY6r0iFPxVrkPpRuYmFESJWcSEmk-5iWKb5Cyj/exec';
function sendDataToSheet(data) {
  if (GOOGLE_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbx1SNZGMeqyOUrSmW4zsX0gQUqYejG5n43dCsjmvq5XGX5ym_6p4sUoOcyymfA4jQXV/exec') return;

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(err => console.error("Error al enviar:", err));
}
// ================================
// LÓGICA DE MODALES Y CHALLENGES
// ================================

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function closeModalOnOverlay(e, id) {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(id);
  }
}

// Lista de datos curiosos para el botón "Sabías Que..."
const sabiasQueFacts = [
  "Aroma y memoria: Si usas un perfume o aroma específico (como menta o lavanda) mientras estudias y lo vuelves a oler en el examen, recordarás los datos más rápido.",
  " Tomar notas a mano activa zonas del cerebro de comprensión profunda, mientras que teclear en computadora suele ser una copia mecánica.",
  "Efecto Zeigarnik: La mente odia tareas inconclusas. Si te obligas a trabajar solo 2 minutos en algo difícil, tu cerebro querrá continuarlo hasta terminar.",
  " Mientras duermes, tu cerebro se 'lava' con líquido cefalorraquídeo para fijar lo aprendido durante el día en la memoria a largo plazo.",
  " Decirte 'estoy emocionado' en lugar de 'estoy nervioso' engaña a tu cerebro para transformar la ansiedad en energía positiva antes de exponer.",
  " Escuchar música con letra mientras lees interfiere con el área de lenguaje de tu cerebro, dificultando la concentración.",
  "Estar levemente deshidratado (solo un 2%) reduce drásticamente tu velocidad de procesamiento mental y atención.",
  "Mirar imágenes de naturaleza o plantas durante 5 minutos reduce los niveles de cortisol (estrés) hasta en un 20%."
];

function randomizeFact() {
  const factEl = document.getElementById('fact-prompt');
  const randomIndex = Math.floor(Math.random() * sabiasQueFacts.length);
  if (factEl) {
    factEl.textContent = sabiasQueFacts[randomIndex];
  }
}

// Envío del Foro a tu Google Sheet
function submitForum(e) {
  e.preventDefault();
  const name = document.getElementById('forum-name').value || 'Anónimo';
  const message = document.getElementById('forum-msg').value;

  // Usa la misma función de envío a Google Sheets que probamos antes
  sendDataToSheet({
    type: 'BUG_ANONIMO',
    category: `FORO (${name})`,
    message: message
  });

  document.getElementById('forum-form').reset();
  const status = document.getElementById('forum-status');
  if (status) {
    status.style.display = 'block';
    setTimeout(() => {
      status.style.display = 'none';
      closeModal('modal-eventos');
    }, 2500);
  }
}