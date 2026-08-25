// タウンDELUXE UI描画・イベント処理

const UI = (() => {
  let qty = 1;
  let activeTab = 'build';

  function $(id) { return document.getElementById(id); }

  function init() {
    $('version-label').textContent = VERSION;
    bindTabs();
    bindQty();
    bindTownHall();
    bindGolden();
    bindUfo();
    bindFooter();
    renderSky();
    renderClouds();
    Game.on('tick', onTick);
    Game.on('buy', onBuy);
    Game.on('achievement', onAchievement);
    Game.on('prestige', onPrestige);
    Game.on('event', onEvent);
    renderAll();
    setInterval(renderSky, 5000);
  }

  function bindTabs() {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach((c) => c.classList.add('hidden'));
        btn.classList.add('active');
        activeTab = btn.dataset.tab;
        $(`tab-${activeTab}`).classList.remove('hidden');
        $('buy-qty').classList.toggle('hidden', activeTab !== 'build');
        renderAll();
      });
    });
  }

  function bindQty() {
    document.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.qty-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        qty = btn.dataset.qty === 'max' ? 'max' : parseInt(btn.dataset.qty, 10);
        renderBuild();
      });
    });
  }

  let comboHideTimer = null;
  function bindTownHall() {
    const hall = $('town-hall');
    hall.addEventListener('click', (e) => {
      const result = Game.manualClick();
      hall.classList.remove('bump');
      void hall.offsetWidth;
      hall.classList.add('bump');
      const rect = hall.getBoundingClientRect();
      Effects.floatText(rect.left + rect.width / 2 + (Math.random() * 30 - 15), rect.top, `+${formatNum(result.gain)}`, '#ffd93d', 20 + Math.min(10, result.combo / 5));
      Effects.confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
      if (result.combo > 0 && result.combo % 10 === 0) {
        const combo = $('combo-display');
        combo.textContent = `🔥 コンボ x${result.comboMult.toFixed(1)}!`;
        combo.classList.remove('hidden');
        combo.classList.remove('pop');
        void combo.offsetWidth;
        combo.classList.add('pop');
        Effects.sound('golden');
        clearTimeout(comboHideTimer);
        comboHideTimer = setTimeout(() => combo.classList.add('hidden'), 2500);
      }
      updateTopbar();
    });
  }

  function bindGolden() {
    $('golden-building').addEventListener('click', () => {
      const reward = Game.clickGolden();
      if (reward) {
        const el = $('golden-building');
        const rect = el.getBoundingClientRect();
        Effects.floatText(rect.left + rect.width / 2, rect.top, `✨+${formatNum(reward)}`, '#ffdf5c', 26);
        Effects.confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);
        Effects.screenShake(10, 350);
        Effects.toast(`ゴールデンビルで ${formatNum(reward)}円 獲得!`, '✨');
        el.classList.add('hidden');
      }
    });
  }

  function bindUfo() {
    $('ufo').addEventListener('click', () => {
      const reward = Game.clickUfo();
      if (reward) {
        const el = $('ufo');
        const rect = el.getBoundingClientRect();
        Effects.floatText(rect.left + rect.width / 2, rect.top, `🛸+${formatNum(reward)}`, '#8affc1', 22);
        Effects.confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
        Effects.toast(`UFOが資金を落としていった! +${formatNum(reward)}円`, '🛸');
        el.classList.add('hidden');
      }
    });
  }

  function bindFooter() {
    $('mute-btn').addEventListener('click', () => {
      const muted = Game.toggleMute();
      $('mute-btn').textContent = muted ? '🔇' : '🔊';
    });
    $('save-btn').addEventListener('click', () => {
      Game.saveNow();
      Effects.toast('セーブしました', '💾');
    });
    $('reset-btn').addEventListener('click', () => {
      showConfirm('本当にリセットしますか?これまでの進行状況・実績が全て消えます。', () => {
        Game.doReset();
        location.reload();
      });
    });
    $('changelog-btn').addEventListener('click', showChangelog);
  }

  function showConfirm(message, onYes) {
    const modal = $('confirm-modal');
    modal.innerHTML = `
      <div class="modal-box">
        <p>${message}</p>
        <div class="modal-actions">
          <button id="confirm-yes" class="danger-btn">はい</button>
          <button id="confirm-no">いいえ</button>
        </div>
      </div>`;
    modal.classList.remove('hidden');
    $('confirm-yes').addEventListener('click', () => { modal.classList.add('hidden'); onYes(); });
    $('confirm-no').addEventListener('click', () => modal.classList.add('hidden'));
  }

  function showChangelog() {
    const modal = $('changelog-modal');
    const html = CHANGELOG.map((c) => `
      <div class="changelog-entry">
        <h3>v${c.version} <small>${c.date}</small></h3>
        <ul>${c.notes.map((n) => `<li>${n}</li>`).join('')}</ul>
      </div>`).join('');
    modal.innerHTML = `<div class="modal-box"><h2>📜 更新履歴</h2>${html}<div class="modal-actions"><button id="cl-close">閉じる</button></div></div>`;
    modal.classList.remove('hidden');
    $('cl-close').addEventListener('click', () => modal.classList.add('hidden'));
  }

  // --- 描画 ---
  function renderAll() {
    updateTopbar();
    renderBuild();
    renderUpgrades();
    renderAchievements();
    renderStats();
    renderPrestige();
    renderBuildingsLayer();
  }

  function updateTopbar() {
    const s = Game.getState();
    $('stat-money').textContent = formatNum(s.money) + '円';
    $('stat-income').textContent = formatNum(Game.incomePerSec()) + '円/秒';
    $('stat-pop').textContent = formatNum(s.population) + '人';
    $('stat-happiness').textContent = Math.round(s.happiness) + '%';
    $('stat-fame').textContent = s.famePoints;
    $('stat-fame-wrap').classList.toggle('hidden', s.famePoints === 0 && Game.potentialFame() === 0);
  }

  function renderBuild() {
    const s = Game.getState();
    const el = $('tab-build');
    el.innerHTML = '';
    BUILDINGS.forEach((b) => {
      const count = Game.buildingCount(b.id);
      const cost = buildingCost(b, count, qty === 'max' ? Math.max(1, maxAffordable(b, count, s.money)) : qty);
      const affordable = s.money >= cost;
      const card = document.createElement('div');
      card.className = 'card' + (affordable ? '' : ' disabled');
      const perEach = b.baseIncome * Game.buildingMultiplier(b.id) * Game.globalMultiplier();
      card.innerHTML = `
        <div class="card-icon">${b.emoji}</div>
        <div class="card-body">
          <div class="card-title">${b.name} <span class="card-count">×${count}</span></div>
          <div class="card-desc">${b.desc}</div>
          <div class="card-sub">${formatNum(perEach)}円/秒・個</div>
        </div>
        <button class="buy-btn" ${affordable ? '' : 'disabled'}>${formatNum(cost)}円</button>
      `;
      card.querySelector('.buy-btn').addEventListener('click', () => {
        if (Game.buyBuilding(b.id, qty)) {
          card.classList.add('pulse');
          setTimeout(() => card.classList.remove('pulse'), 300);
        }
      });
      el.appendChild(card);
    });
  }

  function renderUpgrades() {
    const s = Game.getState();
    const el = $('tab-upgrade');
    el.innerHTML = '';
    const unlocked = UPGRADES.filter((u) => Game.isUpgradeUnlocked(u) && !s.upgrades.includes(u.id));
    const locked = UPGRADES.filter((u) => !Game.isUpgradeUnlocked(u) && !s.upgrades.includes(u.id));
    if (unlocked.length === 0 && locked.length === 0) {
      el.innerHTML = '<p class="empty">全てのアップグレードを取得しました!すごい!</p>';
      return;
    }
    unlocked.sort((a, b) => a.cost - b.cost).forEach((u) => el.appendChild(upgradeCard(u, true)));
    locked.slice(0, 6).forEach((u) => el.appendChild(upgradeCard(u, false)));
  }

  function upgradeCard(u, unlocked) {
    const s = Game.getState();
    const affordable = unlocked && s.money >= u.cost;
    const card = document.createElement('div');
    card.className = 'card upgrade-card' + (unlocked ? (affordable ? '' : ' disabled') : ' locked');
    card.innerHTML = `
      <div class="card-body">
        <div class="card-title">${unlocked ? u.name : '🔒 ？？？'}</div>
        <div class="card-desc">${unlocked ? u.desc : 'まだ解放されていません'}</div>
      </div>
      ${unlocked ? `<button class="buy-btn" ${affordable ? '' : 'disabled'}>${formatNum(u.cost)}円</button>` : ''}
    `;
    if (unlocked) {
      card.querySelector('.buy-btn').addEventListener('click', () => {
        if (Game.buyUpgrade(u.id)) {
          Effects.toast(`${u.name} を取得!`, '⚡');
          renderUpgrades();
        }
      });
    }
    return card;
  }

  function renderAchievements() {
    const s = Game.getState();
    const el = $('tab-achievement');
    const unlockedCount = s.achievements.length;
    el.innerHTML = `<div class="ach-summary">達成 ${unlockedCount} / ${ACHIEVEMENTS.length}</div><div class="ach-grid"></div>`;
    const grid = el.querySelector('.ach-grid');
    ACHIEVEMENTS.forEach((a) => {
      const unlocked = s.achievements.includes(a.id);
      const badge = document.createElement('div');
      badge.className = 'ach-badge' + (unlocked ? ' unlocked' : '');
      badge.title = unlocked ? a.desc : '???';
      badge.innerHTML = `<div class="ach-name">${unlocked ? a.name : '🔒'}</div>${unlocked ? `<div class="ach-desc">${a.desc}</div>` : ''}`;
      grid.appendChild(badge);
    });
  }

  function renderStats() {
    const s = Game.getState();
    const el = $('tab-stats');
    const hrs = Math.floor(s.playtime / 3600);
    const mins = Math.floor((s.playtime % 3600) / 60);
    el.innerHTML = `
      <div class="stats-grid">
        <div class="stats-item"><span>累計獲得資金</span><b>${formatNum(s.lifetimeMoney)}円</b></div>
        <div class="stats-item"><span>現在の人口</span><b>${formatNum(s.population)}人</b></div>
        <div class="stats-item"><span>幸福度</span><b>${Math.round(s.happiness)}%</b></div>
        <div class="stats-item"><span>クリック回数</span><b>${s.totalClicks.toLocaleString()}回</b></div>
        <div class="stats-item"><span>ゴールデンビル獲得</span><b>${s.goldenClicks}回</b></div>
        <div class="stats-item"><span>UFO遭遇</span><b>${s.ufoClicks}回</b></div>
        <div class="stats-item"><span>都市合併回数</span><b>${s.prestigeCount}回</b></div>
        <div class="stats-item"><span>名声ポイント</span><b>${s.famePoints}</b></div>
        <div class="stats-item"><span>プレイ時間</span><b>${hrs}時間${mins}分</b></div>
        <div class="stats-item"><span>実績達成数</span><b>${s.achievements.length} / ${ACHIEVEMENTS.length}</b></div>
      </div>
    `;
  }

  function renderPrestige() {
    const s = Game.getState();
    const el = $('tab-prestige');
    const potential = Game.potentialFame();
    const gain = potential - s.famePoints;
    const threshold = Game.prestigeThreshold();
    if (s.lifetimeMoney < threshold) {
      el.innerHTML = `
        <div class="prestige-box">
          <p>🌟 都市合併とは?</p>
          <p class="card-desc">町をリセットする代わりに「名声ポイント」を獲得し、恒久的に収入を+2%/pt 底上げできるシステムです。</p>
          <p class="card-desc">累計資金が <b>${formatNum(threshold)}円</b> に到達すると解放されます。(現在: ${formatNum(s.lifetimeMoney)}円)</p>
        </div>`;
      return;
    }
    el.innerHTML = `
      <div class="prestige-box">
        <p>🌟 都市合併</p>
        <p class="card-desc">町をリセットして、名声ポイントを <b>+${gain}</b> 獲得します。(合計 ${potential}pt → 収入 ${(potential * 2)}% アップ)</p>
        <button id="prestige-btn" class="danger-btn" ${gain > 0 ? '' : 'disabled'}>${gain > 0 ? '都市合併を実行する' : 'まだ増えていません'}</button>
      </div>`;
    const btn = $('prestige-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        showConfirm(`都市合併すると、資金と施設がリセットされます。名声ポイント +${gain} を獲得して収入が永続的に上がります。実行しますか?`, () => {
          if (Game.doPrestige()) renderAll();
        });
      });
    }
  }

  // --- 街並みシーン ---
  function renderBuildingsLayer() {
    const s = Game.getState();
    const layer = $('buildings-layer');
    layer.innerHTML = '';
    BUILDINGS.forEach((b, idx) => {
      const count = Game.buildingCount(b.id);
      if (count === 0) return;
      const shown = Math.min(count, 24);
      const row = document.createElement('div');
      row.className = 'building-row';
      row.style.setProperty('--row', idx);
      for (let i = 0; i < shown; i++) {
        const span = document.createElement('span');
        span.className = 'building-icon';
        span.style.animationDelay = `${(i * 173) % 2000}ms`;
        span.textContent = b.emoji;
        row.appendChild(span);
      }
      if (count > shown) {
        const more = document.createElement('span');
        more.className = 'building-more';
        more.textContent = `+${count - shown}`;
        row.appendChild(more);
      }
      layer.appendChild(row);
    });
  }

  function renderSky() {
    const hour = new Date().getHours();
    const scene = $('scene');
    const sunMoon = $('sun-moon');
    const isNight = hour < 5 || hour >= 19;
    scene.classList.toggle('night', isNight);
    sunMoon.textContent = isNight ? '🌙' : '☀️';
    const pct = ((hour + new Date().getMinutes() / 60) / 24) * 100;
    sunMoon.style.left = `${pct}%`;
  }

  function renderClouds() {
    const container = $('clouds');
    for (let i = 0; i < 5; i++) {
      const c = document.createElement('span');
      c.className = 'cloud';
      c.textContent = '☁️';
      c.style.top = `${10 + Math.random() * 40}%`;
      c.style.animationDuration = `${40 + Math.random() * 40}s`;
      c.style.animationDelay = `-${Math.random() * 40}s`;
      container.appendChild(c);
    }
  }

  // --- ゲームイベント反応 ---
  function onTick() {
    updateTopbar();
  }

  function onBuy() {
    renderBuild();
    renderUpgrades();
    updateTopbar();
  }

  function onAchievement(a) {
    Effects.toast(`実績解除: ${a.name}`, '🏆');
    const rect = $('town-hall').getBoundingClientRect();
    Effects.confetti(rect.left + rect.width / 2, rect.top, 50);
    if (activeTab === 'achievement') renderAchievements();
  }

  function onPrestige(data) {
    Effects.fireworksShow(6);
    Effects.screenShake(14, 500);
    Effects.toast(`都市合併完了!名声ポイント +${data.gained}`, '🌟');
    renderAll();
  }

  function onEvent(evt) {
    if (evt.type === 'offline' && evt.earned > 1) {
      showOfflineModal(evt.earned, evt.seconds);
    } else if (evt.type === 'golden-spawn') {
      positionGolden();
      $('golden-building').classList.remove('hidden');
    } else if (evt.type === 'golden-expire') {
      $('golden-building').classList.add('hidden');
    } else if (evt.type === 'rain-start') {
      $('rain-overlay').classList.remove('hidden');
      Effects.toast('☔ 雨が降ってきた!収入+50%', '☔');
    } else if (evt.type === 'rain-end') {
      $('rain-overlay').classList.add('hidden');
      Effects.toast('☀️ 雨が上がった', '☀️');
    } else if (evt.type === 'ufo-spawn') {
      $('ufo').classList.remove('hidden');
      $('ufo').style.top = `${20 + Math.random() * 30}%`;
    } else if (evt.type === 'ufo-expire') {
      $('ufo').classList.add('hidden');
    } else if (evt.type === 'milestone') {
      const rect = $('town-hall').getBoundingClientRect();
      Effects.confetti(rect.left + rect.width / 2, rect.top, 25);
      Effects.toast(`${evt.building.emoji} ${evt.building.name} が ${evt.count}個に!`, evt.building.emoji);
      renderBuildingsLayer();
    }
  }

  function positionGolden() {
    const scene = $('scene');
    const el = $('golden-building');
    const w = scene.clientWidth, h = scene.clientHeight;
    el.style.left = `${10 + Math.random() * (w - 80)}px`;
    el.style.top = `${h * 0.3 + Math.random() * (h * 0.4)}px`;
  }

  function showOfflineModal(earned, seconds) {
    const modal = $('changelog-modal');
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    modal.innerHTML = `
      <div class="modal-box">
        <h2>🏙️ おかえりなさい!</h2>
        <p>${hrs > 0 ? hrs + '時間' : ''}${mins}分の間に、町が資金を稼いでくれました。</p>
        <p class="offline-earned">+${formatNum(earned)}円</p>
        <div class="modal-actions"><button id="offline-close">受け取る</button></div>
      </div>`;
    modal.classList.remove('hidden');
    $('offline-close').addEventListener('click', () => {
      modal.classList.add('hidden');
      const rect = $('town-hall').getBoundingClientRect();
      Effects.confetti(rect.left + rect.width / 2, rect.top, 40);
    });
  }

  setInterval(() => {
    if (activeTab === 'build') renderBuild();
    if (activeTab === 'stats') renderStats();
    if (activeTab === 'prestige') renderPrestige();
  }, 1000);

  return { init };
})();
