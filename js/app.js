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
  NYC.serves = function (it, mode) {
    var sizes = NYC.sizesFor(it, mode);
    if (!sizes.length) return '';
    if (mode === 'lunch') return 'Individual portion';
    var nums = sizes.map(function (s) { return (s.serves.match(/\d+/g) || []).map(Number); }).reduce(function (a, b) { return a.concat(b); }, []);
    return nums.length ? 'Serves ' + Math.min.apply(null, nums) + ' to ' + Math.max.apply(null, nums) + ' guests' : '';
  };
  NYC.card = function (it, mode) {
    var from = NYC.priceFrom(it, mode);
    var tags = it.tags.map(function (t) { return '<span class="text-[.6rem] font-semibold uppercase tracking-wider bg-mint text-branddk rounded-full px-2 py-0.5">' + t + '</span>'; }).join(' ');
    return '<a href="product.html?id=' + it.id + '&mode=' + mode + '" class="zoom card block bg-white rounded-2xl overflow-hidden shadow-sm">' +
      '<div class="overflow-hidden aspect-square"><img src="' + it.image + '" alt="' + it.name + '" class="w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src=\'images/placeholder.svg\'"></div>' +
      '<div class="p-4"><h3 class="font-head uppercase font-semibold text-lg tracking-wide leading-snug">' + it.name + '</h3>' +
      '<p class="text-xs text-coral font-semibold mt-1">' + NYC.serves(it, mode) + '</p>' +
      '<p class="text-mute text-sm mt-1 line-clamp-2">' + it.desc + '</p>' +
      '<div class="mt-2 flex flex-wrap gap-1">' + tags + '</div>' +
      '<p class="mt-3 flex items-center justify-between"><span class="font-head font-semibold text-xl text-coral">' + (from === null ? '$' : 'From ' + NYC.money(from)) + '</span>' +
      '<span class="text-[.68rem] uppercase tracking-[.15em] font-semibold text-ink">Choose &rsaquo;</span></p></div></a>';
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

  // "Need help?" box shown on cart, checkout, item and builder pages
  NYC.help = function () {
    return '<div class="border border-line bg-peach p-4 text-sm leading-relaxed"><p class="font-head uppercase font-semibold tracking-wide text-lg">Need help?</p>' +
      '<p class="text-mute">If you need anything, just call <a href="tel:+16472133355" class="font-semibold text-ink underline">(647) 213-3355</a> or email <a href="mailto:ardestani@yahoo.com" class="font-semibold text-ink underline">ardestani@yahoo.com</a>. We are happy to help.</p>' +
      '<p class="text-xs text-mute mt-1">Monday to Saturday, 7:00 am to 9:00 pm</p></div>';
  };

  // ---------- header / footer ----------
  function nav(label, href, key, current) {
    var on = current === key;
    return '<a href="' + href + '" class="py-2 whitespace-nowrap border-b-2 ' + (on ? 'border-ink' : 'border-transparent hover:border-coral') + '">' + label + '</a>';
  }
  function header() {
    var cur = document.body.getAttribute('data-nav') || '';
    var u = NYC.user.get();
    var acct = u ? 'Hi, ' + (u.name || 'friend').split(' ')[0] : 'Login';
    return '' +
    '<div class="bg-navy text-white text-xs sm:text-sm font-medium py-2 px-4 tracking-wide border-b border-sun/40"><div class="max-w-7xl mx-auto flex items-center justify-between gap-4">' +
      '<a href="build.html" class="hover:text-sun"><span class="hidden sm:inline">Planning a holiday celebration? Ask us about festive menus and beverages.</span><span class="sm:hidden">Holiday celebration? Ask us.</span></a>' +
      '<a href="tel:+16472133355" class="font-semibold whitespace-nowrap hover:text-sun">Call (647) 213-3355</a></div></div>' +
    '<div class="bg-white text-ink border-b border-line shadow-sm"><div class="max-w-7xl mx-auto flex items-center gap-4 px-4 sm:px-6 py-3">' +
      '<a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="North York Catering, home"><img src="logo-mark.svg" alt="" class="h-11 w-auto">' +
        '<span class="leading-none"><span class="block font-head font-bold text-xl sm:text-2xl md:text-[1.7rem] tracking-[.18em] uppercase">North York</span><span class="block font-head font-semibold text-[.6rem] sm:text-[.68rem] tracking-[.4em] uppercase mt-1.5 text-coral">Fine Catering</span></span></a>' +
      '<nav class="hidden lg:flex items-center gap-6 xl:gap-8 font-head text-[1.05rem] uppercase tracking-[.12em] font-semibold ml-8">' +
        nav('Catering', 'catering.html', 'catering', cur) + nav('Signature Lunch', 'takeout.html', 'lunch', cur) + nav('Build Your Menu', 'build.html', 'build', cur) + nav('Locations', 'locations.html', 'locations', cur) + '</nav>' +
      '<form action="category.html" method="get" class="ml-auto hidden md:flex items-center border border-line rounded-full overflow-hidden w-56 lg:w-64 bg-white"><input name="q" type="search" placeholder="Search the menu" aria-label="Search the menu" class="w-full px-4 py-2 text-ink text-sm outline-none"><button class="px-3 text-ink" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button></form>' +
      '<a href="login.html" class="ml-auto md:ml-0 flex items-center gap-2 font-head font-semibold uppercase tracking-[.1em] text-sm sm:text-base hover:text-coral"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg><span class="hidden sm:inline">' + acct + '</span></a>' +
      '<a href="cart.html" class="relative flex items-center gap-2 font-head font-semibold uppercase tracking-[.1em] text-sm sm:text-base hover:text-coral" aria-label="Cart"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg><span class="hidden sm:inline">Cart</span><span data-cart-count class="hidden absolute -top-2 -right-3 sm:right-auto sm:left-4 bg-coral text-white text-[.65rem] font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">0</span></a>' +
      '<button type="button" id="menu-btn" class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-line" aria-label="Menu" aria-expanded="false"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
    '</div>' +
    '<div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-line px-6 pb-5 pt-3 font-head font-semibold uppercase tracking-[.12em] text-lg space-y-3">' +
      '<form action="category.html" method="get" class="flex border border-line rounded-full overflow-hidden"><input name="q" type="search" placeholder="Search the menu" class="w-full px-4 py-2 text-ink text-sm outline-none font-sans normal-case tracking-normal"><button class="px-4 font-bold">Go</button></form>' +
      '<a class="block" href="catering.html">Catering</a><a class="block" href="takeout.html">Signature Lunch</a><a class="block" href="locations.html">Locations</a><a class="block" href="build.html">Build Your Menu</a></div></div>';
  }
  function footer() {
    return '' +
    '<div class="relative overflow-hidden bg-navy text-white"><img src="images/slide-brunch.jpg" alt="" class="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy"><div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/88 to-black"></div><div class="relative h-px bg-gradient-to-r from-transparent via-sun to-transparent"></div><div class="relative max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">' +
      '<div><div class="flex items-center gap-3"><img src="images/logo-mark-light.svg" alt="" class="h-14 w-auto"><div><p class="font-head font-semibold text-2xl md:text-3xl tracking-[.2em] uppercase leading-none">North York</p><p class="font-head font-semibold text-xs tracking-[.4em] uppercase text-sun mt-2">Fine Catering</p></div></div>' +
        '<p class="text-white/70 text-sm mt-5 max-w-sm">Exceptional food for offices, celebrations and private events. Thoughtfully designed around you and delivered across North York, Toronto and the GTA.</p></div>' +
      '<div><p class="font-head uppercase tracking-[.15em] text-sun mb-3">Order</p><ul class="space-y-2 text-sm text-white/80"><li><a class="hover:text-sun" href="catering.html">Catering</a></li><li><a class="hover:text-sun" href="home.html">Home</a></li><li><a class="hover:text-sun" href="takeout.html">Signature Lunch</a></li><li><a class="hover:text-sun" href="build.html">Build Your Menu</a></li><li><a class="hover:text-sun" href="cart.html">Your Cart</a></li></ul></div>' +
      '<div><p class="font-head uppercase tracking-[.15em] text-sun mb-3">Help</p><ul class="space-y-2 text-sm text-white/80"><li><a class="hover:text-sun" href="locations.html">Locations &amp; Delivery</a></li><li><a class="hover:text-sun" href="home.html#faq">Questions</a></li><li><a class="hover:text-sun" href="login.html">Login</a></li><li><a class="hover:text-sun" href="home.html#space">Event Space</a></li></ul></div>' +
      '<div><p class="font-head uppercase tracking-[.15em] text-sun mb-3">Contact</p><ul class="space-y-2 text-sm text-white/80">' +'<li><a class="hover:text-sun" href="tel:+16472133355">(647) 213-3355</a></li>' +'<li><a class="hover:text-sun" href="mailto:ardestani@yahoo.com">ardestani@yahoo.com</a></li>' +'<li>5650 Yonge Street<br>North York, Toronto, ON M2M 4G3</li>' +'<li>Monday to Saturday<br>7:00 am to 9:00 pm</li></ul></div>' +
    '</div><div class="relative border-t border-white/10 text-center text-xs text-white/50 py-5 px-4">&copy; 2026 North York Catering &nbsp;·&nbsp; Prices and checkout on this preview are for demonstration only.</div></div>';
  }


  // ---------- "The experience" large pop-up ----------
  var EXPERIENCE = {
    catering: {
      kicker: 'For grand occasions', title: 'The Catering Experience', image: 'images/slide-office.jpg',
      lead: 'Boardroom luncheons, celebrations and private events, prepared fresh and presented with care.',
      steps: [
        ['Select your menu', 'Browse our collections or ask for something bespoke. Choose a tray size and finishing touches such as fruit cups and beverages.'],
        ['Confirm the details', 'Tell us the date, delivery window, number of guests and any dietary needs. We confirm everything with you.'],
        ['We prepare with care', 'Everything is prepared fresh and arranged beautifully. Dietary requests are packed and labelled separately.'],
        ['Delivered to your door', 'We deliver to your office or venue across North York and Toronto. Ask us about options for larger events.']
      ],
      notes: ['Standing weekly arrangements are available. Just ask.', 'A tasting beforehand can be arranged for special events.', 'Dietary needs are always welcome.'],
      cta: [['Explore Catering', 'catering.html', 'btn-coral'], ['Build Your Menu', 'build.html', 'btn-line']]
    },
    lunch: {
      kicker: 'For intimate gatherings', title: 'The Signature Lunch Experience', image: 'images/slide-lunch.jpg',
      lead: 'Individually presented lunches for private tables and close-knit teams.',
      steps: [
        ['Select your dishes', 'Choose from salads, salmon, sandwiches, wraps and more, one portion or several.'],
        ['Tell us where and when', 'Share your address and the time you would like to dine. We confirm the details with you.'],
        ['Packed with care', 'Each lunch is individually packed and can be labelled with a name and dietary needs.'],
        ['Savour it', 'Your lunches arrive fresh and ready to enjoy. Ask us about delivery or pickup.']
      ],
      notes: ['Labelled with names on request.', 'Perfect for desks, meeting rooms and small tables.', 'Set up a weekly arrangement and we will take care of it.'],
      cta: [['Explore Signature Lunch', 'takeout.html', 'btn-coral'], ['Build Your Menu', 'build.html', 'btn-line']]
    }
  };
  NYC.experience = function (kind) {
    var e = EXPERIENCE[kind]; if (!e) return;
    var prev = document.activeElement;
    var wrap = document.createElement('div');
    wrap.className = 'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6';
    wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true'); wrap.setAttribute('aria-label', e.title);
    wrap.innerHTML =
      '<div data-close class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>' +
      '<div class="pop relative bg-white w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl grid md:grid-cols-[2fr_3fr]">' +
        '<button type="button" data-close aria-label="Close" class="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white border border-line text-2xl leading-none hover:bg-ink hover:text-white">&times;</button>' +
        '<div class="relative min-h-[200px] md:min-h-full"><img src="' + e.image + '" alt="" class="absolute inset-0 w-full h-full object-cover"><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>' +
          '<p class="absolute bottom-5 left-6 right-6 text-white font-head text-2xl italic">' + e.lead + '</p></div>' +
        '<div class="p-7 sm:p-10"><p class="label mb-2">' + e.kicker + '</p><h2 class="font-head font-bold text-3xl sm:text-4xl uppercase tracking-wide leading-tight">' + e.title + '</h2><div class="rule my-5"></div>' +
          '<ol class="space-y-5">' + e.steps.map(function (s, i) { return '<li class="flex gap-4"><span class="shrink-0 font-head text-4xl text-coral leading-none w-10">0' + (i + 1) + '</span><span><b class="block font-head uppercase tracking-wide text-xl">' + s[0] + '</b><span class="text-mute text-sm leading-relaxed">' + s[1] + '</span></span></li>'; }).join('') + '</ol>' +
          '<ul class="mt-7 grid gap-2 text-sm border-t border-line pt-5">' + e.notes.map(function (n) { return '<li class="flex gap-2"><span class="text-coral">&#10003;</span><span>' + n + '</span></li>'; }).join('') + '</ul>' +
          '<p class="mt-5 text-sm">Questions? Call <b>(647) 213-3355</b></p>' +
          '<div class="mt-6 flex flex-wrap gap-3">' + e.cta.map(function (c) { return '<a href="' + c[1] + '" class="btn ' + c[2] + '">' + c[0] + '</a>'; }).join('') + '</div></div></div>';
    document.body.appendChild(wrap); document.body.style.overflow = 'hidden';
    function close() { wrap.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); }
    function onKey(ev) { if (ev.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', function (ev) { if (ev.target.closest('[data-close]')) close(); else if (ev.target.closest('a')) { close(); } });
    wrap.querySelector('button[data-close]').focus();
  };

  document.addEventListener('DOMContentLoaded', function () {
    var h = document.getElementById('site-header'), f = document.getElementById('site-footer');
    if (h) { h.innerHTML = header(); h.className = 'fixed top-0 inset-x-0 z-30'; }
    if (f) f.innerHTML = footer();
    NYC.badge();
    document.addEventListener('click', function (ev) { var b = ev.target.closest('[data-experience]'); if (b) { ev.preventDefault(); NYC.experience(b.getAttribute('data-experience')); } });
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
