/* ============================================
   AI Studio Common JS
   ============================================ */

// ── Tab switching ──
function initTabs(tabsSelector, contentsSelector) {
  const tabs = document.querySelectorAll(tabsSelector);
  const contents = document.querySelectorAll(contentsSelector);
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });
}

// ── FAQ accordion ──
function initFaq(selector) {
  document.querySelectorAll(selector).forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}

// ── Countdown timer ──
function initCountdown(targetDateStr, ids) {
  function update() {
    const now = new Date();
    const target = new Date(targetDateStr);
    const diff = target - now;
    if (diff <= 0) {
      Object.values(ids).forEach(id => { const el = document.getElementById(id); if(el) el.textContent = '00'; });
      return;
    }
    const days  = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const mins  = Math.floor((diff % (1000*60*60)) / (1000*60));
    const secs  = Math.floor((diff % (1000*60)) / 1000);
    const pad = n => String(n).padStart(2,'0');
    if(ids.days)  { const el = document.getElementById(ids.days);  if(el) el.textContent = pad(days); }
    if(ids.hours) { const el = document.getElementById(ids.hours); if(el) el.textContent = pad(hours); }
    if(ids.mins)  { const el = document.getElementById(ids.mins);  if(el) el.textContent = pad(mins); }
    if(ids.secs)  { const el = document.getElementById(ids.secs);  if(el) el.textContent = pad(secs); }
  }
  update();
  setInterval(update, 1000);
}

// ── Count up animation ──
function countUp(elementId, target, duration = 1200) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const start = 0;
  const step = target / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

// ── Like button toggle ──
function initLikes(selector) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', () => {
      const isLiked = btn.classList.toggle('liked');
      const countEl = btn.querySelector('.like-count');
      if (countEl) {
        let count = parseInt(countEl.textContent.replace(/,/g,'')) || 0;
        countEl.textContent = (isLiked ? count + 1 : Math.max(0, count - 1)).toLocaleString();
      }
      btn.style.color = isLiked ? 'var(--color-point)' : 'var(--text-subtle)';
    });
  });
}

// ── State toggle (진행전/진행중) ──
function initStateToggle(btnSelector, states) {
  document.querySelectorAll(btnSelector).forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll(btnSelector).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const state = btn.dataset.state;
      Object.entries(states).forEach(([key, el]) => {
        const target = document.getElementById(el);
        if (target) target.classList.toggle('hidden', key !== state);
      });
    });
  });
}
