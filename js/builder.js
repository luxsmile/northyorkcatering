// "Build Your Menu": customers choose their own dishes, step by step, on separate pages.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var app = document.getElementById('app');
  var page = document.body.getAttribute('data-page');
  var type = document.body.getAttribute('data-build');
  var money = function (n) { return NYC.money(n); };

  // ---------------------------------------------------------------
  // The builders. Each has steps; each step lists the items on offer.
  // Edit the item ids to change what customers can pick.
  // (Item ids come from js/data.js.)
  // ---------------------------------------------------------------
  var BUILDERS = {
    breakfast: {
      file: 'build-breakfast.html', title: 'Build Your Breakfast', short: 'Breakfast', occasion: 'Breakfast meeting', image: 'slide-brunch.jpg',
      blurb: 'Sandwiches, bagels, pastries, fruit and fresh coffee for early meetings. Choose every part of your morning.',
      steps: [
        { name: 'Something savoury', desc: 'Breakfast sandwiches, wraps and cooked breakfasts.', items: ['egg-sandwich', 'bacon-sandwich', 'veg-wrap', 'lox-bagel', 'english', 'brunch'] },
        { name: 'Bagels and bakery', desc: 'Fresh bagels, croissants and pastries.', items: ['bagel-box', 'croissants', 'pastry-box'] },
        { name: 'Fresh fruit', desc: 'Fruit cups and platters.', items: ['fruit-cups', 'fruit-tray', 'fruit-berries', 'fruit-citrus'] },
        { name: 'Beverages', desc: 'Coffee, tea and juices.', items: ['coffee-box', 'juice', 'lemonade'] }
      ]
    },
    lunch: {
      file: 'build-lunch.html', title: 'Build Your Lunch', short: 'Lunch', occasion: 'Team lunch', image: 'slide-salads.jpg',
      blurb: 'Salads, sandwiches, wraps and hot entrées for the team. Choose what goes on the table.',
      steps: [
        { name: 'Salads', desc: 'Fresh, generous salads.', items: ['caesar', 'greek', 'garden', 'caprese', 'rainbow', 'grain', 'cobb', 'berry'] },
        { name: 'Sandwiches and wraps', desc: 'Sandwiches, paninis, wraps and burgers.', items: ['sand-plat', 'panini', 'wraps', 'burgers'] },
        { name: 'Hot entrées', desc: 'Salmon, chicken, pasta, pizza and more.', items: ['salmon', 'chicken', 'pasta', 'lasagna', 'pizza', 'quiche', 'wings'] },
        { name: 'Platters and sides', desc: 'Sharing platters, meze and fruit.', items: ['cheese', 'meze', 'hummus', 'dips', 'fruit-p', 'fruit-cups'] },
        { name: 'Beverages', desc: 'Hot and cold drinks.', items: ['coffee-box', 'lemonade', 'juice'] }
      ]
    },
    party: {
      file: 'build-party.html', title: 'Build Your Celebration', short: 'Platters & Party', occasion: 'Celebration', image: 'slide-platter.jpg',
      blurb: 'Boards, meze, canapés, hot bites, sweets and drinks for parties and receptions. Compose the whole spread.',
      steps: [
        { name: 'Boards and platters', desc: 'Cheese, charcuterie and grazing boards.', items: ['cheese', 'charcuterie', 'cheese-fruit', 'sharing', 'grazing-harvest'] },
        { name: 'Meze and dips', desc: 'Dips, meze and warm pita.', items: ['meze', 'meze-garden', 'meze-grand', 'hummus', 'dips'] },
        { name: 'Hot bites', desc: 'Pizza, wings, skewers and canapés.', items: ['pizza', 'wings', 'skewers', 'canape', 'panini'] },
        { name: 'Fruit and sweets', desc: 'Fruit platters and dessert boards.', items: ['fruit-p', 'fruit-berries', 'fruit-citrus', 'sweet-board', 'pastry-box'] },
        { name: 'Beverages and bar', desc: 'Soft drinks, cocktails, wine and sparkling.', items: ['lemonade', 'juice', 'coffee-box', 'cocktails', 'wine'] }
      ]
    },
    full: {
      file: 'build-full.html', title: 'Build From the Full Menu', short: 'The Full Menu', occasion: 'Custom menu', image: 'slide-office.jpg',
      blurb: 'Every collection is open to you. Mix breakfast, lunch, platters and drinks in any way you like.',
      steps: null // built from all the collections
    }
  };
  function stepsFor(b) {
    if (b.steps) return b.steps;
    return CATALOG.categories.map(function (c) { return { name: c.name, desc: c.blurb, items: CATALOG.items.filter(function (i) { return i.cat === c.id; }).map(function (i) { return i.id; }) }; });
  }

  function banner(title, sub, image, kicker) {
    return '<section class="lux-banner relative overflow-hidden text-white">' +
      '<img src="images/' + image + '" alt="" class="absolute inset-0 w-full h-full object-cover"><div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85"></div>' +
      '<div class="pointer-events-none absolute inset-3 sm:inset-5 border border-sun/60"></div><div class="pointer-events-none absolute inset-4 sm:inset-7 border border-sun/20"></div>' +
      '<div class="relative max-w-5xl mx-auto px-8 sm:px-12 py-16 md:py-24 text-center"><p class="label !text-sun mb-4">' + kicker + '</p>' +
      '<h1 class="font-head font-semibold uppercase text-5xl md:text-7xl tracking-[.08em] leading-tight">' + title + '</h1>' +
      '<div class="flex items-center justify-center gap-3 my-6"><span class="h-px w-16 sm:w-24 bg-sun"></span><span class="text-sun text-sm">&#9670;</span><span class="h-px w-16 sm:w-24 bg-sun"></span></div>' +
      '<p class="max-w-2xl mx-auto font-head italic text-2xl md:text-3xl text-white/90 leading-snug">' + sub + '</p></div></section>';
  }
  function crumbs(list) {
    return '<nav class="text-xs sm:text-sm text-mute flex flex-wrap gap-2 items-center" aria-label="Breadcrumb">' +
      list.map(function (c) { return c[1] ? '<a class="hover:text-coral hover:underline" href="' + c[1] + '">' + c[0] + '</a>' : '<span class="text-ink font-semibold">' + c[0] + '</span>'; }).join('<span>&rsaquo;</span>') + '</nav>';
  }

  // =================== LANDING: choose what to build ===================
  function home() {
    var order = ['breakfast', 'lunch', 'party', 'full'];
    app.innerHTML =
      banner('Build Your Menu', 'Choose what you would like, dish by dish. Your menu, entirely your way.', 'slide-meze.jpg', 'Compose it yourself') +
      '<section class="max-w-7xl mx-auto px-6 pt-8">' + crumbs([['Home', 'home.html'], ['Build Your Menu']]) + '</section>' +
      '<section class="max-w-7xl mx-auto px-6 py-12">' +
        '<div class="grid md:grid-cols-3 gap-6 text-center mb-14">' +
          [['1', 'Choose your occasion', 'Breakfast, lunch, a celebration, or the full menu.'], ['2', 'Pick your dishes', 'Go step by step and choose exactly what you want, in the size you want.'], ['3', 'Order it', 'Add your menu to the cart and check out. We prepare it fresh and deliver.']].map(function (s) {
            return '<div><p class="mx-auto w-14 h-14 rounded-full bg-ink text-white font-head font-semibold text-3xl flex items-center justify-center">' + s[0] + '</p><h2 class="font-head uppercase font-semibold text-2xl tracking-wide mt-3">' + s[1] + '</h2><p class="text-mute text-sm mt-1">' + s[2] + '</p></div>';
          }).join('') + '</div>' +
        '<div class="grid sm:grid-cols-2 gap-6">' + order.map(function (k) {
          var b = BUILDERS[k], n = stepsFor(b).length;
          return '<a href="' + b.file + '" class="zoom card relative block overflow-hidden h-72 sm:h-80 bg-ink">' +
            '<img src="images/' + b.image + '" alt="" class="absolute inset-0 w-full h-full object-cover" loading="lazy"><div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"></div>' +
            '<div class="pointer-events-none absolute inset-3 border border-sun/50"></div>' +
            '<div class="absolute bottom-0 p-8 text-white"><p class="label !text-sun mb-2">' + n + ' steps</p><h3 class="font-head uppercase font-semibold text-3xl md:text-4xl tracking-wide">' + b.title + '</h3><p class="text-white/85 text-sm mt-2 max-w-md">' + b.blurb + '</p><span class="inline-block mt-4 text-xs uppercase tracking-[.2em] font-semibold border-b border-sun pb-1">Start building &rarr;</span></div></a>';
        }).join('') + '</div>' +
        '<p class="text-center text-mute mt-12">Looking for something that is not on the menu? Call us on <a href="tel:+16472133355" class="font-bold underline">(647) 213-3355</a> and we will create it for you.</p>' +
      '</section>';
  }

  // =================== A BUILDER PAGE ===================
  function builder() {
    var b = BUILDERS[type]; if (!b) { app.innerHTML = '<p class="p-10">Builder not found.</p>'; return; }
    var steps = stepsFor(b).map(function (s) { return { name: s.name, desc: s.desc, items: s.items.map(NYC.item).filter(Boolean) }; });
    var KEY = 'nyc_build_' + type;
    var state; try { state = JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { state = {}; }
    state.sel = state.sel || {}; state.guests = state.guests || ''; state.date = state.date || ''; state.note = state.note || '';
    function save() { sessionStorage.setItem(KEY, JSON.stringify(state)); }
    function sizesOf(it) { return NYC.sizesFor(it, 'catering'); }
    var tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    var total = steps.reduce(function (n, s) { return n + s.items.length; }, 0);

    app.innerHTML =
      banner(b.title, b.blurb, b.image, 'Step by step') +
      '<section class="max-w-7xl mx-auto px-6 pt-8">' + crumbs([['Home', 'home.html'], ['Build Your Menu', 'build.html'], [b.short]]) + '</section>' +
      '<section class="max-w-7xl mx-auto px-6 py-8">' +
        '<div class="bg-peach border border-line p-5 grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr] gap-5 items-end">' +
          '<label class="block"><span class="label block mb-1">Number of guests</span><input id="g" type="number" min="1" class="field" placeholder="e.g. 25" value="' + state.guests + '"></label>' +
          '<label class="block"><span class="label block mb-1">Date</span><input id="d" type="date" min="' + tomorrow + '" class="field" value="' + state.date + '"></label>' +
          '<div><span class="label block mb-2">Show only</span><div class="flex flex-wrap gap-2" id="diets">' +
            Object.keys(CATALOG.diets).map(function (k) { return '<label class="chip"><input type="checkbox" value="' + k + '"><span>' + CATALOG.diets[k] + '</span></label>'; }).join('') + '</div></div>' +
        '</div>' +
        '<div class="grid lg:grid-cols-[1fr_380px] gap-8 mt-8"><div id="steps"></div><aside id="summary" class="lg:sticky lg:top-32 self-start"></aside></div>' +
      '</section>' +
      '<div id="bar" class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-ink text-white px-5 py-3 flex items-center justify-between gap-3 hidden"><span id="bar-text" class="text-sm"></span><a href="#summary" class="btn btn-sun !py-2 !px-5 !text-[.65rem]">View and order</a></div>';

    // ---------- steps ----------
    function stepsHtml() {
      return steps.map(function (s, n) {
        return '<section class="mb-12" data-step="' + n + '"><p class="label mb-1">Step ' + (n + 1) + ' of ' + steps.length + '</p><h2 class="font-head uppercase font-semibold text-3xl tracking-wide">' + s.name + '</h2><p class="text-mute text-sm mb-5">' + s.desc + '</p>' +
          '<div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">' + s.items.map(cardHtml).join('') + '</div></section>';
      }).join('');
    }
    function cardHtml(it) {
      var sz = sizesOf(it), cur = state.sel[it.id] || { qty: 0, size: 0 };
      var tags = it.tags.map(function (t) { return '<span class="text-[.6rem] font-semibold uppercase tracking-wider bg-mint text-ink rounded-full px-2 py-0.5">' + t + '</span>'; }).join(' ');
      return '<div class="pick bg-white border ' + (cur.qty ? 'border-ink shadow-md' : 'border-line') + ' overflow-hidden flex flex-col" data-id="' + it.id + '" data-diet="' + it.diet.join(' ') + '">' +
        '<div class="overflow-hidden aspect-[4/3]"><img src="' + it.image + '" alt="' + it.name + '" class="w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src=\'images/placeholder.svg\'"></div>' +
        '<div class="p-4 flex-1 flex flex-col"><h3 class="font-head uppercase font-semibold text-lg tracking-wide leading-snug">' + it.name + '</h3>' +
        '<p class="text-mute text-sm mt-1">' + it.desc + '</p><div class="mt-2 flex flex-wrap gap-1">' + tags + '</div>' +
        '<div class="mt-auto pt-4"><select data-size class="field !py-2 !text-xs" aria-label="Size for ' + it.name + '">' +
          sz.map(function (s, i) { return '<option value="' + i + '" ' + (cur.size === i ? 'selected' : '') + '>' + s.name + ' · serves ' + s.serves + ' · ' + money(s.price) + '</option>'; }).join('') + '</select>' +
        '<div class="mt-3 flex items-center justify-between"><div class="flex items-center border-2 border-line rounded-full bg-white"><button type="button" data-dec class="w-10 h-10 text-xl font-bold" aria-label="Fewer">&minus;</button><span data-qty class="w-8 text-center font-semibold">' + cur.qty + '</span><button type="button" data-inc class="w-10 h-10 text-xl font-bold" aria-label="More">+</button></div>' +
        '<a class="text-[.65rem] uppercase tracking-[.15em] font-semibold border-b border-ink" href="product.html?id=' + it.id + '&mode=catering" target="_blank" rel="noopener">Details</a></div></div></div></div>';
    }
    $('#steps').innerHTML = stepsHtml();

    // ---------- summary ----------
    function lines() {
      var out = [];
      steps.forEach(function (s) { s.items.forEach(function (it) { var c = state.sel[it.id]; if (c && c.qty > 0 && !out.some(function (o) { return o.it.id === it.id; })) out.push({ it: it, c: c, size: sizesOf(it)[c.size] || sizesOf(it)[0] }); }); });
      return out;
    }
    function renderSummary() {
      var L = lines(), count = L.reduce(function (n, l) { return n + l.c.qty; }, 0), sub = L.reduce(function (n, l) { return n + (l.size.price || 0) * l.c.qty; }, 0);
      var guests = state.guests ? state.guests + ' guests' : 'Guests not set', date = state.date || 'Date not set';
      $('#summary').innerHTML =
        '<div class="bg-white border border-ink p-6"><p class="label mb-1">' + b.short + '</p><h3 class="font-head uppercase font-semibold text-3xl tracking-wide">Your menu</h3><p class="text-xs text-mute mt-1">' + guests + ' &nbsp;·&nbsp; ' + date + '</p><div class="rule my-4"></div>' +
        (L.length ? '<ul class="divide-y divide-line">' + L.map(function (l) {
          return '<li class="py-3 flex gap-3 justify-between text-sm"><span><b>' + l.c.qty + ' &times; ' + l.it.name + '</b><br><span class="text-mute">' + l.size.name + ' · serves ' + l.size.serves + '</span></span><span class="text-right shrink-0"><span class="font-semibold">' + ((l.size.price || 0) > 0 ? money(l.size.price * l.c.qty) : '$') + '</span><br><button type="button" data-remove="' + l.it.id + '" class="text-xs text-coral underline">Remove</button></span></li>';
        }).join('') + '</ul>' :
        '<p class="text-mute text-sm">Nothing chosen yet. Start with step 1 and add the dishes you would like.</p>') +
        '<div class="flex justify-between font-head text-2xl mt-4 pt-4 border-t-2 border-line"><span>Subtotal</span><span class="text-coral">' + (sub > 0 ? money(sub) : '$') + '</span></div>' +
        '<label class="block mt-4"><span class="label block mb-1">Special requests</span><textarea id="n" rows="3" class="field" placeholder="Dietary needs, names on labels, delivery notes">' + state.note.replace(/</g, '') + '</textarea></label>' +
        '<button type="button" id="add" class="btn btn-coral w-full mt-4" ' + (L.length ? '' : 'disabled style="opacity:.45;cursor:not-allowed"') + '>Add menu to cart</button>' +
        '<p id="msg" class="text-sm text-coral mt-2 hidden"></p>' +
        (L.length ? '<button type="button" id="clear" class="block mx-auto mt-3 text-xs text-mute underline">Clear my menu</button>' : '') + '<div class="mt-5">' + NYC.help() + '</div></div>';
      var bar = $('#bar');
      if (L.length) { bar.classList.remove('hidden'); $('#bar-text').innerHTML = '<b>' + count + '</b> item' + (count === 1 ? '' : 's') + ' in your menu'; } else bar.classList.add('hidden');
    }
    renderSummary();

    // ---------- interactions ----------
    function setCard(id) {
      var el = $('.pick[data-id="' + id + '"]'); if (!el) return; var c = state.sel[id] || { qty: 0, size: 0 };
      $('[data-qty]', el).textContent = c.qty; $('[data-size]', el).value = c.size;
      el.classList.toggle('border-ink', c.qty > 0); el.classList.toggle('shadow-md', c.qty > 0); el.classList.toggle('border-line', !(c.qty > 0));
    }
    $('#steps').addEventListener('click', function (e) {
      var card = e.target.closest('.pick'); if (!card) return; var id = card.getAttribute('data-id');
      var c = state.sel[id] || (state.sel[id] = { qty: 0, size: +$('[data-size]', card).value });
      if (e.target.closest('[data-inc]')) c.qty += 1;
      else if (e.target.closest('[data-dec]')) c.qty = Math.max(0, c.qty - 1);
      else return;
      save(); setCard(id); renderSummary();
    });
    $('#steps').addEventListener('change', function (e) {
      var sel = e.target.closest('[data-size]'); if (!sel) return; var card = sel.closest('.pick'), id = card.getAttribute('data-id');
      var c = state.sel[id] || (state.sel[id] = { qty: 0, size: 0 }); c.size = +sel.value; save(); renderSummary();
    });
    $('#g').addEventListener('input', function () { state.guests = this.value; save(); renderSummary(); });
    $('#d').addEventListener('change', function () { state.date = this.value; save(); renderSummary(); });
    $('#diets').addEventListener('change', function () {
      var on = Array.prototype.map.call(document.querySelectorAll('#diets input:checked'), function (x) { return x.value; });
      document.querySelectorAll('.pick').forEach(function (p) { var d = p.getAttribute('data-diet').split(' '); p.style.display = on.every(function (k) { return d.indexOf(k) !== -1; }) ? '' : 'none'; });
      document.querySelectorAll('[data-step]').forEach(function (s) { var any = Array.prototype.some.call(s.querySelectorAll('.pick'), function (p) { return p.style.display !== 'none'; }); s.style.display = any ? '' : 'none'; });
    });
    $('#summary').addEventListener('click', function (e) {
      var rm = e.target.closest('[data-remove]');
      if (rm) { var id = rm.getAttribute('data-remove'); if (state.sel[id]) state.sel[id].qty = 0; save(); setCard(id); renderSummary(); return; }
      if (e.target.closest('#clear')) { state.sel = {}; save(); $('#steps').innerHTML = stepsHtml(); renderSummary(); return; }
      if (e.target.closest('#add')) {
        var L = lines(); if (!L.length) return;
        state.note = ($('#n') || {}).value || ''; save();
        var head = 'Menu: ' + b.short + (state.guests ? ' · ' + state.guests + ' guests' : '') + (state.date ? ' · ' + state.date : '') + (state.note ? ' · ' + state.note : '');
        L.forEach(function (l) { NYC.cart.add({ id: l.it.id, name: l.it.name, image: l.it.image, mode: 'catering', size: l.size.name, sizePrice: l.size.price, addons: [], qty: l.c.qty, note: head }); });
        localStorage.setItem('nyc_meta', JSON.stringify({ guests: state.guests, date: state.date, occasion: b.occasion }));
        sessionStorage.removeItem(KEY);
        location.href = 'cart.html';
      }
    });
    $('#summary').addEventListener('input', function (e) { if (e.target.id === 'n') { state.note = e.target.value; save(); } });
  }

  if (page === 'buildhome') home(); else if (page === 'builder') builder();
})();
