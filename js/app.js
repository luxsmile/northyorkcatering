// Shared parts of the site: header, footer, cart, login, small helpers.
(function () {
  var KEYS = { cart: 'nyc_cart', user: 'nyc_user', orders: 'nyc_orders' };
  var HST = 0.13; // Ontario sales tax

  function read(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } }
  function write(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  var NYC = window.NYC = {};

  // ---------- money ----------
  NYC.money = function (n) { return (n === null || n === undefined || isNaN(n)) ? '$' : '$' + Number(n).toFixed(2); };

  // ---------- catalog helpers ----------
  NYC.item = function (id) { return CATALOG.items.filter(function (i) { return i.id === id; })[0]; };
  NYC.category = function (id) { return CATALOG.categories.filter(function (c) { return c.id === id; })[0]; };
  NYC.priceFrom = function (it, mode) {
    var sizes = NYC.sizesFor(it, mode), p = sizes.map(function (s) { return s.price; }).filter(function (x) { return x !== null; });
    return p.length ? Math.min.apply(null, p) : null;
  };
  NYC.sizesFor = function (it, mode) {
    var want = mode === 'lunch' ? 'single' : 'group';
    var s = it.sizes.filter(function (x) { return x.kind === want; });
    return s.length ? s : it.sizes;
  };
  NYC.card = function (it, mode) {
    var from = NYC.priceFrom(it, mode);
    var tags = it.tags.map(function (t) { return '<span class="text-[.6rem] font-semibold uppercase tracking-wider bg-mint text-branddk rounded-full px-2 py-0.5">' + t + '</span>'; }).join(' ');
    return '<a href="product.html?id=' + it.id + '&mode=' + mode + '" class="zoom card block bg-white rounded-2xl overflow-hidden shadow-sm">' +
      '<div class="overflow-hidden aspect-square"><img src="' + it.image + '" alt="' + it.name + '" class="w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src=\'images/placeholder.svg\'"></div>' +
      '<div class="p-4"><h3 class="font-head uppercase font-semibold text-lg tracking-wide leading-snug">' + it.name + '</h3>' +
      '<p class="text-mute text-sm mt-1 line-clamp-2">' + it.desc + '</p>' +
      '<div class="mt-2 flex flex-wrap gap-1">' + tags + '</div>' +
      '<p class="mt-3 flex items-center justify-between"><span class="font-head font-semibold text-xl text-coral">' + (from === null ? '$' : 'From ' + NYC.money(from)) + '</span>' +
      '<span class="text-[.68rem] uppercase tracking-[.15em] font-semibold text-navy">Choose &rsaquo;</span></p></div></a>';
  };

  // ---------- cart ----------
  NYC.cart = {
    get: function () { return read(KEYS.cart, []); },
    set: function (c) { write(KEYS.cart, c); NYC.badge(); },
    add: function (line) {
      var c = NYC.cart.get();
      line.key = [line.id, line.mode, line.size, line.addons.map(function (a) { return a.id; }).sort().join('+'), line.note || ''].join('|');
      var hit = c.filter(function (x) { return x.key === line.key; })[0];
      if (hit) hit.qty += line.qty; else c.push(line);
      NYC.cart.set(c);
    },
    setQty: function (key, q) {
      var c = NYC.cart.get().map(function (x) { if (x.key === key) x.qty = Math.max(1, q); return x; });
      NYC.cart.set(c);
    },
    remove: function (key) { NYC.cart.set(NYC.cart.get().filter(function (x) { return x.key !== key; })); },
    clear: function () { NYC.cart.set([]); },
    count: function () { return NYC.cart.get().reduce(function (n, x) { return n + x.qty; }, 0); },
    unit: function (l) { return (l.sizePrice || 0) + l.addons.reduce(function (n, a) { return n + (a.price || 0); }, 0); },
    totals: function () {
      var c = NYC.cart.get(), sub = c.reduce(function (n, l) { return n + NYC.cart.unit(l) * l.qty; }, 0);
      var priced = sub > 0;
      return { sub: sub, tax: sub * HST, total: sub * (1 + HST), priced: priced };
    }
  };
  NYC.badge = function () {
    var n = NYC.cart.count();
    document.querySelectorAll('[data-cart-count]').forEach(function (b) { b.textContent = n; b.classList.toggle('hidden', n === 0); });
  };

  // ---------- login (demo: nothing is sent anywhere) ----------
  NYC.user = { get: function () { return read(KEYS.user, null); }, set: function (u) { write(KEYS.user, u); }, clear: function () { localStorage.removeItem(KEYS.user); } };
  NYC.orders = { get: function () { return read(KEYS.orders, []); }, add: function (o) { var a = NYC.orders.get(); a.unshift(o); write(KEYS.orders, a); } };

  // ---------- toast ----------
  NYC.toast = function (html) {
    var t = document.createElement('div');
    t.className = 'toast fixed z-50 bottom-5 left-1/2 -translate-x-1/2 bg-navy text-white rounded-2xl shadow-xl px-5 py-4 text-sm flex items-center gap-4';
    t.innerHTML = html; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 4500);
  };

  // ---------- header / footer ----------
  function nav(label, href, key, current) {
    var on = current === key;
    return '<a href="' + href + '" class="py-2 border-b-4 ' + (on ? 'border-sun' : 'border-transparent hover:border-white/60') + '">' + label + '</a>';
  }
  function header() {
    var cur = document.body.getAttribute('data-nav') || '';
    var u = NYC.user.get();
    var acct = u ? 'Hi, ' + (u.name || 'friend').split(' ')[0] : 'Login';
    return '' +
    '<div class="bg-navy text-white text-xs sm:text-sm font-medium py-2 px-4 tracking-wide"><div class="max-w-7xl mx-auto flex items-center justify-between gap-4">' +
      '<a href="index.html#design" class="hover:text-sun"><span class="hidden sm:inline">Planning a holiday celebration? Ask us about festive menus and beverages.</span><span class="sm:hidden">Holiday celebration? Ask us.</span></a>' +
      '<a href="locations.html" class="font-semibold whitespace-nowrap hover:text-sun">Call [Phone number]</a></div></div>' +
    '<div class="bg-brand text-white shadow-md"><div class="max-w-7xl mx-auto flex items-center gap-4 px-4 sm:px-6 py-3">' +
      '<a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="North York Catering, home"><img src="images/logo-mark-light.svg" alt="" class="h-11 w-auto">' +
        '<span class="leading-none"><span class="block font-head font-semibold text-xl sm:text-2xl md:text-[1.7rem] tracking-[.18em] uppercase">North York</span><span class="block font-head font-semibold text-[.6rem] sm:text-[.68rem] tracking-[.4em] uppercase mt-1.5 text-sun">Fine Catering</span></span></a>' +
      '<nav class="hidden lg:flex items-center gap-8 font-head text-[1.05rem] uppercase tracking-[.1em] font-medium ml-8">' +
        nav('Catering', 'catering.html', 'catering', cur) + nav('Signature Lunch', 'takeout.html', 'lunch', cur) + nav('Locations', 'locations.html', 'locations', cur) + '</nav>' +
      '<form action="category.html" method="get" class="ml-auto hidden md:flex items-center bg-white rounded-full overflow-hidden w-56 lg:w-64"><input name="q" type="search" placeholder="Search the menu" aria-label="Search the menu" class="w-full px-4 py-2 text-ink text-sm outline-none"><button class="px-3 text-brand" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button></form>' +
      '<a href="login.html" class="ml-auto md:ml-0 flex items-center gap-2 font-head uppercase tracking-[.08em] text-sm sm:text-base hover:text-sun"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg><span class="hidden sm:inline">' + acct + '</span></a>' +
      '<a href="cart.html" class="relative flex items-center gap-2 font-head uppercase tracking-[.08em] text-sm sm:text-base hover:text-sun" aria-label="Cart"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg><span class="hidden sm:inline">Cart</span><span data-cart-count class="hidden absolute -top-2 -right-3 sm:right-auto sm:left-4 bg-coral text-white text-[.65rem] font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">0</span></a>' +
      '<button type="button" id="menu-btn" class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/15" aria-label="Menu" aria-expanded="false"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
    '</div>' +
    '<div id="mobile-menu" class="hidden lg:hidden bg-branddk px-6 pb-5 pt-2 font-head uppercase tracking-[.1em] text-lg space-y-3">' +
      '<form action="category.html" method="get" class="flex bg-white rounded-full overflow-hidden"><input name="q" type="search" placeholder="Search the menu" class="w-full px-4 py-2 text-ink text-sm outline-none"><button class="px-4 text-brand font-bold">Go</button></form>' +
      '<a class="block" href="catering.html">Catering</a><a class="block" href="takeout.html">Signature Lunch</a><a class="block" href="locations.html">Locations</a><a class="block" href="index.html#design">Design Your Order</a></div></div>';
  }
  function footer() {
    return '' +
    '<div class="bg-navy text-white"><div class="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">' +
      '<div class="md:col-span-2"><div class="flex items-center gap-3"><img src="images/logo-mark-light.svg" alt="" class="h-14 w-auto"><div><p class="font-head font-semibold text-2xl md:text-3xl tracking-[.2em] uppercase leading-none">North York</p><p class="font-head font-semibold text-xs tracking-[.4em] uppercase text-sun mt-2">Fine Catering</p></div></div>' +
        '<p class="text-white/70 text-sm mt-5 max-w-sm">Exceptional food for offices, celebrations and private events. Thoughtfully designed around you and delivered across North York, Toronto and the GTA.</p></div>' +
      '<div><p class="font-head uppercase tracking-[.15em] text-sun mb-3">Order</p><ul class="space-y-2 text-sm text-white/80"><li><a class="hover:text-sun" href="catering.html">Catering</a></li><li><a class="hover:text-sun" href="takeout.html">Signature Lunch</a></li><li><a class="hover:text-sun" href="index.html#design">Design Your Order</a></li><li><a class="hover:text-sun" href="cart.html">Your Cart</a></li></ul></div>' +
      '<div><p class="font-head uppercase tracking-[.15em] text-sun mb-3">Help</p><ul class="space-y-2 text-sm text-white/80"><li><a class="hover:text-sun" href="locations.html">Locations &amp; Delivery</a></li><li><a class="hover:text-sun" href="index.html#faq">Questions</a></li><li><a class="hover:text-sun" href="login.html">Login</a></li><li><a class="hover:text-sun" href="index.html#space">Event Space</a></li></ul></div>' +
    '</div><div class="border-t border-white/10 text-center text-xs text-white/50 py-5 px-4">&copy; 2026 North York Catering &nbsp;·&nbsp; Prices and checkout on this preview are for demonstration only.</div></div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var h = document.getElementById('site-header'), f = document.getElementById('site-footer');
    if (h) { h.innerHTML = header(); h.className = 'fixed top-0 inset-x-0 z-30'; }
    if (f) f.innerHTML = footer();
    NYC.badge();
    var mb = document.getElementById('menu-btn');
    if (mb) mb.addEventListener('click', function () {
      var m = document.getElementById('mobile-menu'); var open = m.classList.toggle('hidden') === false;
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // "How it works" panels: hover on desktop, tap the button on phones
    document.querySelectorAll('[data-reveal-btn]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var open = b.closest('.reveal-box').classList.toggle('open');
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  });
})();
