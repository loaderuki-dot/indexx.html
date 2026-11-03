document.addEventListener('DOMContentLoaded', () => {
  // 1. Dinamik Darslar ro'yxati va holatini saqlash (LocalStorage)
  const lessons = [
    { id: 1, title: "1-Dars: HTML va veb-sahifa asosi", desc: "Veb sahifaning skeletini yaratishni o'rganamiz." },
    { id: 2, title: "2-Dars: CSS bilan bezash", desc: "Ranglar, shriftlar va elementlarni joylashtirish." },
    { id: 3, title: "3-Dars: JavaScript asoslari", desc: "Saytga jon kiritish va mantiqiy amallar." }
  ];

  const lessonsContainer = document.getElementById('lessonsContainer');
  const savedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];

  function renderLessons() {
    lessonsContainer.innerHTML = '';
    lessons.forEach(lesson => {
      const isCompleted = savedLessons.includes(lesson.id);
      const card = document.createElement('div');
      card.className = 'step-card';
      card.innerHTML = `
        <h3>${lesson.title}</h3>
        <p>${lesson.desc}</p>
        <button class="btn ${isCompleted ? 'secondary' : 'primary'}" onclick="toggleLesson(${lesson.id})" style="margin-top: 15px;">
          ${isCompleted ? '✓ Ko\'rilgan' : 'Ko\'rdim deb belgilash'}
        </button>
      `;
      lessonsContainer.appendChild(card);
    });
  }

  window.toggleLesson = function(id) {
    const index = savedLessons.indexOf(id);
    if (index > -1) {
      savedLessons.splice(index, 1);
    } else {
      savedLessons.push(id);
    }
    localStorage.setItem('completedLessons', JSON.stringify(savedLessons));
    renderLessons();
  };

  renderLessons();

  // 2. Kunlik Maqsadlar (Goals)
  const goalInput = document.getElementById('goalInput');
  const addGoalBtn = document.getElementById('addGoalBtn');
  const goalsList = document.getElementById('goalsList');
  let goals = JSON.parse(localStorage.getItem('dailyGoals')) || [];

  function renderGoals() {
    goalsList.innerHTML = '';
    goals.forEach((goal, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${goal}</span>
        <button class="btn secondary" onclick="deleteGoal(${index})" style="padding: 5px 10px; font-size: 0.8rem;">O'chirish</button>
      `;
      goalsList.appendChild(li);
    });
  }

  addGoalBtn.addEventListener('click', () => {
    const text = goalInput.value.trim();
    if (text) {
      goals.push(text);
      localStorage.setItem('dailyGoals', JSON.stringify(goals));
      goalInput.value = '';
      renderGoals();
    }
  });

  window.deleteGoal = function(index) {
    goals.splice(index, 1);
    localStorage.setItem('dailyGoals', JSON.stringify(goals));
    renderGoals();
  };

  renderGoals();

  // 3. Fokus Taymeri (Pomodoro)
  let timerInterval = null;
  let timeLeft = 25 * 60;
  const timerDisplay = document.getElementById('timerDisplay');
  const startTimerBtn = document.getElementById('startTimer');
  const pauseTimerBtn = document.getElementById('pauseTimer');
  const resetTimerBtn = document.getElementById('resetTimer');
  const timerStatus = document.getElementById('timerStatus');

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  startTimerBtn.addEventListener('click', () => {
    if (timerInterval) return;
    timerStatus.textContent = "Ishlash vaqti! Diqqatingizni jamlang.";
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        timerStatus.textContent = "Vaqt tugadi! Dam oling.";
      }
    }, 1000);
  });

  pauseTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStatus.textContent = "Taymer to'xtatildi.";
  });

  resetTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
    timerStatus.textContent = "Tayyormisan?";
  });

  updateTimerDisplay();
});
