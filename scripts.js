let xp = 0;
let level = 1;

function updateStats() {
    document.getElementById('xp-count').innerText = xp;
    document.getElementById('level-count').innerText = level;
}

function startCategory(cat) {
    alert(cat.toUpperCase() + " kategoriyasi bo'yicha test tanlandi!");
}
