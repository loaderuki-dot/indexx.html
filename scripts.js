document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Live Clock & Activity Tracking
  const liveClock = document.getElementById('liveClock');
  const lastActiveBadge = document.getElementById('lastActiveBadge');

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    liveClock.textContent = `${hours}:${minutes}:${seconds}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  function recordActivity() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    localStorage.setItem('lastActiveTime', timeString);
    if (lastActiveBadge) {
      lastActiveBadge.textContent = `Aktivlik: Kirilgan ${timeString}`;
    }
  }

  // 2. Authentication System (Login/Register)
  const authModal = document.getElementById('authModal');
  const authForm = document.getElementById('authForm');
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const authToggleBtn = document.getElementById('authToggleBtn');
  const authToggleQuestion = document.getElementById('authToggleQuestion');
  const userProfile = document.getElementById('userProfile');
  const userDisplayName = document.getElementById('userDisplayName');
  const logoutBtn = document.getElementById('logoutBtn');

  let isLoginState = true; // true = Login mode, false = Register mode

  function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const lastTime = localStorage.getItem('lastActiveTime');

    if (currentUser) {
      authModal.classList.add('hidden');
      userProfile.classList.remove('hidden');
      userDisplayName.textContent = currentUser.username;
      if (lastTime) {
        lastActiveBadge.textContent = `Aktivlik: Kirilgan ${lastTime}`;
      } else {
        recordActivity();
      }
    } else {
      authModal.classList.remove('hidden');
      userProfile.classList.add('hidden');
      lastActiveBadge.textContent = 'Aktivlik: Kirilmagan';
    }
  }

  authToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginState = !isLoginState;
    if (isLoginState) {
      authTitle.textContent = "Tizimga Kirish";
      authSubtitle.textContent = "Davom etish uchun akkountingizga kiring";
      authSubmitBtn.textContent = "Kirish";
      authToggleQuestion.textContent = "Akkountingiz yo'qmi?";
      authToggleBtn.textContent = "Ro'yxatdan o'tish";
    } else {
      authTitle.textContent = "Ro'yxatdan O'tish";
      authSubtitle.textContent = "Yangi akkaunt yarating va o'rganishni boshlang";
      authSubmitBtn.textContent = "Yaratish";
      authToggleQuestion.textContent = "Akkountingiz bormi?";
      authToggleBtn.textContent = "Tizimga kirish";
    }
  });

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) return alert("Iltimos barcha maydonlarni to'ldiring!");

    let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    if (isLoginState) {
      // Login Logic
      const foundUser = users.find(u => u.username === username && u.password === password);
      if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify({ username: foundUser.username }));
        recordActivity();
        checkAuth();
      } else {
        alert("Xato login yoki parol!");
      }
    } else {
      // Register Logic
      const userExists = users.some(u => u.username === username);
      if (userExists) {
        alert("Bu foydalanuvchi nomi allaqachon mavjud!");
        return;
      }
      users.push({ username, password });
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ username }));
      recordActivity();
      checkAuth();
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    checkAuth();
  });

  checkAuth();

  // 3. Dinamik Darslar
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

  // 4. Maqsadlar Ro'yxati (Daily Goals)
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

  // 5. Fokus Taymeri (Pomodoro)
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
