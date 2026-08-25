// タウンDELUXE エントリーポイント
document.addEventListener('DOMContentLoaded', () => {
  Effects.init();
  Game.init();
  UI.init();
  if (Game.getState().muted) document.getElementById('mute-btn').textContent = '🔇';
});
