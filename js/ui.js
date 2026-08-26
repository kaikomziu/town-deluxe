// タウンDELUXE UI描画・イベント処理

const UI = (() => {
  let qty = 1;
  let buyAllOrder = 'cheap';
  let upgradeOrder = 'cheap';
  let activeTab = 'build';

  function $(id) { return document.getElementById(id); }

  function init() {
    $('version-label').textContent = VERSION;
    bindTabs();
    bindQty();
    bindBuyAllOrder();
    bindBuyAll();
    bindTownHall();
    bindGolden();
    bindUfo();
    bindPetition();
    bindSickness();
    bindFire();
    bindFooter();
    bindBgm();
    bindBgmPreviewEnd();
    bindSettingsButton();
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
    else if (activeTab === 'quest') renderQuests();
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
        $('buy-all-row').classList.toggle('hidden', activeTab !== 'build');
        Game.markUiFlag(`opened_tab_${activeTab}`);
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

  function bindBuyAllOrder() {
    document.querySelectorAll('.order-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.order-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        buyAllOrder = btn.dataset.order;
      });
    });
  }

  function bindBuyAll() {
    $('buy-all-btn').addEventListener('click', () => {
      Game.markUiFlag('used_buy_all');
      const result = Game.buyAllAffordable(buyAllOrder);
      if (result.totalQty > 0) {
        const kinds = result.bought.length;
        Effects.toast(`🛒 ${kinds}種類・計${formatNum(result.totalQty)}個購入(${formatNum(result.totalCost)}円)`, '🛒');
        renderBuild();
        renderUpgrades();
        renderBuildingsLayer();
        updateTopbar();
      } else {
        // 何も買えなかった場合も無反応に見えないよう明示する(一番安い施設の価格を案内)
        const cheapest = BUILDINGS.reduce((min, b) => (b.baseCost < min.baseCost ? b : min), BUILDINGS[0]);
        Effects.toast(`😢 今は何も買えません(最安の${cheapest.name}は${formatNum(buildingCost(cheapest, Game.buildingCount(cheapest.id), 1))}円)`, '💸');
      }
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
    Game.markUiFlag('opened_bgm_modal');
    const s = Game.getState();
    const modal = $('changelog-modal');
    const rows = BGM_TRACKS.map((t) => {
      const owned = s.bgmUnlocked.includes(t.id);
      const isCurrent = s.currentBgm === t.id;
      let action;
      if (isCurrent) action = `<button disabled>再生中</button>`;
      else if (owned) action = `<button class="bgm-select" data-id="${t.id}">選択</button>`;
      else action = `<button class="bgm-buy" data-id="${t.id}" ${s.money >= t.price ? '' : 'disabled'}>${formatNum(t.price)}円で購入</button>`;
      const isPreviewing = previewingId === t.id;
      return `
        <div class="card bgm-row${isCurrent ? ' ready' : ''}">
          <button class="bgm-preview-btn" data-id="${t.id}" title="試聴する">${isPreviewing ? '⏸' : '▶'}</button>
          <div class="card-body">
            <div class="card-title">${t.name}${isCurrent ? ' 🎧' : ''}</div>
            <div class="card-desc">BGM: 「${t.name}」 by ${t.credit}</div>
          </div>
          ${action}
        </div>`;
    }).join('');
    modal.innerHTML = `<div class="modal-box"><h2>🎼 BGM選択</h2><p class="card-desc">▶ボタンで試聴できます</p><div class="bgm-list">${rows}</div><div class="modal-actions"><button id="bgm-modal-close">閉じる</button></div></div>`;
    modal.classList.remove('hidden');
    modal.querySelectorAll('.bgm-select').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopPreview();
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
    modal.querySelectorAll('.bgm-preview-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const track = BGM_TRACKS.find((t) => t.id === btn.dataset.id);
        if (track) togglePreview(track);
        showBgmModal();
      });
    });
    $('bgm-modal-close').addEventListener('click', () => {
      modal.classList.add('hidden');
      stopPreview();
    });
  }

  // --- BGM試聴(プレビュー再生) ---
  // 本編のBGMとぶつからないよう、試聴中は本編を一時停止し、終了/停止で自動的に再開する。
  let previewingId = null;
  function togglePreview(track) {
    const preview = $('bgm-preview-audio');
    const mainAudio = $('bgm-audio');
    if (previewingId === track.id) {
      preview.pause();
      preview.currentTime = 0;
      previewingId = null;
      if (!Game.getState().bgmMuted) mainAudio.play().catch(() => {});
      return;
    }
    mainAudio.pause();
    preview.src = track.file;
    preview.currentTime = 0;
    preview.volume = Game.getState().bgmVolume;
    preview.play().catch(() => {});
    previewingId = track.id;
  }
  function stopPreview() {
    if (!previewingId) return;
    const preview = $('bgm-preview-audio');
    preview.pause();
    preview.currentTime = 0;
    previewingId = null;
    if (!Game.getState().bgmMuted) $('bgm-audio').play().catch(() => {});
  }
  function bindBgmPreviewEnd() {
    $('bgm-preview-audio').addEventListener('ended', () => {
      previewingId = null;
      if (!Game.getState().bgmMuted) $('bgm-audio').play().catch(() => {});
      if (!$('changelog-modal').classList.contains('hidden')) showBgmModal();
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
    renderQuests();
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
    $('stat-pop').textContent = `${formatNum(s.population)}/${formatNum(Game.maxPopulation())}人`;
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
      if (b.prevention && b.prevention.petition) {
        preventBadge += ` <span class="district-badge" title="陳情(住民の苦情)の発生自体を未然に防ぐ確率(郵便局・会計事務所が多いほど上昇、最大95%)">📮陳情予防${Math.round(Game.petitionPreventionChance() * 100)}%</span>`;
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
    el.appendChild(renderTownExpansionSection());
    el.appendChild(renderHappinessExpansionSection());
    el.appendChild(renderUpgradeToolbar());
    const unlocked = UPGRADES.filter((u) => Game.isUpgradeUnlocked(u) && !s.upgrades.includes(u.id));
    const locked = UPGRADES.filter((u) => !Game.isUpgradeUnlocked(u) && !s.upgrades.includes(u.id));
    if (unlocked.length === 0 && locked.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = '全てのアップグレードを取得しました!すごい!';
      el.appendChild(empty);
      return;
    }
    unlocked.sort((a, b) => a.cost - b.cost).forEach((u) => el.appendChild(upgradeCard(u, true)));
    locked.slice(0, 6).forEach((u) => el.appendChild(upgradeCard(u, false)));
  }

  function renderUpgradeToolbar() {
    const wrap = document.createElement('div');
    const heading = document.createElement('div');
    heading.className = 'daily-heading';
    heading.textContent = '⚡ 施設アップグレード';
    wrap.appendChild(heading);
    const row = document.createElement('div');
    row.className = 'buy-all-row';
    row.innerHTML = `
      <button data-order="cheap" class="order-btn upg-order-btn${upgradeOrder === 'cheap' ? ' active' : ''}">安い順</button>
      <button data-order="expensive" class="order-btn upg-order-btn${upgradeOrder === 'expensive' ? ' active' : ''}">高い順</button>
      <button data-order="even" class="order-btn upg-order-btn${upgradeOrder === 'even' ? ' active' : ''}">平等</button>
      <button id="buy-all-upgrades-btn" class="buy-all-btn" title="今買えるアップグレードを、選んだ順序でまとめて購入します">🛒 全部買う</button>
    `;
    row.querySelectorAll('.upg-order-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        upgradeOrder = btn.dataset.order;
        renderUpgrades();
      });
    });
    row.querySelector('#buy-all-upgrades-btn').addEventListener('click', () => {
      const result = Game.buyAllUpgrades(upgradeOrder);
      if (result.bought.length > 0) {
        if (Game.getShowBuyToasts()) Effects.toast(`⚡ アップグレードを${result.bought.length}件購入(${formatNum(result.totalCost)}円)`, '⚡');
        renderBuild();
        renderUpgrades();
        updateTopbar();
      } else {
        Effects.toast('😢 今買えるアップグレードがありません', '💸');
      }
    });
    wrap.appendChild(row);
    return wrap;
  }

  function renderTownExpansionSection() {
    const s = Game.getState();
    const wrap = document.createElement('div');
    const heading = document.createElement('div');
    heading.className = 'daily-heading';
    heading.textContent = `🏘️ 町の拡張(最大人口: ${formatNum(s.population)} / ${formatNum(Game.maxPopulation())}人)`;
    wrap.appendChild(heading);
    TOWN_EXPANSIONS.forEach((e) => wrap.appendChild(townExpansionCard(e)));
    return wrap;
  }

  function townExpansionCard(e) {
    const s = Game.getState();
    const owned = Game.isTownExpansionOwned(e.id);
    const affordable = !owned && s.money >= e.cost;
    const card = document.createElement('div');
    card.className = 'card upgrade-card' + (owned ? ' owned' : (affordable ? '' : ' disabled'));
    card.innerHTML = `
      <div class="card-body">
        <div class="card-title">${e.name}</div>
        <div class="card-desc">${e.desc}</div>
      </div>
      ${owned ? '<span class="owned-badge">✅取得済み</span>' : `<button class="buy-btn" ${affordable ? '' : 'disabled'}>${formatNum(e.cost)}円</button>`}
    `;
    if (!owned) {
      card.querySelector('.buy-btn').addEventListener('click', () => {
        if (Game.buyTownExpansion(e.id)) {
          if (Game.getShowBuyToasts()) Effects.toast(`${e.name} で最大人口が+${formatNum(e.popBonus)}人!`, '🏘️');
          renderUpgrades();
          updateTopbar();
        }
      });
    }
    return card;
  }

  function renderHappinessExpansionSection() {
    const s = Game.getState();
    const wrap = document.createElement('div');
    const heading = document.createElement('div');
    heading.className = 'daily-heading';
    heading.textContent = `😊 幸福度政策(幸福度上限: ${Math.round(s.happiness)}% / ${formatNum(Game.maxHappiness())}%)`;
    wrap.appendChild(heading);
    HAPPINESS_EXPANSIONS.forEach((e) => wrap.appendChild(happinessExpansionCard(e)));
    return wrap;
  }

  function happinessExpansionCard(e) {
    const s = Game.getState();
    const owned = Game.isHappinessExpansionOwned(e.id);
    const affordable = !owned && s.money >= e.cost;
    const card = document.createElement('div');
    card.className = 'card upgrade-card' + (owned ? ' owned' : (affordable ? '' : ' disabled'));
    card.innerHTML = `
      <div class="card-body">
        <div class="card-title">${e.name}</div>
        <div class="card-desc">${e.desc}</div>
      </div>
      ${owned ? '<span class="owned-badge">✅取得済み</span>' : `<button class="buy-btn" ${affordable ? '' : 'disabled'}>${formatNum(e.cost)}円</button>`}
    `;
    if (!owned) {
      card.querySelector('.buy-btn').addEventListener('click', () => {
        if (Game.buyHappinessExpansion(e.id)) {
          if (Game.getShowBuyToasts()) Effects.toast(`${e.name} で幸福度の上限が+${formatNum(e.capBonus)}!`, '😊');
          renderUpgrades();
          updateTopbar();
        }
      });
    }
    return card;
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
          if (Game.getShowBuyToasts()) Effects.toast(`${u.name} を取得!`, '⚡');
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
        <div class="stats-item"><span>現在の人口 / 最大人口</span><b>${formatNum(s.population)} / ${formatNum(Game.maxPopulation())}人</b></div>
        <div class="stats-item"><span>町の拡張回数</span><b>${(s.townExpansions || []).length} / ${TOWN_EXPANSIONS.length}回</b></div>
        <div class="stats-item"><span>幸福度政策回数</span><b>${(s.happinessExpansions || []).length} / ${HAPPINESS_EXPANSIONS.length}回</b></div>
        <div class="stats-item"><span>幸福度(収入ブースト)</span><b>${Math.round(s.happiness)}% / ${formatNum(Game.maxHappiness())}% <span class="stats-sub">(収入+${Math.round(s.happiness)}%)</span></b></div>
        <div class="stats-item"><span>クリック回数</span><b>${s.totalClicks.toLocaleString()}回</b></div>
        <div class="stats-item"><span>ゴールデンビル獲得</span><b>${s.goldenClicks}回</b></div>
        <div class="stats-item"><span>UFO遭遇</span><b>${s.ufoClicks}回</b></div>
        <div class="stats-item"><span>病気を未然に防いだ回数</span><b>${s.sicknessPrevented || 0}回</b></div>
        <div class="stats-item"><span>火事を未然に防いだ回数</span><b>${(s.hazards && s.hazards.fire && s.hazards.fire.prevented) || 0}回</b></div>
        <div class="stats-item"><span>犯罪を未然に防いだ回数</span><b>${s.crimePrevented || 0}回</b></div>
        <div class="stats-item"><span>犯罪による被害総額</span><b>${formatNum(s.crimeStolenTotal || 0)}円</b></div>
        <div class="stats-item"><span>陳情を未然に防いだ回数</span><b>${s.petitionsPrevented || 0}回</b></div>
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
      header.textContent = unlocked ? `Tier ${tier + 1}` : `🔒 名声ポイント${formatNum(req)}到達で解放(現在${formatNum(s.famePoints)})`;
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
          if (Game.getShowBuyToasts()) Effects.toast(`${item.name} を取得!`, '💎');
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

  // --- 恒久ミッション(チュートリアル〜終盤の目標。デイリーと違いリセットされない) ---
  function renderQuests() {
    const el = $('tab-quest');
    if (!el) return;
    const s = Game.getState();
    const readyCount = QUESTS.filter((q) => !Game.isQuestClaimed(q.id) && Game.isQuestStageUnlocked(q.stage) && q.check(s)).length;
    let html = '<div class="daily-heading">🎓 ミッション</div><p class="card-desc quest-intro">デイリーミッションと違い、リセットされない恒久の目標一覧です。各ステージのミッションを70%以上達成すると次のステージが解放されます。</p>';
    html += `<button id="quest-claim-all-btn" class="buy-all-btn settings-wide-btn" ${readyCount > 0 ? '' : 'disabled'}>🎁 全部受け取る${readyCount > 0 ? `(${readyCount}件)` : ''}</button>`;
    for (let stage = 1; stage <= QUEST_STAGE_COUNT; stage++) {
      const stageQuests = QUESTS.filter((q) => q.stage === stage);
      const unlocked = Game.isQuestStageUnlocked(stage);
      const claimedCount = stageQuests.filter((q) => Game.isQuestClaimed(q.id)).length;
      html += `<div class="daily-heading quest-stage-heading">Stage ${stage}: ${QUEST_STAGE_NAMES[stage - 1]}(${claimedCount}/${stageQuests.length})</div>`;
      if (!unlocked) {
        html += '<p class="card-desc quest-locked-note">🔒 前のステージのミッションを70%以上達成すると解放されます</p>';
        continue;
      }
      stageQuests.forEach((q) => {
        const claimed = Game.isQuestClaimed(q.id);
        const done = q.check(s);
        const reward = Game.questReward(q.stage);
        html += `
          <div class="card mission-card${done ? (claimed ? ' claimed' : ' ready') : ''}">
            <div class="card-icon">${q.icon}</div>
            <div class="card-body">
              <div class="card-title">${q.name}</div>
              <div class="card-desc">${q.desc}</div>
              <div class="card-sub">報酬 ${formatNum(reward)}円</div>
            </div>
            <button class="buy-btn quest-claim-btn" data-id="${q.id}" ${done && !claimed ? '' : 'disabled'}>${claimed ? '達成済み' : (done ? '受け取る' : '未達成')}</button>
          </div>`;
      });
    }
    el.innerHTML = html;
    el.querySelectorAll('.quest-claim-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (Game.claimQuest(btn.dataset.id)) renderQuests();
      });
    });
    const claimAllBtn = $('quest-claim-all-btn');
    if (claimAllBtn) {
      claimAllBtn.addEventListener('click', () => {
        const result = Game.claimAllQuests();
        if (result.claimed.length > 0) {
          Effects.toast(`🎓 ミッションを${result.claimed.length}件受け取り!+${formatNum(result.totalReward)}円`, '🎁');
          renderQuests();
          updateTopbar();
        }
      });
    }
  }

  // --- 街並みシーン(購入時にランダムな位置へ設置) ---
  // 施設が130種類×最大24個/種まで増えうるため、重く感じる場合向けに表示モードを用意する:
  //   all(既定)   : そのまま全部表示
  //   dedupe      : 施設1種類につきアイコン1つだけ表示して間引く
  //   none        : 街並みを完全に非表示
  // さらにhiddenBuildingIdsに含まれる施設は、上記モードによらず個別に非表示にできる。
  let renderedLayoutIds = new Set();
  function renderBuildingsLayer() {
    const layer = $('buildings-layer');
    const mode = Game.getBuildingDisplayMode();
    const layout = Game.getLayout();

    if (mode === 'none') {
      if (renderedLayoutIds.size > 0 || layer.children.length > 0) {
        layer.innerHTML = '';
        renderedLayoutIds = new Set();
      }
      renderOverflowBadge();
      return;
    }

    const seenType = new Set(); // dedupeモードで「その種類は表示済み」を判定する
    const visible = layout.filter((e) => {
      if (Game.isBuildingHidden(e.type)) return false;
      if (mode === 'dedupe') {
        if (seenType.has(e.type)) return false;
        seenType.add(e.type);
      }
      return true;
    });
    const currentIds = new Set(visible.map((e) => e.id));

    // 経済上のカウントが0(合併リセット後など)になったらレイアウトも全消去
    if (layout.length === 0) {
      layer.innerHTML = '';
      renderedLayoutIds = new Set();
    }

    // 既存DOMのうち、もう表示対象でないものを除去(施設数が減った・設定変更で隠れた場合など)
    renderedLayoutIds.forEach((id) => {
      if (!currentIds.has(id)) {
        const el = layer.querySelector(`[data-id="${id}"]`);
        if (el) el.remove();
        renderedLayoutIds.delete(id);
      }
    });

    // 新規追加分だけDOMを足す(既存の位置はドラッグ結果を保つため触らない)
    visible.forEach((entry) => {
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
    const mode = Game.getBuildingDisplayMode();
    let badge = document.getElementById('layout-overflow');
    if (mode === 'none') {
      if (badge) badge.remove();
      return;
    }
    // 施設ごとにO(1)で「実際に街に表示されている数」を数える(施設数×レイアウト数の総当たりを避ける)
    const shownCounts = {};
    Game.getLayout().forEach((e) => {
      if (Game.isBuildingHidden(e.type)) return;
      shownCounts[e.type] = (shownCounts[e.type] || 0) + 1;
    });
    let totalHidden = 0;
    BUILDINGS.forEach((b) => {
      if (Game.isBuildingHidden(b.id)) return; // 個別非表示にした施設は「隠れている」ではなく最初から数えない
      const count = Game.buildingCount(b.id);
      const shown = mode === 'dedupe' ? Math.min(1, count) : (shownCounts[b.id] || 0);
      totalHidden += Math.max(0, count - shown);
    });
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
    const count = 10;
    const emojis = ['🚶', '🚶‍♀️', '🐕', '🐈', '🚶', '🐕', '🐈', '🚶‍♀️', '🐕', '🐈'];
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
  }

  // --- 設定モーダル: 演出まわりのオンオフをここに集約(重く感じたら切れるように) ---
  function bindSettingsButton() {
    $('settings-btn').addEventListener('click', showSettingsModal);
  }
  function showSettingsModal() {
    Game.markUiFlag('opened_settings');
    const modal = $('changelog-modal');
    const rows = [
      { id: 'set-pedestrian', label: '🚶 住民表示', desc: '街を歩く住民・犬・猫の表示', on: Game.getShowPedestrians() },
      { id: 'set-buy-toast', label: '🔔 購入通知', desc: 'アップグレード・拡張購入時の「〜を取得!」通知', on: Game.getShowBuyToasts() },
      { id: 'set-effects', label: '🎉 演出(紙吹雪・花火)', desc: 'クリックや実績解除などの紙吹雪・花火・浮き出る数字', on: Game.getShowEffects() },
      { id: 'set-shake', label: '📳 画面シェイク', desc: 'ゴールデンビルや火事などで画面が揺れる演出', on: Game.getShowScreenShake() }
    ];
    const mode = Game.getBuildingDisplayMode();
    const hiddenCount = (Game.getState().hiddenBuildingIds || []).length;
    modal.innerHTML = `
      <div class="modal-box">
        <h2>⚙️ 設定</h2>
        <p class="card-desc">演出や街並みの表示が重く感じる場合は、ここで調整できます。</p>
        <div class="settings-list">
          ${rows.map((r) => `
            <label class="settings-row">
              <input type="checkbox" id="${r.id}"${r.on ? ' checked' : ''}>
              <span class="settings-row-text"><b>${r.label}</b><span class="card-desc">${r.desc}</span></span>
            </label>`).join('')}
        </div>
        <h3 class="settings-subhead">🏙️ 街並みの建物表示</h3>
        <p class="card-desc">施設が${BUILDINGS.length}種類・最大24個/種まで増えるため、街並みが重い場合はここで間引けます(経営には影響しません)。</p>
        <div class="buy-all-row">
          <button data-mode="all" class="order-btn bd-mode-btn${mode === 'all' ? ' active' : ''}">すべて表示</button>
          <button data-mode="dedupe" class="order-btn bd-mode-btn${mode === 'dedupe' ? ' active' : ''}">1種類1つに間引く</button>
          <button data-mode="none" class="order-btn bd-mode-btn${mode === 'none' ? ' active' : ''}">完全に非表示</button>
        </div>
        <button id="open-building-hide-btn" class="buy-all-btn settings-wide-btn">🚫 表示しない施設を個別に選ぶ(現在${hiddenCount}件非表示)</button>
        <div class="modal-actions"><button id="settings-close">閉じる</button></div>
      </div>`;
    modal.classList.remove('hidden');
    $('set-pedestrian').addEventListener('change', () => {
      Game.togglePedestrians();
      renderPedestrianVisibility();
    });
    $('set-buy-toast').addEventListener('change', () => Game.toggleBuyToasts());
    $('set-effects').addEventListener('change', () => Game.toggleEffects());
    $('set-shake').addEventListener('change', () => Game.toggleScreenShake());
    modal.querySelectorAll('.bd-mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        Game.setBuildingDisplayMode(btn.dataset.mode);
        Game.markUiFlag('used_building_display_mode');
        renderBuildingsLayer();
        showSettingsModal();
      });
    });
    $('open-building-hide-btn').addEventListener('click', showBuildingVisibilityModal);
    $('settings-close').addEventListener('click', () => modal.classList.add('hidden'));
  }

  function showBuildingVisibilityModal() {
    const modal = $('changelog-modal');
    const rows = BUILDINGS.map((b) => {
      const hidden = Game.isBuildingHidden(b.id);
      return `
        <label class="settings-row bv-row">
          <input type="checkbox" data-bid="${b.id}"${hidden ? '' : ' checked'}>
          <span class="settings-row-text">${b.emoji} ${b.name}</span>
        </label>`;
    }).join('');
    modal.innerHTML = `
      <div class="modal-box">
        <h2>🚫 表示する施設を選ぶ</h2>
        <p class="card-desc">チェックを外すと、街並みからそのアイコンが消えます(経営には影響しません)。</p>
        <div class="settings-list bv-list">${rows}</div>
        <div class="modal-actions">
          <button id="bv-show-all">すべて表示に戻す</button>
          <button id="bv-back">← 設定に戻る</button>
        </div>
      </div>`;
    modal.classList.remove('hidden');
    modal.querySelectorAll('[data-bid]').forEach((cb) => {
      cb.addEventListener('change', () => {
        Game.toggleBuildingHidden(cb.dataset.bid);
        renderBuildingsLayer();
      });
    });
    $('bv-show-all').addEventListener('click', () => {
      BUILDINGS.forEach((b) => { if (Game.isBuildingHidden(b.id)) Game.toggleBuildingHidden(b.id); });
      renderBuildingsLayer();
      showBuildingVisibilityModal();
    });
    $('bv-back').addEventListener('click', showSettingsModal);
  }

  // --- ゲームイベント反応 ---
  function onTick() {
    updateTopbar();
  }

  function onBuy(data) {
    // 「全部買う」等の一括購入はsilent:trueで1件ずつbuyBuilding/buyUpgradeを呼ぶため、
    // ここで毎回フル再描画すると(施設130種類×アップグレード1500件超を)購入数だけ繰り返すことになり
    // 極めて重くなる。silent時は描画をスキップし、呼び出し元(bindBuyAll等)が最後に1回だけ描画する。
    if (data && data.silent) return;
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
    } else if (evt.type === 'quest-claimed') {
      // 「全部受け取る」でsilent:trueのまま連続で呼ばれた分は、個別トーストを出さず一括受け取り側でまとめて表示する
      if (!evt.silent) {
        Effects.toast(`${evt.quest.icon} ミッション「${evt.quest.name}」達成!+${formatNum(evt.reward)}円`, '🎓');
        updateTopbar();
      }
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
    } else if (evt.type === 'petition-prevented') {
      Effects.toast('📮 郵便局・会計事務所のおかげで陳情の発生を未然に防いだ!', '📮');
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
