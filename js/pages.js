// Page logic for the shop pages. Each page sets data-page on <body>.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var params = new URLSearchParams(location.search);
  var page = document.body.getAttribute('data-page');
  var app = document.getElementById('app');
  var money = function (n) { return NYC.money(n); };

  function modeName(m) { return m === 'lunch' ? 'Signature Lunch' : 'Catering'; }
  function modeHref(m) { return m === 'lunch' ? 'takeout.html' : 'catering.html'; }
  function itemsFor(mode) { return CATALOG.items.filter(function (i) { return mode === 'lunch' ? i.lunch : !i.onlyLunch; }); }
  function crumbs(list) {
    return '<nav class="text-xs sm:text-sm text-mute flex flex-wrap gap-2 items-center" aria-label="Breadcrumb">' +
      list.map(function (c, i) { return c[1] ? '<a class="hover:text-coral underline-offset-2 hover:underline" href="' + c[1] + '">' + c[0] + '</a>' : '<span class="text-ink font-semibold">' + c[0] + '</span>'; }).join('<span>&rsaquo;</span>') + '</nav>';
  }
  var CAT_BANNER = { breakfast: 'slide-brunch.jpg', salads: 'slide-salads.jpg', sandwiches: 'sandwiches.jpg', hot: 'slide-salmon.jpg', platters: 'slide-platter.jpg', drinks: 'champagne.jpg' };
  // Elegant page banner: photo (optional), soft dark veil, thin gold frame, ornament line.
  // Pages without their own photo get an elegant one chosen for the page.
  var BANNER_FOR = { 'Your cart': 'banner-cart.jpg', 'Checkout': 'banner-checkout.jpg', 'Thank you!': 'banner-thanks.jpg', 'Login': 'banner-login.jpg', 'Create account': 'banner-login.jpg', 'Search results': 'banner-search.jpg' };
  function bannerFor(title) { return String(title).indexOf('Hello') === 0 ? 'banner-account.jpg' : (BANNER_FOR[title] || 'banner-login.jpg'); }
  function banner(color, title, sub, extra, image, kicker) {
    image = image || bannerFor(title);
    return '<section class="lux-banner ' + (image ? '' : 'lux-plain') + ' relative overflow-hidden text-white">' +
      (image ? '<img src="images/' + image + '" alt="" class="absolute inset-0 w-full h-full object-cover">' +
        '<div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85"></div>' : '') +
      '<div class="pointer-events-none absolute inset-3 sm:inset-5 border border-sun/60"></div>' +
      '<div class="pointer-events-none absolute inset-4 sm:inset-7 border border-sun/20"></div>' +
      '<div class="relative max-w-5xl mx-auto px-8 sm:px-12 py-16 md:py-24 text-center">' +
        '<p class="label !text-sun mb-4">' + (kicker || 'North York Catering') + '</p>' +
        '<h1 class="font-head font-semibold uppercase text-5xl md:text-7xl tracking-[.08em] leading-tight">' + title + '</h1>' +
        '<div class="flex items-center justify-center gap-3 my-6"><span class="h-px w-16 sm:w-24 bg-sun"></span><span class="text-sun text-sm">&#9670;</span><span class="h-px w-16 sm:w-24 bg-sun"></span></div>' +
        '<p class="max-w-2xl mx-auto font-head italic text-2xl md:text-3xl text-white/90 leading-snug">' + sub + '</p>' + (extra || '') + '</div></section>';
  }

  // =================== SHOP (catering / signature lunch) ===================
  // ---- shared filter helpers ----
  function selectedDiets() { return Array.prototype.map.call(document.querySelectorAll('[data-diet]:checked'), function (x) { return x.getAttribute('data-diet'); }); }
  function matches(it, sel) { return sel.every(function (d) { return it.diet.indexOf(d) !== -1; }); }
  function dietBox(items, sel) {
    return '<fieldset><legend class="font-head uppercase font-semibold text-xl tracking-wide mb-2">Dietary</legend><div class="space-y-2">' +
      Object.keys(CATALOG.diets).map(function (k) {
        var n = items.filter(function (i) { return i.diet.indexOf(k) !== -1; }).length;
        return '<label class="flex items-center justify-between gap-3 cursor-pointer text-sm"><span class="flex items-center gap-3"><input type="checkbox" data-diet="' + k + '" ' + (sel.indexOf(k) !== -1 ? 'checked' : '') + ' class="accent-[#9C7424] w-4 h-4">' + CATALOG.diets[k] + '</span><span class="text-xs text-mute">' + n + '</span></label>';
      }).join('') + '</div></fieldset>';
  }
  function panel(inner) {
    return '<aside class="lg:sticky lg:top-32 self-start"><details id="fpanel" open class="bg-white rounded-3xl shadow-sm p-5"><summary class="cursor-pointer font-head uppercase font-semibold text-2xl tracking-wide flex justify-between items-center">Filters <span class="text-coral text-sm font-sans font-medium normal-case tracking-normal lg:hidden">Show / hide</span></summary><div class="mt-4 space-y-6">' + inner + '<button type="button" id="clear" class="text-sm text-coral underline">Clear all filters</button></div></details></aside>';
  }
  function collapseOnPhones() { var d = document.getElementById('fpanel'); if (d && window.innerWidth < 1024) d.removeAttribute('open'); }
  function count(n) { return n + ' item' + (n === 1 ? '' : 's'); }
  function empty() { return '<div class="bg-white rounded-2xl p-10 text-center text-mute">No items match those filters. <button type="button" class="text-coral underline" data-clear>Clear filters</button>, or <a class="text-coral underline" href="build.html">ask us to create it for you</a>.</div>'; }

  function shop() {
    var mode = document.body.getAttribute('data-mode');
    var items = itemsFor(mode), isL = mode === 'lunch';
    var cats = CATALOG.categories.filter(function (c) { return items.some(function (i) { return i.cat === c.id; }); });
    var how = isL
      ? ['Select the dishes you desire, one or several.', 'Tell us where and when to arrive.', 'Savour fresh, beautifully packed lunches.']
      : ['Select your menu and finishing touches, such as fruit platters and drinks.', 'Confirm your date, time and guest count.', 'We prepare everything fresh and deliver with care.'];
    var state = { cat: 'all' };
    app.innerHTML =
      banner(isL ? 'bg-ink' : 'bg-brand', isL ? 'Signature Lunch' : 'Catering',
        isL ? 'Individually presented lunches for private tables and close-knit teams, effortless to order.' : 'Boardroom luncheons, celebrations and private events, with beautifully presented trays and platters delivered to your door.',
        '<ol class="mt-10 grid sm:grid-cols-3 gap-4 text-sm text-white/95">' + how.map(function (h, i) { return '<li class="flex gap-3 items-start text-left border border-white/25 bg-white/10 backdrop-blur-sm p-4"><span class="shrink-0 w-7 h-7 rounded-full bg-sun text-ink font-bold flex items-center justify-center">' + (i + 1) + '</span><span>' + h + '</span></li>'; }).join('') + '</ol>', isL ? 'slide-lunch.jpg' : 'slide-office.jpg', isL ? 'For intimate gatherings' : 'For grand occasions') +
      '<section class="max-w-7xl mx-auto px-6 pt-8">' + crumbs([['Home', 'home.html'], [modeName(mode)]]) + '</section>' +
      '<section class="max-w-7xl mx-auto px-6 py-10"><h2 class="font-head uppercase font-semibold text-3xl tracking-wide mb-6">Browse the collections</h2>' +
        '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">' + cats.map(function (c) {
          var n = items.filter(function (i) { return i.cat === c.id; }).length;
          return '<a href="category.html?c=' + c.id + '&mode=' + mode + '" class="zoom card relative block rounded-3xl overflow-hidden h-56">' +
            '<img src="images/' + c.image + '" alt="" class="absolute inset-0 w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src=\'images/placeholder.svg\'">' +
            '<div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"></div>' +
            '<div class="absolute bottom-0 p-6 text-white"><h3 class="font-head uppercase font-semibold text-3xl tracking-wide">' + c.name + '</h3><p class="text-sm text-white/90">' + count(n) + ' &nbsp;·&nbsp; Explore &rarr;</p></div></a>';
        }).join('') + '</div></section>' +
      '<section id="all" class="bg-white border-y border-line"><div class="max-w-7xl mx-auto px-6 py-12"><h2 class="font-head uppercase font-semibold text-3xl tracking-wide mb-6">The full collection</h2>' +
        '<div class="grid lg:grid-cols-[260px_1fr] gap-8"><div id="side"></div><div id="results"></div></div></div></section>' +
      '<section class="max-w-4xl mx-auto px-6 py-14 text-center"><h2 class="font-head uppercase font-semibold text-3xl tracking-wide">Dreaming of something else?</h2><p class="text-mute mt-3 mb-6">Compose your own menu, dish by dish, or call us and we will create it for you.</p><a href="build.html" class="btn btn-coral">Build Your Own Menu</a></section>';

    function drawSide() {
      var sel = selectedDiets();
      $('#side').innerHTML = panel(
        '<div><p class="font-head uppercase font-semibold text-xl tracking-wide mb-2">Collections</p><div class="space-y-1 text-sm">' +
          '<button type="button" data-cat="all" class="block w-full text-left py-1 ' + (state.cat === 'all' ? 'font-bold text-coral' : '') + '">All collections <span class="text-mute">(' + items.length + ')</span></button>' +
          cats.map(function (c) { return '<button type="button" data-cat="' + c.id + '" class="block w-full text-left py-1 ' + (state.cat === c.id ? 'font-bold text-coral' : '') + '">' + c.name + ' <span class="text-mute">(' + items.filter(function (i) { return i.cat === c.id; }).length + ')</span></button>'; }).join('') + '</div></div>' +
        dietBox(items, sel));
      collapseOnPhones();
    }
    function drawResults() {
      var sel = selectedDiets();
      var list = items.filter(function (i) { return (state.cat === 'all' || i.cat === state.cat) && matches(i, sel); });
      var html = '<p class="text-sm text-mute mb-4">' + count(list.length) + (sel.length ? ' &nbsp;·&nbsp; ' + sel.map(function (s) { return CATALOG.diets[s]; }).join(', ') : '') + '</p>';
      if (!list.length) { $('#results').innerHTML = html + empty(); return; }
      if (state.cat === 'all') {
        html += cats.map(function (c) {
          var l = list.filter(function (i) { return i.cat === c.id; }); if (!l.length) return '';
          return '<h3 class="font-head uppercase font-semibold text-2xl tracking-wide mt-8 mb-4 first:mt-0 text-branddk">' + c.name + '</h3><div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">' + l.map(function (i) { return NYC.card(i, mode); }).join('') + '</div>';
        }).join('');
      } else html += '<div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">' + list.map(function (i) { return NYC.card(i, mode); }).join('') + '</div>';
      $('#results').innerHTML = html;
    }
    drawSide(); drawResults();
    var all = $('#all');
    all.addEventListener('change', function (e) { if (e.target.hasAttribute('data-diet')) drawResults(); });
    all.addEventListener('click', function (e) {
      var c = e.target.closest('[data-cat]'), cl = e.target.closest('#clear, [data-clear]');
      if (c) { state.cat = c.getAttribute('data-cat'); drawSide(); drawResults(); }
      if (cl) { document.querySelectorAll('[data-diet]').forEach(function (x) { x.checked = false; }); state.cat = 'all'; drawSide(); drawResults(); }
    });
  }

  // =================== CATEGORY (and search results) ===================
  function category() {
    var mode = params.get('mode') === 'lunch' ? 'lunch' : 'catering';
    var q = (params.get('q') || '').trim().toLowerCase();
    if (q) {
      var res = CATALOG.items.filter(function (i) { return (i.name + ' ' + i.desc + ' ' + i.tags.join(' ') + ' ' + i.includes.join(' ')).toLowerCase().indexOf(q) !== -1; });
      app.innerHTML = banner('bg-navy', 'Search results', res.length + ' result' + (res.length === 1 ? '' : 's') + ' for &ldquo;' + q.replace(/</g, '') + '&rdquo;') +
        '<section class="max-w-7xl mx-auto px-6 py-10">' + (res.length ? '<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">' + res.map(function (i) { return NYC.card(i, 'catering'); }).join('') + '</div>' :
          '<p class="text-mute">Nothing matched. Try another word, or <a class="text-coral underline" href="build.html">tell us what you would like</a> and we will make it.</p>') + '</section>';
      return;
    }
    var cat = NYC.category(params.get('c')) || CATALOG.categories[0];
    var items = itemsFor(mode).filter(function (i) { return i.cat === cat.id; });
    var groups = cat.groups.filter(function (g) { return items.some(function (i) { return i.group === g[0]; }); });
    var others = CATALOG.categories.filter(function (c) { return c.id !== cat.id; });
    app.innerHTML =
      banner('', cat.name, cat.blurb, '', CAT_BANNER[cat.id], 'A collection') +
      '<section class="max-w-7xl mx-auto px-6 pt-8">' + crumbs([['Home', 'home.html'], [modeName(mode), modeHref(mode)], [cat.name]]) + '</section>' +
      '<section class="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[260px_1fr] gap-8"><div id="side"></div><div id="results"></div></section>';
    $('#side').innerHTML = panel(
      '<div><p class="font-head uppercase font-semibold text-xl tracking-wide mb-2">In ' + cat.name + '</p><div class="space-y-1 text-sm">' +
        groups.map(function (g) { return '<a href="#g-' + g[0] + '" class="block py-1 hover:text-coral">' + g[1] + '</a>'; }).join('') + '</div></div>' +
      dietBox(items, []) +
      '<div><p class="font-head uppercase font-semibold text-xl tracking-wide mb-2">Other collections</p><div class="space-y-1 text-sm">' +
        others.map(function (c) { return '<a href="category.html?c=' + c.id + '&mode=' + mode + '" class="block py-1 hover:text-coral">' + c.name + '</a>'; }).join('') + '</div></div>');
    collapseOnPhones();
    function draw() {
      var sel = selectedDiets(), shown = 0;
      var html = groups.map(function (g) {
        var l = items.filter(function (i) { return i.group === g[0] && matches(i, sel); }); if (!l.length) return ''; shown += l.length;
        return '<section id="g-' + g[0] + '" class="mb-10"><h2 class="font-head uppercase font-semibold text-3xl tracking-wide mb-5 text-branddk">' + g[1] + ' <span class="text-base text-mute font-sans normal-case tracking-normal">' + count(l.length) + '</span></h2><div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">' + l.map(function (i) { return NYC.card(i, mode); }).join('') + '</div></section>';
      }).join('');
      $('#results').innerHTML = shown ? html : empty();
    }
    draw();
    $('#side').addEventListener('change', function (e) { if (e.target.hasAttribute('data-diet')) draw(); });
    app.addEventListener('click', function (e) { if (e.target.closest('#clear, [data-clear]')) { document.querySelectorAll('[data-diet]').forEach(function (x) { x.checked = false; }); draw(); } });
  }

  // =================== PRODUCT ===================
  function product() {
    var mode = params.get('mode') === 'lunch' ? 'lunch' : 'catering';
    var it = NYC.item(params.get('id'));
    if (!it) { app.innerHTML = '<section class="max-w-3xl mx-auto px-6 py-20 text-center"><h1 class="font-head uppercase text-4xl">We could not find that item</h1><a class="btn btn-coral mt-6" href="catering.html">Back to Catering</a></section>'; return; }
    if (mode === 'lunch' && !it.lunch) mode = 'catering';
    var cat = NYC.category(it.cat), sizes = NYC.sizesFor(it, mode);
    var badge = function (t) { return '<span class="text-xs font-semibold uppercase tracking-wider bg-mint text-branddk rounded-full px-3 py-1">' + t + '</span>'; };
    var acc = function (title, body, open) { return '<details ' + (open ? 'open' : '') + ' class="group border-b-2 border-line py-4"><summary class="cursor-pointer font-head uppercase font-semibold text-xl tracking-wide flex justify-between items-center">' + title + ' <span class="text-coral text-2xl group-open:rotate-45 transition">+</span></summary><div class="mt-3 text-mute text-sm leading-relaxed">' + body + '</div></details>'; };
    var dietBody = (it.tags.length ? '<div class="flex flex-wrap gap-2 mb-3">' + it.tags.map(badge).join('') + '</div><p class="mb-3">Labels are a guide only. Please confirm with us if you have a strict dietary need.</p>' : '<p class="mb-3">This item has no dietary labels. Ask us about adjustments for your guests.</p>') + '<p>' + CATALOG.allergenNote + '</p>';
    app.innerHTML =
      '<section class="max-w-7xl mx-auto px-6 pt-8">' + crumbs([['Home', 'home.html'], [modeName(mode), modeHref(mode)], [cat.name, 'category.html?c=' + cat.id + '&mode=' + mode], [it.name]]) + '</section>' +
      '<section class="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-10">' +
        '<div class="lg:sticky lg:top-32 self-start"><div class="rounded-3xl overflow-hidden shadow-lg bg-white aspect-square lg:aspect-[4/3]"><img src="' + it.image + '" alt="' + it.name + '" class="w-full h-full object-cover" onerror="this.onerror=null;this.src=\'images/placeholder.svg\'"></div>' +
          '<div class="mt-6">' + acc('What’s included', it.includes.length ? '<ul class="list-disc pl-5 space-y-1">' + it.includes.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : 'Ask us for details.', true) +
            acc('Dietary &amp; allergens', dietBody) +
            acc('Serving guide', '<table class="w-full text-left"><tbody>' + sizes.map(function (s) { return '<tr class="border-b border-line"><td class="py-2 font-semibold text-ink">' + s.name + '</td><td class="py-2">' + (s.note || 'Ask us') + '</td></tr>'; }).join('') + '</tbody></table><p class="mt-2">Serving sizes are a guide. If your guests have big appetites, choose the next size up.</p>') +
            acc('Good to know', '<ul class="list-disc pl-5 space-y-1"><li>Ordering lead time: [to be added]</li><li>Delivery fee and minimum order: confirmed with your order</li><li>Served fresh. Cutlery and plates can be added as an extra.</li><li>Prices, taxes and delivery are confirmed on your order.</li></ul>') + '</div></div>' +
        '<form id="pf" class="space-y-7"><div><p class="label mb-2">' + cat.name + ' &nbsp;·&nbsp; ' + modeName(mode) + '</p><h1 class="font-head uppercase font-semibold text-4xl md:text-5xl tracking-wide leading-tight">' + it.name + '</h1>' +
          '<div class="mt-3 flex flex-wrap gap-2">' + it.tags.map(badge).join('') + '</div>' +
          '<p class="text-mute mt-4 text-lg">' + it.desc + '</p></div>' +
          '<div><h2 class="font-head uppercase font-semibold text-xl tracking-wide mb-3">1. Select your size</h2><div class="space-y-2" id="sizes">' +
            sizes.map(function (s, n) { return '<label class="opt"><span class="flex items-center gap-3"><input type="radio" name="size" value="' + n + '" ' + (n === 0 ? 'checked' : '') + ' class="accent-[#9C7424] w-5 h-5"><span><span class="font-medium block">' + s.name + '</span><span class="text-xs text-mute">' + s.note + '</span></span></span><span class="font-head font-semibold text-xl text-coral">' + money(s.price) + '</span></label>'; }).join('') + '</div></div>' +
          '<div class="' + (it.addons.length ? '' : 'hidden') + '"><h2 class="font-head uppercase font-semibold text-xl tracking-wide mb-3">2. Add extras <span class="text-sm text-mute normal-case tracking-normal font-sans">(optional)</span></h2><div class="space-y-2" id="addons">' +
            it.addons.map(function (a) { var ad = CATALOG.addons[a]; return '<label class="opt"><span class="flex items-center gap-3"><input type="checkbox" value="' + a + '" class="accent-[#9C7424] w-5 h-5"><span class="font-medium">' + ad.name + '</span></span><span class="font-head font-semibold text-xl text-coral">+ ' + money(ad.price) + '</span></label>'; }).join('') + '</div></div>' +
          '<div><h2 class="font-head uppercase font-semibold text-xl tracking-wide mb-3">' + (it.addons.length ? '3' : '2') + '. Special requests</h2><textarea id="note" rows="3" class="field" placeholder="Dietary needs, labels with names, or anything we should know."></textarea></div>' +
          '<div class="flex flex-wrap items-center gap-4 border-t-2 border-line pt-6"><div class="flex items-center border-2 border-line rounded-full bg-white"><button type="button" id="minus" class="w-11 h-11 text-2xl font-bold" aria-label="Fewer">&minus;</button><input id="qty" type="number" min="1" value="1" class="w-14 text-center font-semibold outline-none bg-transparent" aria-label="Quantity"><button type="button" id="plus" class="w-11 h-11 text-2xl font-bold" aria-label="More">+</button></div>' +
            '<button class="btn btn-coral flex-1 min-w-[220px]" type="submit">Add to cart &nbsp;·&nbsp; <span id="lineTotal">$</span></button></div>' +
          '<p class="text-xs text-mute">Prices, taxes and delivery are confirmed on your order.</p>' + NYC.help() + '</form></section>' +
      '<section class="bg-white border-t border-line"><div class="max-w-7xl mx-auto px-6 py-12"><h2 class="font-head uppercase font-semibold text-3xl tracking-wide mb-6">Pairs beautifully with</h2><div id="related" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"></div></div></section>';
    var rel = itemsFor(mode).filter(function (i) { return i.cat === it.cat && i.id !== it.id && i.group === it.group; });
    rel = rel.concat(itemsFor(mode).filter(function (i) { return i.cat === it.cat && i.id !== it.id && i.group !== it.group; }));
    if (rel.length < 4) rel = rel.concat(itemsFor(mode).filter(function (i) { return i.cat !== it.cat && i.popular; }));
    $('#related').innerHTML = rel.slice(0, 4).map(function (i) { return NYC.card(i, mode); }).join('');

    function calc() {
      var s = sizes[+($('input[name=size]:checked').value)];
      var adds = Array.prototype.map.call(document.querySelectorAll('#addons input:checked'), function (x) { var a = CATALOG.addons[x.value]; return { id: x.value, name: a.name, price: a.price }; });
      var q = Math.max(s.min, parseInt($('#qty').value, 10) || s.min);
      var unit = (s.price || 0) + adds.reduce(function (n, a) { return n + (a.price || 0); }, 0);
      $('#lineTotal').textContent = unit > 0 ? money(unit * q) : '$';
      return { s: s, adds: adds, q: q };
    }
    function minimum() { var s = sizes[+($('input[name=size]:checked').value)]; $('#qty').min = s.min; if ((parseInt($('#qty').value, 10) || 0) < s.min) $('#qty').value = s.min; }
    $('#pf').addEventListener('change', function () { minimum(); calc(); }); $('#qty').addEventListener('input', calc);
    $('#minus').addEventListener('click', function () { $('#qty').value = Math.max(+$('#qty').min, (parseInt($('#qty').value, 10) || 1) - 1); calc(); });
    $('#plus').addEventListener('click', function () { $('#qty').value = (parseInt($('#qty').value, 10) || 1) + 1; calc(); });
    minimum(); calc();
    $('#pf').addEventListener('submit', function (e) {
      e.preventDefault(); var c = calc();
      NYC.cart.add({ id: it.id, name: it.name, image: it.image, mode: mode, size: c.s.name, sizePrice: c.s.price, addons: c.adds, qty: c.q, min: c.s.min, note: $('#note').value.trim() });
      NYC.toast('<span>Added <b>' + it.name + '</b> to your cart.</span><a href="cart.html" class="btn btn-sun !py-2 !px-4 !text-xs">View cart</a>');
    });
  }

  // =================== CART ===================
  function cart() {
    function draw() {
      var lines = NYC.cart.get(), t = NYC.cart.totals();
      if (!lines.length) {
        app.innerHTML = banner('bg-brand', 'Your cart', 'Nothing here yet.') +
          '<section class="max-w-3xl mx-auto px-6 py-16 text-center"><p class="text-mute mb-6">Your cart is empty. Add a salad, a platter or something for breakfast to begin.</p><a href="catering.html" class="btn btn-coral">Shop Catering</a> <a href="takeout.html" class="btn btn-line">Shop Signature Lunch</a></section>';
        return;
      }
      app.innerHTML = banner('bg-brand', 'Your cart', NYC.cart.count() + ' item' + (NYC.cart.count() === 1 ? '' : 's') + ' ready to order.') +
        '<section class="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-8">' +
          '<div class="space-y-4">' + lines.map(function (l) {
            var u = NYC.cart.unit(l);
            return '<div class="bg-white rounded-2xl shadow-sm p-4 flex gap-4"><img src="' + l.image + '" alt="" class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover" onerror="this.onerror=null;this.src=\'images/placeholder.svg\'">' +
              '<div class="flex-1 min-w-0"><div class="flex justify-between gap-3"><div><a href="product.html?id=' + l.id + '&mode=' + l.mode + '" class="font-head uppercase font-semibold text-lg tracking-wide hover:text-coral">' + l.name + '</a><p class="text-xs text-mute">' + (l.mode === 'lunch' ? 'Signature Lunch' : 'Catering') + ' &nbsp;·&nbsp; ' + l.size + '</p></div><p class="font-head text-xl text-coral">' + (u > 0 ? money(u * l.qty) : '$') + '</p></div>' +
              (l.addons.length ? '<p class="text-sm text-mute mt-1">+ ' + l.addons.map(function (a) { return a.name; }).join(', ') + '</p>' : '') +
              (l.note ? '<p class="text-sm text-mute mt-1 italic">&ldquo;' + l.note.replace(/</g, '') + '&rdquo;</p>' : '') +
              '<div class="mt-3 flex items-center gap-4"><div class="flex items-center border-2 border-line rounded-full"><button data-dec="' + l.key + '" class="w-9 h-9 text-xl font-bold" aria-label="Fewer">&minus;</button><span class="w-8 text-center font-semibold">' + l.qty + '</span><button data-inc="' + l.key + '" class="w-9 h-9 text-xl font-bold" aria-label="More">+</button></div><button data-rm="' + l.key + '" class="text-sm text-coral underline">Remove</button></div></div></div>';
          }).join('') + '<a href="catering.html" class="inline-block text-coral underline mt-2">&larr; Keep shopping</a></div>' +
          '<aside class="bg-white rounded-3xl shadow-md p-6 h-fit lg:sticky lg:top-32"><h2 class="font-head uppercase text-2xl tracking-wide mb-4">Order summary</h2>' +
            '<dl class="space-y-2 text-sm"><div class="flex justify-between"><dt>Subtotal</dt><dd class="font-semibold">' + (t.priced ? money(t.sub) : '$') + '</dd></div><div class="flex justify-between"><dt>Delivery</dt><dd class="text-mute">Confirmed on order</dd></div><div class="flex justify-between"><dt>HST (13%)</dt><dd class="font-semibold">' + (t.priced ? money(t.tax) : '$') + '</dd></div></dl>' +
            '<div class="border-t-2 border-line mt-4 pt-4 flex justify-between font-head text-2xl"><span>Total</span><span class="text-coral">' + (t.priced ? money(t.total) : '$') + '</span></div>' +
            '<a href="checkout.html" class="btn btn-coral w-full mt-6">Checkout</a><p class="text-xs text-mute mt-3 text-center">Checkout here is a demonstration. No payment is taken.</p><div class="mt-5">' + NYC.help() + '</div></aside></section>';
    }
    draw();
    app.addEventListener('click', function (e) {
      var inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]'), rm = e.target.closest('[data-rm]');
      var cur = function (k) { return NYC.cart.get().filter(function (x) { return x.key === k; })[0]; };
      if (inc) { NYC.cart.setQty(inc.dataset.inc, cur(inc.dataset.inc).qty + 1); draw(); }
      if (dec) { NYC.cart.setQty(dec.dataset.dec, cur(dec.dataset.dec).qty - 1); draw(); }
      if (rm) { NYC.cart.remove(rm.dataset.rm); draw(); }
    });
  }

  // =================== CHECKOUT (demonstration) ===================
  function checkout() {
    var lines = NYC.cart.get(), t = NYC.cart.totals(), u = NYC.user.get() || {};
    if (!lines.length) {
      app.innerHTML = banner('bg-brand', 'Checkout', 'Your cart is empty.') + '<section class="max-w-3xl mx-auto px-6 py-16 text-center"><a href="catering.html" class="btn btn-coral">Shop Catering</a></section>'; return;
    }
    var tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    app.innerHTML = banner('bg-brand', 'Checkout', 'Just a few details and your order is on its way.') +
      '<section class="max-w-6xl mx-auto px-6 pt-8"><div class="bg-sun/30 border-2 border-sun rounded-2xl px-5 py-4 text-sm"><b>Demonstration only.</b> This checkout is a practice run. No payment is taken and nothing is sent to a bank. Please do not type real card numbers.</div></section>' +
      '<section class="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_360px] gap-8">' +
      '<form id="cf" class="space-y-6">' +
        '<div class="bg-white rounded-3xl shadow-sm p-6"><h2 class="font-head uppercase text-2xl tracking-wide mb-4"><span class="text-coral">1.</span> Your details</h2><div class="grid sm:grid-cols-2 gap-4">' +
          '<label><span class="label block mb-1">Full name</span><input required name="name" class="field" value="' + (u.name || '') + '" autocomplete="name"></label>' +
          '<label><span class="label block mb-1">Company</span><input name="company" class="field" autocomplete="organization"></label>' +
          '<label><span class="label block mb-1">Email</span><input required type="email" name="email" class="field" value="' + (u.email || '') + '" autocomplete="email"></label>' +
          '<label><span class="label block mb-1">Phone</span><input required type="tel" name="phone" class="field" autocomplete="tel"></label></div></div>' +
        '<div class="bg-white rounded-3xl shadow-sm p-6"><h2 class="font-head uppercase text-2xl tracking-wide mb-4"><span class="text-coral">2.</span> Delivery</h2><div class="grid sm:grid-cols-2 gap-4">' +
          '<label class="sm:col-span-2"><span class="label block mb-1">Delivery address</span><input required name="address" class="field" placeholder="Street, suite or floor, city" autocomplete="street-address"></label>' +
          '<label><span class="label block mb-1">Postal code</span><input required name="postal" class="field" autocomplete="postal-code"></label>' +
          '<label><span class="label block mb-1">Number of guests</span><input type="number" min="1" name="guests" class="field"></label>' +
          '<label><span class="label block mb-1">Date</span><input required type="date" name="date" min="' + tomorrow + '" class="field"></label>' +
          '<label><span class="label block mb-1">Delivery window</span><select name="window" class="field"><option>7:30 am to 9:00 am</option><option>9:00 am to 11:00 am</option><option selected>11:00 am to 12:30 pm</option><option>12:30 pm to 2:00 pm</option><option>2:00 pm to 4:00 pm</option></select></label>' +
          '<label class="sm:col-span-2"><span class="label block mb-1">Delivery notes</span><textarea name="notes" rows="2" class="field" placeholder="Front desk, buzzer code, who to ask for"></textarea></label></div></div>' +
        '<div class="bg-white rounded-3xl shadow-sm p-6"><h2 class="font-head uppercase text-2xl tracking-wide mb-4"><span class="text-coral">3.</span> Payment <span class="text-xs font-sans normal-case tracking-normal bg-sun rounded-full px-2 py-1 ml-2">Demo</span></h2>' +
          '<div class="space-y-2 mb-4"><label class="opt"><span class="flex items-center gap-3"><input type="radio" name="pay" value="Card (demo)" checked class="accent-[#0E9F6E] w-5 h-5"> Pay by card</span><span class="text-xs text-mute">Practice only</span></label>' +
          '<label class="opt"><span class="flex items-center gap-3"><input type="radio" name="pay" value="Company invoice (demo)" class="accent-[#0E9F6E] w-5 h-5"> Invoice my company</span><span class="text-xs text-mute">Practice only</span></label></div>' +
          '<div id="cardbox" class="grid sm:grid-cols-2 gap-4"><label class="sm:col-span-2"><span class="label block mb-1">Card number</span><input id="cn" class="field" placeholder="Practice only: leave blank or use 4242 4242 4242 4242" inputmode="numeric" autocomplete="off"></label>' +
            '<label><span class="label block mb-1">Expiry</span><input class="field" placeholder="MM / YY" autocomplete="off"></label><label><span class="label block mb-1">Security code</span><input class="field" placeholder="CVC" autocomplete="off"></label></div></div>' +
        '<button class="btn btn-coral w-full text-lg" type="submit">Place order (demo)</button></form>' +
      '<aside class="bg-white rounded-3xl shadow-md p-6 h-fit lg:sticky lg:top-32"><h2 class="font-head uppercase text-2xl tracking-wide mb-4">Your order</h2><ul class="divide-y divide-line text-sm">' +
        lines.map(function (l) { var un = NYC.cart.unit(l); return '<li class="py-3 flex justify-between gap-3"><span><b>' + l.qty + ' &times; ' + l.name + '</b><br><span class="text-mute">' + l.size + (l.addons.length ? ' + ' + l.addons.length + ' extra' + (l.addons.length > 1 ? 's' : '') : '') + '</span></span><span class="font-semibold">' + (un > 0 ? money(un * l.qty) : '$') + '</span></li>'; }).join('') +
        '</ul><div class="border-t-2 border-line mt-3 pt-3 space-y-1 text-sm"><div class="flex justify-between"><span>Subtotal</span><span>' + (t.priced ? money(t.sub) : '$') + '</span></div><div class="flex justify-between"><span>HST (13%)</span><span>' + (t.priced ? money(t.tax) : '$') + '</span></div><div class="flex justify-between font-head text-2xl pt-2"><span>Total</span><span class="text-coral">' + (t.priced ? money(t.total) : '$') + '</span></div></div><a href="cart.html" class="block text-center text-sm text-coral underline mt-4">Edit cart</a><div class="mt-5">' + NYC.help() + '</div></aside></section>';

    try { var meta = JSON.parse(localStorage.getItem('nyc_meta') || 'null'); var cf0 = $('#cf');
      if (meta && cf0) { if (meta.guests) cf0.elements.guests.value = meta.guests; if (meta.date && meta.date >= tomorrow) cf0.elements.date.value = meta.date; } } catch (e) {}
    document.querySelectorAll('input[name=pay]').forEach(function (r) { r.addEventListener('change', function () { $('#cardbox').classList.toggle('hidden', r.value.indexOf('invoice') !== -1 && r.checked); }); });
    $('#cf').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(e.target), btn = e.target.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Processing (demo)…';
      setTimeout(function () {
        // Card details are deliberately NOT saved anywhere.
        var order = { id: 'NYC-' + Math.floor(100000 + Math.random() * 900000), placed: new Date().toLocaleString(), lines: lines, totals: t,
          contact: { name: f.get('name'), company: f.get('company'), email: f.get('email'), phone: f.get('phone') },
          delivery: { address: f.get('address'), postal: f.get('postal'), date: f.get('date'), window: f.get('window'), guests: f.get('guests'), notes: f.get('notes') },
          payment: f.get('pay') };
        NYC.orders.add(order); NYC.cart.clear();
        app.innerHTML = banner('bg-brand', 'Thank you!', 'Your demo order has been placed.') +
          '<section class="max-w-3xl mx-auto px-6 py-12"><div class="bg-white rounded-3xl shadow-md p-8 text-center"><p class="label mb-1">Order number</p><p class="font-head text-4xl tracking-wide">' + order.id + '</p>' +
            '<p class="text-mute mt-4">A confirmation would be emailed to <b>' + order.contact.email + '</b>. Delivery to <b>' + order.delivery.address + '</b> on <b>' + order.delivery.date + '</b>, ' + order.delivery.window + '.</p>' +
            '<p class="mt-4 text-sm bg-sun/30 border border-sun rounded-xl px-4 py-3">This was a demonstration. No payment was taken and no food has been ordered.</p>' +
            '<div class="mt-6 flex flex-wrap gap-3 justify-center"><a href="login.html" class="btn btn-line">See my orders</a><a href="catering.html" class="btn btn-coral">Keep shopping</a></div><div class="mt-6 text-left max-w-md mx-auto">' + NYC.help() + '</div></div></section>';
        window.scrollTo(0, 0);
      }, 1100);
    });
  }

  // =================== LOGIN (demonstration) ===================
  function login() {
    function draw(tab) {
      var u = NYC.user.get();
      if (u) {
        var orders = NYC.orders.get();
        app.innerHTML = banner('bg-brand', 'Hello, ' + (u.name || 'friend'), u.email) +
          '<section class="max-w-4xl mx-auto px-6 py-10"><div class="flex items-center justify-between mb-6"><h2 class="font-head uppercase text-3xl tracking-wide">Your orders</h2><button id="out" class="btn btn-line !py-2 !px-5">Log out</button></div>' +
          (orders.length ? orders.map(function (o) { return '<div class="bg-white rounded-2xl shadow-sm p-5 mb-4"><div class="flex flex-wrap justify-between gap-2"><b class="font-head text-xl tracking-wide">' + o.id + '</b><span class="text-sm text-mute">' + o.placed + '</span></div><p class="text-sm text-mute mt-1">' + o.lines.length + ' item' + (o.lines.length === 1 ? '' : 's') + ' &nbsp;·&nbsp; Delivery ' + o.delivery.date + ' &nbsp;·&nbsp; ' + o.payment + '</p></div>'; }).join('') : '<p class="text-mute">No orders yet. <a class="text-coral underline" href="catering.html">Start shopping</a>.</p>') +
          '<p class="text-xs text-mute mt-6">This account is a demonstration and is saved only in this browser.</p></section>';
        $('#out').addEventListener('click', function () { NYC.user.clear(); location.href = 'index.html'; });
        return;
      }
      var signup = tab === 'signup';
      app.innerHTML = banner('bg-brand', signup ? 'Create account' : 'Login', 'Keep your details and past orders in one place.') +
        '<section class="max-w-md mx-auto px-6 py-12"><div class="flex mb-6 bg-white rounded-full p-1 shadow-sm"><button data-t="login" class="flex-1 py-2 rounded-full font-head uppercase tracking-wide ' + (!signup ? 'bg-coral text-white' : '') + '">Login</button><button data-t="signup" class="flex-1 py-2 rounded-full font-head uppercase tracking-wide ' + (signup ? 'bg-coral text-white' : '') + '">Create account</button></div>' +
        '<form id="lf" class="bg-white rounded-3xl shadow-md p-6 space-y-4">' + (signup ? '<label class="block"><span class="label block mb-1">Full name</span><input required name="name" class="field" autocomplete="name"></label>' : '') +
          '<label class="block"><span class="label block mb-1">Email</span><input required type="email" name="email" class="field" autocomplete="email"></label>' +
          '<label class="block"><span class="label block mb-1">Password</span><input required type="password" name="pw" class="field" autocomplete="' + (signup ? 'new-password' : 'current-password') + '"></label>' +
          '<button class="btn btn-coral w-full" type="submit">' + (signup ? 'Create account' : 'Log in') + '</button>' +
          '<p class="text-xs text-mute text-center">Demonstration only. Passwords are not saved or checked.</p></form><div class="mt-6">' + NYC.help() + '</div></section>';
      document.querySelectorAll('[data-t]').forEach(function (b) { b.addEventListener('click', function () { draw(b.dataset.t); }); });
      $('#lf').addEventListener('submit', function (e) {
        e.preventDefault(); var f = new FormData(e.target), email = f.get('email');
        NYC.user.set({ name: f.get('name') || String(email).split('@')[0], email: email });
        location.href = params.get('next') || 'login.html';
      });
    }
    draw(params.get('tab'));
  }

  var routes = { shop: shop, category: category, product: product, cart: cart, checkout: checkout, login: login };
  if (routes[page]) routes[page]();
})();
