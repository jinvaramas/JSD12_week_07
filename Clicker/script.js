let popcorn  = 0;   
let machines = 0;   
let cpc      = 1;   
let cps      = 0;

const upgrades = [
  { name: 'ถุงใหญ่',    cost: 50,   bonus: 1,  req: 1,  bought: false },
  { name: 'เตาร้อน',    cost: 200,  bonus: 3,  req: 5,  bought: false },
  { name: 'โรงงานป๊อป', cost: 1000, bonus: 10, req: 10, bought: false },
];

const countEl   = document.getElementById('count');
const cpsEl     = document.getElementById('cps');
const cpcEl     = document.getElementById('cpc');
const popcornBtn = document.getElementById('popcorn-btn');
const buyBtn    = document.getElementById('buy-btn');
const buyCostEl = document.getElementById('buy-cost');
const upgradeList = document.getElementById('upgrade-list');

const popSound = new Audio('pop.wav');
popSound.volume = 0.5;
function playPop() {
    const soundClone = popSound.cloneNode();
    soundClone.play();
}

const buySound = new Audio('buy.wav');
buySound.volume = 0.5;
function playBuy() {
    const soundClone = buySound.cloneNode();
    soundClone.play();
}

popcornBtn.addEventListener('click', function(e) {
  popcorn += cpc;
  playPop();
  spawnParticles(e.clientX, e.clientY);
  updateUI();
});

function spawnParticles(x, y) {
  var count = 5 + Math.floor(Math.random() * 4);
  for (var i = 0; i < count; i++) {
    var el = document.createElement('span');
    el.className = 'pop-particle';
    el.textContent = '🍿';
    var angle = Math.random() * Math.PI * 2;
    var dist = 60 + Math.random() * 80;
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle) * dist - 60 + 'px');
    document.body.appendChild(el);
    el.addEventListener('animationend', function() { this.remove(); });
  }
}

buyBtn.addEventListener('click', function() {
  var cost = getMachineCost();
  if (popcorn < cost) return; 

  popcorn -= cost;
  machines++;
  cps += 0.5;
  playBuy();
  updateUI();
  showUpgrades();
});

function getMachineCost() {
  return Math.floor(15 * Math.pow(1.15, machines));
}
function updateUI() {
  var cost = getMachineCost();

  countEl.textContent   = Math.floor(popcorn) + ' 🍿';
  cpsEl.textContent     = '⚡ ' + cps.toFixed(1) + ' /sec';
  cpcEl.textContent     = '👆 ' + cpc + ' /click';
  buyCostEl.textContent = cost + ' 🍿';

  buyBtn.disabled = popcorn < cost;
}

function showUpgrades() {
  upgradeList.innerHTML = '';

  upgrades.forEach(function(up) {
    if (machines < up.req) return;

    var card = document.createElement('div');
    card.className = up.bought ? 'upgrade-card owned' : 'upgrade-card';

    card.innerHTML =
      '<span>' + up.name + '</span>' +
      '<span>+' + up.bonus + ' คลิก</span>' +
      '<span>' + (up.bought ? '✅' : up.cost + ' 🍿') + '</span>';

    if (!up.bought) {
      card.addEventListener('click', function() {
        buyUpgrade(up);
      });
    }

    upgradeList.appendChild(card);
  });
}

function buyUpgrade(up) {
  if (popcorn < up.cost) return; 
  popcorn -= up.cost;
  up.bought = true;
  cpc += up.bonus;
  playBuy();
  updateUI();
  showUpgrades();
}
setInterval(function() {
  popcorn += cps;
  updateUI();
}, 1000);

updateUI();
showUpgrades();