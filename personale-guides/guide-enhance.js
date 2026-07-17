/* Shared guide chrome: help bar, section jump, print, offline (PWA).
   Injected on every personale-guide page. Progressive: degrades to nothing. */
(function () {
  if (window.__lcGuide) return;
  window.__lcGuide = 1;

  var MAIL = 'support@livecloud.dk', TEL = '+4593104585', PHONE = '93 10 45 85';

  var css = document.createElement('style');
  css.textContent = [
    '.lc-help{position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#0f766e;color:#fff;',
    'font:600 13px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;display:flex;',
    'align-items:center;gap:6px 10px;flex-wrap:wrap;justify-content:center;padding:8px 12px;',
    'box-shadow:0 -2px 14px rgba(0,0,0,.18)}',
    '.lc-help a{color:#fff;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.55)}',
    '.lc-help .lbl{font-weight:800}.lc-help .sep{opacity:.5}',
    '.lc-help button{background:rgba(255,255,255,.2);color:#fff;border:0;border-radius:7px;',
    'padding:5px 11px;font:inherit;cursor:pointer}',
    '.lc-jump{position:fixed;right:13px;bottom:56px;z-index:99999;background:#16161a;color:#fff;',
    'border:0;border-radius:999px;padding:10px 16px;font:800 13px system-ui;cursor:pointer;',
    'box-shadow:0 4px 16px rgba(0,0,0,.3)}',
    '.lc-jm{position:fixed;right:13px;bottom:100px;z-index:99999;background:#fff;color:#16161a;',
    'border:1px solid #e6e6ea;border-radius:14px;padding:7px;max-height:62vh;overflow:auto;',
    'box-shadow:0 14px 44px rgba(0,0,0,.28);display:none;min-width:230px;max-width:82vw}',
    '.lc-jm.open{display:block}',
    '.lc-jm a{display:block;color:#16161a;text-decoration:none;padding:9px 12px;border-radius:9px;',
    'font:600 14px system-ui;border:0}',
    '.lc-jm a:hover,.lc-jm a:active{background:#f2f2f4}',
    'body{padding-bottom:54px}',
    '@media print{.lc-help,.lc-jump,.lc-jm{display:none !important}body{padding-bottom:0 !important}}'
  ].join('');
  document.head.appendChild(css);

  var bar = document.createElement('div');
  bar.className = 'lc-help';
  bar.innerHTML =
    '<span class="lbl">Brug for hjælp?</span>' +
    '<a href="mailto:' + MAIL + '">✉ ' + MAIL + '</a>' +
    '<span class="sep">·</span>' +
    '<a href="tel:' + TEL + '">☎ ' + PHONE + '</a>' +
    '<button type="button" id="lcPrint" title="Print eller gem som PDF">🖨 Print</button>';
  document.body.appendChild(bar);
  document.getElementById('lcPrint').addEventListener('click', function () { window.print(); });

  function fitPad() { document.body.style.paddingBottom = (bar.offsetHeight + 6) + 'px'; }
  fitPad(); window.addEventListener('resize', fitPad);

  function labelOf(h) {
    var c = h.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll('.g1,.who,.eyebrow,.num'),
      function (el) { el.parentNode.removeChild(el); });
    return (c.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 46);
  }

  var heads = Array.prototype.slice.call(document.querySelectorAll('h1[id],h2[id],h3[id]'))
    .filter(function (h) { return (h.textContent || '').trim().length > 1; });
  if (heads.length >= 3) {
    var btn = document.createElement('button');
    btn.className = 'lc-jump'; btn.type = 'button'; btn.textContent = '≡ Hop til';
    var menu = document.createElement('div'); menu.className = 'lc-jm';
    heads.forEach(function (h) {
      var a = document.createElement('a'); a.href = '#' + h.id;
      a.textContent = labelOf(h);
      a.addEventListener('click', function () { menu.classList.remove('open'); });
      menu.appendChild(a);
    });
    document.body.appendChild(btn); document.body.appendChild(menu);
    btn.addEventListener('click', function (e) { e.stopPropagation(); menu.classList.toggle('open'); });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && e.target !== btn) menu.classList.remove('open');
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
