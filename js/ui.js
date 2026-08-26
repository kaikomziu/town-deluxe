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
    bindPetition();
    bindSickness();
    bindFire();
    bindFooter();
    bindBgm();
    bindPedestrianToggle();
    renderSky();
    renderClouds();
    renderSeason();
    setupPedestrians();
    Game.on('tick', onTick);
    Game.on('buy', onBuy);
    Game.on('achievement', onAchievement);
    Game.on('prestige', onPrestige);
    Game.on('event', onEvent);
    renderAll();
    if (Game.isSick()) {
      const s = Game.getState();
      showSicknessBanner({ icon: s.sicknessIcon, name: s.sicknessName });
    }
    if (Game.isFireActive()) {
      const s = Game.getState();
      showFireBanner({ icon: s.hazards.fire.icon, name: s.hazards.fire.name });
    }
    setInterval(renderSky, 5000);
    setInterval(renderSeason, 60000);
    setInterval(updatePetitionTimer, 200);
    // 施設/アップグレード/都市合併タブは所持金の増加で購入可否(disabled状態)が変わるが、
    // onTickではトップバーしか更新していないため、tickだけだと「見た目は買えないまま」
    // になり、タブを切り替えるまで反映されなかった。表示中のタブに限り1秒おきに再描画する。
    setInterval(refreshActiveTabAfford, 1000);
  }

  function refreshActiveTabAfford() {
    if (activeTab === 'build') renderBuild();
    else if (activeTab === 'upgrade') renderUpgrades();
    else if (activeTab === 'prestige') renderPrestige();
  }

  function updatePetitionTimer() {
    const petition = Game.getPetition();
    const bar = $('petition-timer-bar');
    if (!petition) { bar.style.width = '0%'; return; }
    const total = petition.expiresAt - petition.createdAt;
    const remain = Math.max(0, petition.expiresAt - Date.now());
    bar.style.width = `${(remain / total) * 100}%`;
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
    const icon = $('town-hall-icon');
    hall.addEventListener('click', (e) => {
      const result = Game.manualClick();
      // ホバー拡大(外側の.town-hall)とアイドル/バンプの揺れ(内側のアイコン)を別要素に分けているため、
      // ここでアニメを再生させても外側のホバーtransformとは絶対にケンカしない
      icon.classList.remove('bump');
      void icon.offsetWidth;
      icon.classList.add('bump');
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

  function bindPetition() {
    $('petition-agree').addEventListener('click', () => {
      const result = Game.resolvePetition(true);
      if (result) {
        handlePetitionResult(result);
      } else if (Game.getPetition()) {
        // 陳情はまだ有効なのに失敗した=資金不足。無反応に見えないよう明示する
        Effects.toast('資金が足りません…', '💰');
      }
    });
    $('petition-ignore').addEventListener('click', () => {
      const result = Game.resolvePetition(false);
      if (result) handlePetitionResult(result);
    });
  }

  function handlePetitionResult(result) {
    $('petition-panel').classList.add('hidden');
    const t = result.template;
    if (result.agree) {
      Effects.toast(`${t.icon} 「${t.agreeLabel}」を実行!幸福度 +${result.happiness}`, t.icon);
    } else {
      Effects.toast(`${t.icon} 声を無視した…幸福度 ${result.happiness}`, t.icon);
    }
    updateTopbar();
  }

  function bindSickness() {
    $('sickness-cure-btn').addEventListener('click', () => {
      if (Game.cureSickness()) {
        $('sickness-banner').classList.add('hidden');
        Effects.toast('医療キャンペーンで疫病を収束させた!', '💉');
        Effects.confetti(window.innerWidth / 2, 60, 30);
        updateTopbar();
      }
    });
  }

  function bindFire() {
    $('fire-cure-btn').addEventListener('click', () => {
      if (Game.cureFire()) {
        $('fire-banner').classList.add('hidden');
        Effects.toast('消防隊の活躍で鎮火させた!', '🚒');
        Effects.confetti(window.innerWidth / 2, 60, 30);
        updateTopbar();
      }
    });
  }

  function currentTrack() {
    const s = Game.getState();
    return BGM_TRACKS.find((t) => t.id === s.currentBgm) || BGM_TRACKS[0];
  }

  function bindBgm() {
    const audio = $('bgm-audio');
    const s = Game.getState();
    audio.src = currentTrack().file;
    audio.volume = s.bgmVolume;
    $('bgm-volume').value = s.bgmVolume;
    $('bgm-btn').textContent = s.bgmMuted ? '🔇' : '🎵';
    let unlocked = false;
    const tryPlay = () => {
      if (unlocked || s.bgmMuted) return;
      unlocked = true;
      audio.play().catch(() => { unlocked = false; });
    };
    document.addEventListener('pointerdown', tryPlay, { once: true });
    $('bgm-btn').addEventListener('click', () => {
      const muted = Game.toggleBgmMute();
      $('bgm-btn').textContent = muted ? '🔇' : '🎵';
      if (muted) {
        audio.pause();
      } else {
        unlocked = true;
        audio.play().catch(() => {});
      }
    });
    $('bgm-volume').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      Game.setBgmVolume(v);
      audio.volume = v;
    });
    $('bgm-select-btn').addEventListener('click', showBgmModal);
  }

  function showBgmModal() {
    const s = Game.getState();
    const modal = $('changelog-modal');
    const rows = BGM_TRACKS.map((t) => {
      const owned = s.bgmUnlocked.includes(t.id);
      const isCurrent = s.currentBgm === t.id;
      let action;
      if (isCurrent) action = `<button disabled>再生中</button>`;
      else if (owned) action = `<button class="bgm-select" data-id="${t.id}">選択</button>`;
      else action = `<button class="bgm-buy" data-id="${t.id}" ${s.money >= t.price ? '' : 'disabled'}>${formatNum(t.price)}円で購入</button>`;
      return `
        <div class="card bgm-row${isCurrent ? ' ready' : ''}">
          <div class="card-body">
            <div class="card-title">${t.name}${isCurrent ? ' 🎧' : ''}</div>
            <div class="card-desc">BGM: 「${t.name}」 by ${t.credit}</div>
          </div>
          ${action}
        </div>`;
    }).join('');
    modal.innerHTML = `<div class="modal-box"><h2>🎼 BGM選択</h2><div class="bgm-list">${rows}</div><div class="modal-actions"><button id="bgm-modal-close">閉じる</button></div></div>`;
    modal.classList.remove('hidden');
    modal.querySelectorAll('.bgm-select').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (Game.selectBgm(btn.dataset.id)) showBgmModal();
      });
    });
    modal.querySelectorAll('.bgm-buy').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (Game.buyBgmTrack(btn.dataset.id)) {
          Effects.toast('🎼 新しいBGMを解放しました!', '🎼');
          showBgmModal();
        }
      });
    });
    $('bgm-modal-close').addEventListener('click', () => modal.classList.add('hidden'));
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
    renderDaily();
  }

  function updateTopbar() {
    const s = Game.getState();
    $('stat-money').textContent = formatNum(s.money) + '円';
    $('stat-income').textContent = formatNum(Game.incomePerSec()) + '円/秒';
    $('stat-pop').textContent = formatNum(s.population) + '人';
    $('stat-happiness').textContent = Math.round(s.happiness) + '%';
    const happinessBoostPct = Math.round(s.happiness); // happinessMult = 1 + happiness/100 なので、boost%は幸福度の値と同じ
    $('stat-happiness-wrap').title = `幸福度による収入ブースト: +${happinessBoostPct}%`;
    $('stat-fame').textContent = s.famePoints;
    $('stat-fame-wrap').title = `名声ショップで利用可能: ${Game.fameAvailable()}pt`;
    $('stat-fame-wrap').classList.toggle('hidden', s.famePoints === 0 && Game.potentialFame() === 0);
    const rank = Game.getRank();
    $('stat-rank-value').textContent = `${rank.emoji} ${rank.title}`;
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
      let preventBadge = '';
      if (b.prevention && b.prevention.sickness) {
        preventBadge += ` <span class="district-badge" title="病気イベントの発生自体を未然に防ぐ確率(医療系施設が多いほど上昇、最大95%)">🛡️病気予防${Math.round(Game.sicknessPreventionChance() * 100)}%</span>`;
      }
      if (b.prevention && b.prevention.fire) {
        preventBadge += ` <span class="district-badge" title="火事の発生自体を未然に防ぐ確率(消防系施設が多いほど上昇、最大95%)">🧯火災予防${Math.round(Game.firePreventionChance() * 100)}%</span>`;
      }
      if (b.prevention && b.prevention.crime) {
        preventBadge += ` <span class="district-badge" title="犯罪の発生自体を未然に防ぐ確率(交番が多いほど上昇、最大95%)">🚓防犯${Math.round(Game.crimePreventionChance() * 100)}%</span>`;
      }
      card.innerHTML = `
        <div class="card-icon">${b.emoji}</div>
        <div class="card-body">
          <div class="card-title">${b.name} <span class="card-count">×${count}</span></div>
          <div class="card-desc">${b.desc}</div>
          <div class="card-sub">${formatNum(perEach)}円/秒・個${preventBadge}</div>
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
        <div class="stats-item"><span>幸福度(収入ブースト)</span><b>${Math.round(s.happiness)}% <span class="stats-sub">(収入+${Math.round(s.happiness)}%)</span></b></div>
        <div class="stats-item"><span>クリック回数</span><b>${s.totalClicks.toLocaleString()}回</b></div>
        <div class="stats-item"><span>ゴールデンビル獲得</span><b>${s.goldenClicks}回</b></div>
        <div class="stats-item"><span>UFO遭遇</span><b>${s.ufoClicks}回</b></div>
        <div class="stats-item"><span>病気を未然に防いだ回数</span><b>${s.sicknessPrevented || 0}回</b></div>
        <div class="stats-item"><span>火事を未然に防いだ回数</span><b>${(s.hazards && s.hazards.fire && s.hazards.fire.prevented) || 0}回</b></div>
        <div class="stats-item"><span>犯罪を未然に防いだ回数</span><b>${s.crimePrevented || 0}回</b></div>
        <div class="stats-item"><span>犯罪による被害総額</span><b>${formatNum(s.crimeStolenTotal || 0)}円</b></div>
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
      </div>
      <div class="prestige-box">
        <p>💎 名声ショップ</p>
        <p class="card-desc">名声ポイントを消費して恒久アップグレードを購入できます(都市合併しても失われません)。都市合併の回数を重ねるほど新しいティアが解放されます。</p>
        <p class="card-desc">利用可能: <b>${Game.fameAvailable()}pt</b></p>
      </div>
      <div id="fame-shop-list" class="fame-shop-list"></div>`;
    const btn = $('prestige-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        showConfirm(`都市合併すると、資金と施設がリセットされます。名声ポイント +${gain} を獲得して収入が永続的に上がります。実行しますか?`, () => {
          if (Game.doPrestige()) renderAll();
        });
      });
    }
    renderFameShop();
  }

  function renderFameShop() {
    const listEl = $('fame-shop-list');
    if (!listEl) return;
    const s = Game.getState();
    listEl.innerHTML = '';
    FAME_SHOP_TIER_REQUIREMENT.forEach((req, tier) => {
      const items = FAME_SHOP.filter((f) => f.tier === tier);
      if (items.length === 0) return;
      const unlocked = Game.isFameShopTierUnlocked(tier);
      const header = document.createElement('div');
      header.className = 'fame-tier-header';
      header.textContent = unlocked ? `Tier ${tier + 1}` : `🔒 都市合併${req}回で解放(現在${s.prestigeCount}回)`;
      listEl.appendChild(header);
      items.forEach((item) => listEl.appendChild(fameCard(item, unlocked)));
    });
  }

  function fameCard(item, tierUnlocked) {
    const owned = Game.isFameUpgradeOwned(item.id);
    const available = Game.fameAvailable();
    const affordable = tierUnlocked && !owned && available >= item.cost;
    const card = document.createElement('div');
    card.className = 'card upgrade-card' + (owned ? ' owned' : (!tierUnlocked ? ' locked' : (affordable ? '' : ' disabled')));
    card.innerHTML = `
      <div class="card-body">
        <div class="card-title">${tierUnlocked ? item.name : '🔒 ？？？'}</div>
        <div class="card-desc">${tierUnlocked ? item.desc : 'まだ解放されていません'}</div>
      </div>
      ${owned ? '<span class="owned-badge">✅取得済み</span>' : (tierUnlocked ? `<button class="buy-btn" ${affordable ? '' : 'disabled'}>${item.cost}pt</button>` : '')}
    `;
    if (tierUnlocked && !owned) {
      card.querySelector('.buy-btn').addEventListener('click', () => {
        if (Game.buyFameUpgrade(item.id)) {
          Effects.toast(`${item.name} を取得!`, '💎');
          renderFameShop();
          updateTopbar();
        }
      });
    }
    return card;
  }

  function renderDaily() {
    const el = $('tab-daily');
    if (!el) return;
    const s = Game.getState();
    const daily = Game.getDaily();
    const streakHtml = `
      <div class="streak-box">
        <div class="streak-num">🔥 連続ログイン ${s.loginStreak || 0}日目</div>
        <div class="card-desc">毎日プレイすると資金ボーナス(最大7日分まで倍率アップ)</div>
      </div>`;
    const missionsHtml = (daily.missions || []).map((m) => {
      const progress = daily.progress[m.metric] || 0;
      const pct = Math.min(100, Math.round((progress / m.target) * 100));
      const done = progress >= m.target;
      return `
        <div class="card mission-card${done ? (m.claimed ? ' claimed' : ' ready') : ''}">
          <div class="card-icon">${m.icon}</div>
          <div class="card-body">
            <div class="card-title">${m.label}</div>
            <div class="mission-bar"><div class="mission-bar-fill" style="width:${pct}%"></div></div>
            <div class="card-sub">${formatNum(Math.min(progress, m.target))} / ${formatNum(m.target)} ・ 報酬 ${formatNum(m.reward)}円</div>
          </div>
          <button class="buy-btn mission-claim-btn" data-id="${m.id}" ${done && !m.claimed ? '' : 'disabled'}>${m.claimed ? '達成済み' : '受け取る'}</button>
        </div>`;
    }).join('');
    el.innerHTML = `${streakHtml}<div class="daily-heading">📅 今日のミッション</div>${missionsHtml}`;
    el.querySelectorAll('.mission-claim-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (Game.claimMission(btn.dataset.id)) renderDaily();
      });
    });
  }

  // --- 街並みシーン(購入時にランダムな位置へ設置) ---
  let renderedLayoutIds = new Set();
  function renderBuildingsLayer() {
    const layer = $('buildings-layer');
    const layout = Game.getLayout();
    const currentIds = new Set(layout.map((e) => e.id));

    // 経済上のカウントが0(合併リセット後など)になったらレイアウトも全消去
    if (layout.length === 0) {
      layer.innerHTML = '';
      renderedLayoutIds = new Set();
    }

    // 既存DOMのうち、もう存在しないものを除去(通常は増える一方だが念のため)
    renderedLayoutIds.forEach((id) => {
      if (!currentIds.has(id)) {
        const el = layer.querySelector(`[data-id="${id}"]`);
        if (el) el.remove();
        renderedLayoutIds.delete(id);
      }
    });

    // 新規追加分だけDOMを足す(既存の位置はドラッグ結果を保つため触らない)
    layout.forEach((entry) => {
      if (renderedLayoutIds.has(entry.id)) return;
      const b = BUILDINGS.find((x) => x.id === entry.type);
      if (!b) return;
      const span = document.createElement('span');
      span.className = 'building-icon constructing';
      span.dataset.id = entry.id;
      span.textContent = '🏗️';
      span.title = b.name;
      span.style.left = `${entry.x}%`;
      span.style.top = `${entry.y}%`;
      span.style.animationDelay = `${Math.random() * 2000}ms`;
      layer.appendChild(span);
      renderedLayoutIds.add(entry.id);
      // 建設中演出: クレーンアイコンで少し揺れた後、実際の建物にすり替わる
      setTimeout(() => {
        span.textContent = b.emoji;
        span.classList.remove('constructing');
        span.classList.add('construction-complete');
        setTimeout(() => span.classList.remove('construction-complete'), 500);
      }, 700 + Math.random() * 300);
    });

    renderOverflowBadge();
  }

  function renderOverflowBadge() {
    let totalHidden = 0;
    BUILDINGS.forEach((b) => {
      const count = Game.buildingCount(b.id);
      const shown = Game.getLayout().filter((e) => e.type === b.id).length;
      totalHidden += Math.max(0, count - shown);
    });
    let badge = document.getElementById('layout-overflow');
    if (totalHidden <= 0) {
      if (badge) badge.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'layout-overflow';
      badge.className = 'building-more';
      $('scene').appendChild(badge);
    }
    badge.textContent = `+${formatNum(totalHidden)}軒`;
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

  // --- 季節演出 ---
  let lastSeason = null;
  const SEASON_PARTICLE_CONFIG = {
    spring: { emoji: '🌸', count: 10, dir: 'fall' },
    summer: { emoji: '✨', count: 6, dir: 'rise' },
    autumn: { emoji: '🍁', count: 10, dir: 'fall' },
    winter: { emoji: '❄️', count: 14, dir: 'fall' }
  };
  function renderSeason() {
    const season = currentSeason();
    const scene = $('scene');
    scene.classList.remove('season-spring', 'season-summer', 'season-autumn', 'season-winter');
    scene.classList.add(`season-${season}`);
    if (season === lastSeason) return;
    lastSeason = season;
    const container = $('season-particles');
    container.innerHTML = '';
    const conf = SEASON_PARTICLE_CONFIG[season];
    if (!conf) return;
    for (let i = 0; i < conf.count; i++) {
      const p = document.createElement('span');
      p.className = `season-particle ${conf.dir}`;
      p.textContent = conf.emoji;
      p.style.left = `${Math.random() * 100}%`;
      p.style.fontSize = `${12 + Math.random() * 10}px`;
      p.style.animationDuration = `${6 + Math.random() * 8}s`;
      p.style.animationDelay = `-${Math.random() * 10}s`;
      container.appendChild(p);
    }
  }

  // --- 住民が街を歩き回る演出(重ければ設定でオフ) ---
  let pedestrianTimer = null;
  function setupPedestrians() {
    renderPedestrianVisibility();
    if (pedestrianTimer) clearInterval(pedestrianTimer);
    const container = $('pedestrian-layer');
    container.innerHTML = '';
    const count = 6;
    const emojis = ['🚶', '🚶‍♀️', '🐕'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'pedestrian';
      p.textContent = emojis[i % emojis.length];
      p.style.left = `${10 + Math.random() * 80}%`;
      p.style.top = `${10 + Math.random() * 80}%`;
      container.appendChild(p);
    }
    retargetPedestrians();
    pedestrianTimer = setInterval(retargetPedestrians, 4500);
  }
  function retargetPedestrians() {
    if (!Game.getShowPedestrians()) return;
    document.querySelectorAll('.pedestrian').forEach((p) => {
      const oldX = parseFloat(p.style.left || '50');
      const nx = 6 + Math.random() * 88;
      const ny = 8 + Math.random() * 84;
      p.style.transitionDuration = `${3 + Math.random() * 2}s`;
      p.style.transform = nx < oldX ? 'scaleX(-1)' : 'scaleX(1)';
      p.style.left = `${nx}%`;
      p.style.top = `${ny}%`;
    });
  }
  function renderPedestrianVisibility() {
    const on = Game.getShowPedestrians();
    $('pedestrian-layer').classList.toggle('hidden', !on);
    $('pedestrian-toggle').checked = on;
  }
  function bindPedestrianToggle() {
    $('pedestrian-toggle').addEventListener('change', () => {
      Game.togglePedestrians();
      renderPedestrianVisibility();
    });
  }

  // --- ゲームイベント反応 ---
  function onTick() {
    updateTopbar();
  }

  function onBuy() {
    renderBuild();
    renderUpgrades();
    renderBuildingsLayer();
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
    if (evt.type === 'welcome-back') {
      showWelcomeBackModal(evt.login, evt.offline);
    } else if (evt.type === 'rank-up') {
      Effects.fireworksShow(3);
      Effects.toast(`${evt.rank.emoji} 称号「${evt.rank.title}」に昇進しました!`, evt.rank.emoji);
      updateTopbar();
    } else if (evt.type === 'mission-claimed') {
      Effects.toast(`${evt.mission.icon} デイリーミッション達成!+${formatNum(evt.mission.reward)}円`, '📅');
      updateTopbar();
    } else if (evt.type === 'daily-reset') {
      if (activeTab === 'daily') renderDaily();
    } else if (evt.type === 'autosave') {
      const btn = $('save-btn');
      btn.classList.remove('save-flash');
      void btn.offsetWidth;
      btn.classList.add('save-flash');
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
    } else if (evt.type === 'petition-spawn') {
      renderPetition(evt.petition);
    } else if (evt.type === 'petition-expire') {
      $('petition-panel').classList.add('hidden');
      Effects.toast(`${evt.template.icon} 声を聞き逃してしまった…幸福度 ${evt.template.ignoreHappiness}`, evt.template.icon);
      updateTopbar();
    } else if (evt.type === 'sickness-start') {
      showSicknessBanner(evt);
      Effects.toast(`${evt.icon} ${evt.name}が流行り始めた…`, evt.icon);
      Effects.sound('error');
    } else if (evt.type === 'sickness-end') {
      $('sickness-banner').classList.add('hidden');
      if (!evt.cured) Effects.toast('😌 疫病の流行が収まった', '😌');
      updateTopbar();
    } else if (evt.type === 'sickness-prevented') {
      Effects.toast('🏥 医療施設のおかげで疫病の流行を未然に防いだ!', '🏥');
    } else if (evt.type === 'fire-start') {
      showFireBanner(evt);
      Effects.toast(`${evt.icon} ${evt.name}が発生した!`, evt.icon);
      Effects.sound('error');
      Effects.screenShake(6, 300);
    } else if (evt.type === 'fire-end') {
      $('fire-banner').classList.add('hidden');
      if (!evt.cured) Effects.toast('🧯 火が消し止められた', '🧯');
      updateTopbar();
    } else if (evt.type === 'fire-prevented') {
      Effects.toast('🧯 消防系施設のおかげで火事を未然に防いだ!', '🧯');
    } else if (evt.type === 'crime-prevented') {
      Effects.toast('🚓 交番のおかげで犯罪を未然に防いだ!', '🚓');
    } else if (evt.type === 'crime-occurred') {
      Effects.toast(`${evt.icon} ${evt.name}の被害…${formatNum(evt.stolen)}円が盗まれた`, evt.icon);
      Effects.sound('error');
      updateTopbar();
    } else if (evt.type === 'bgm-changed') {
      const audio = $('bgm-audio');
      const wasPlaying = !audio.paused;
      audio.src = currentTrack().file;
      if (wasPlaying) audio.play().catch(() => {});
      Effects.toast(`🎧 BGMを「${currentTrack().name}」に切り替えました`, '🎧');
    } else if (evt.type === 'bgm-unlocked') {
      updateTopbar();
    }
  }

  function renderPetition(petition) {
    const t = petition.template;
    $('petition-icon').textContent = t.icon;
    $('petition-text').textContent = t.text;
    const cost = Game.petitionCost();
    $('petition-agree').textContent = `${t.agreeLabel} (${formatNum(cost)}円)`;
    $('petition-ignore').textContent = t.ignoreLabel;
    $('petition-panel').classList.remove('hidden');
  }

  function showSicknessBanner(evt) {
    $('sickness-icon').textContent = evt.icon;
    $('sickness-text').textContent = `${evt.name}が流行中!幸福度が低下しています(病院で軽減)`;
    $('sickness-cure-btn').textContent = `💉 医療キャンペーン (${formatNum(Game.sicknessCureCost())}円)`;
    $('sickness-banner').classList.remove('hidden');
  }

  function showFireBanner(evt) {
    $('fire-icon').textContent = evt.icon;
    $('fire-text').textContent = `${evt.name}が発生中!幸福度が低下しています(消防系施設で軽減)`;
    $('fire-cure-btn').textContent = `🚒 消防隊を出動 (${formatNum(Game.fireCureCost())}円)`;
    $('fire-banner').classList.remove('hidden');
  }

  function positionGolden() {
    const scene = $('scene');
    const el = $('golden-building');
    const w = scene.clientWidth, h = scene.clientHeight;
    el.style.left = `${10 + Math.random() * (w - 80)}px`;
    el.style.top = `${h * 0.3 + Math.random() * (h * 0.4)}px`;
  }

  function showWelcomeBackModal(login, offline) {
    const modal = $('changelog-modal');
    let body = '';
    if (login) {
      body += `<p>${login.broken ? '連続ログインが途切れましたが、また1日目からスタート!' : `🔥 連続ログイン <b>${login.streak}日目</b>!`}</p>`;
      body += `<p class="offline-earned">+${formatNum(login.reward)}円</p>`;
    }
    if (offline) {
      const hrs = Math.floor(offline.seconds / 3600);
      const mins = Math.floor((offline.seconds % 3600) / 60);
      body += `<p>${hrs > 0 ? hrs + '時間' : ''}${mins}分の間に、町が資金を稼いでくれました。</p>`;
      body += `<p class="offline-earned">+${formatNum(offline.earned)}円</p>`;
    }
    modal.innerHTML = `
      <div class="modal-box">
        <h2>🏙️ おかえりなさい!</h2>
        ${body}
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
    if (activeTab === 'daily') renderDaily();
    if (Game.isSick() && !$('sickness-banner').classList.contains('hidden')) {
      $('sickness-cure-btn').textContent = `💉 医療キャンペーン (${formatNum(Game.sicknessCureCost())}円)`;
    }
    if (Game.isFireActive() && !$('fire-banner').classList.contains('hidden')) {
      $('fire-cure-btn').textContent = `🚒 消防隊を出動 (${formatNum(Game.fireCureCost())}円)`;
    }
  }, 1000);

  return { init };
})();
