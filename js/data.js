// ============================================================
// THE MENU: edit this file to change items, photos, prices and details.
//
//  * prices: each item says how it is sold (see "Sizes" below).
//    A price of null shows just "$" (price not set yet).
//  * image: a file inside the "images" folder. Replace the file with
//    your own photo (same name) or change the name here.
//  * note: the short line under a size, e.g. "Serves 10 people".
//  * diet: which dietary labels the item can carry. Please check each
//    one carefully before the site goes live.
//  * includes: the "What's included" list on the item page.
// ============================================================

// Sizes. "group" sizes show in Catering; "single" sizes show in Signature Lunch.
function size(name, note, price, kind, min) {
  return { name: name, note: note, price: price, kind: kind || 'group', min: min || 1 };
}
// Sold one at a time, in both Catering and Signature Lunch.
function each(price) { return [size('Each', 'Price for one', price), size('Each', 'Price for one', price, 'single')]; }
function bottle(price) { return [size('Bottle', 'Price per bottle', price), size('Bottle', 'Price per bottle', price, 'single')]; }
function perPerson(price) { return [size('Per person', 'Price per person', price)]; }
function one(name, note, price, min) { return [size(name, note, price, 'group', min)]; }
const SALAD = [
  size('Individual container', 'Serves 1 person', 5.99),
  size('Salad bowl for 10', 'Serves 10 people', 59.99),
  size('Salad bowl for 15', 'Serves 15 people', 89.99),
  size('Salad bowl for 20', 'Serves 20 people', 115.99),
  size('Individual container', 'Serves 1 person', 5.99, 'single')
];
const PASTA = one('Tray', 'Serves 10 people', null); // tray price still to be confirmed

// Dietary labels (used for the filters and the little badges).
const DIETS = {
  'vegan': 'Vegan',
  'vegetarian': 'Vegetarian',
  'gluten-free': 'Gluten-free',
  'dairy-free': 'Dairy-free',
  'nut-free': 'Nut-free'
};
const ALLERGEN_NOTE = 'Our food is prepared in a kitchen that also handles common allergens such as gluten, dairy, eggs, nuts, sesame, fish and shellfish. Please tell us about any allergy when you order and we will take extra care. We cannot guarantee that any item is completely free of an allergen.';

// Extras guests can add to an order.
const ADDONS = {
  chicken:   { name: 'Add grilled chicken',         price: null },
  salmonadd: { name: 'Add grilled salmon',          price: null },
  dressing:  { name: 'Extra dressing on the side',  price: null },
  cutlery:   { name: 'Plates, cutlery and napkins', price: null }
};

// Main sections of the shop.
const CATEGORIES = [
  { id: 'breakfast',  name: 'Breakfast',          image: 'brunch.jpg',      blurb: 'Omelette croissants, wraps, bagels and fresh-baked pastries, for mornings begun beautifully.',
    groups: [['sandwiches', 'Breakfast Sandwiches and Wraps'], ['bakery', 'Bagels and Pastries']] },
  { id: 'salads',     name: 'Salads',             image: 'sal-rainbow.jpg', blurb: 'Fresh salads in individual containers, or in bowls for 10, 15 or 20 people.',
    groups: [['classic', 'Classic Salads'], ['signature', 'Signature Salads']] },
  { id: 'sandwiches', name: 'Sandwiches & Wraps', image: 'sandwiches.jpg',  blurb: 'Generously filled sandwiches and wraps for graceful desk-side dining.',
    groups: [['sand', 'Sandwiches'], ['wraps', 'Wraps']] },
  { id: 'platters',   name: 'Platters',           image: 'platters.jpg',    blurb: 'Cheese, charcuterie and fruit, arranged with care for meetings and celebrations.',
    groups: [['cheese', 'Cheese, Charcuterie and Fruit']] },
  { id: 'hot',        name: 'Hot Food',           image: 'salmon.jpg',      blurb: 'Grilled salmon, pasta trays, party-size pizza and wings, delivered hot.',
    groups: [['mains', 'Salmon'], ['pasta', 'Pasta Trays'], ['party', 'Pizza and Wings']] },
  { id: 'drinks',     name: 'Drinks',             image: 'colddrinks.jpg',  blurb: 'Coffee, tea, juice, water, pop and basil lemonade.',
    groups: [['hotd', 'Hot Drinks'], ['cold', 'Cold Drinks']] }
];

// Every item. An item with a "single" size is also in the Signature Lunch shop.
function item(id, name, cat, group, image, desc, opts) {
  var diet = opts.diet || [];
  return {
    id: id, name: name, cat: cat, group: group, image: 'images/' + image, desc: desc,
    lunch: opts.sizes.some(function (s) { return s.kind === 'single'; }),
    sizes: opts.sizes,
    addons: opts.addons || [],
    diet: diet, tags: diet.map(function (d) { return DIETS[d]; }),
    includes: opts.includes || [], popular: !!opts.popular
  };
}

const ITEMS = [
  // ---- Breakfast ----
  item('egg-salad-wrap', 'Egg Salad Wrap', 'breakfast', 'sandwiches', 'wraps.jpg', 'Creamy egg salad rolled in a soft wrap.', { sizes: each(9.99), diet: ['vegetarian'], addons: ['cutlery'] }),
  item('ham-muffin', 'Ham English Muffin', 'breakfast', 'sandwiches', 'breakfast.jpg', 'Ham on a toasted English muffin.', { sizes: each(7.99), addons: ['cutlery'] }),
  item('ham-cheese-croissant', 'Ham & Cheese Omelette Croissant', 'breakfast', 'sandwiches', 'croissant.jpg', 'Ham and cheese omelette on a butter croissant.', { sizes: each(9.99), popular: true, addons: ['cutlery'] }),
  item('bacon-cheese-croissant', 'Bacon & Cheese Omelette Croissant', 'breakfast', 'sandwiches', 'croissant.jpg', 'Bacon and cheese omelette on a butter croissant.', { sizes: each(9.99), addons: ['cutlery'] }),
  item('spinach-croissant', 'Spinach Omelette Croissant', 'breakfast', 'sandwiches', 'croissant.jpg', 'Spinach omelette on a butter croissant.', { sizes: each(9.99), diet: ['vegetarian'], addons: ['cutlery'] }),
  item('cheese-croissant', 'Cheese Omelette Croissant', 'breakfast', 'sandwiches', 'croissant.jpg', 'Cheese omelette on a butter croissant.', { sizes: each(9.99), diet: ['vegetarian'], addons: ['cutlery'] }),
  item('salmon-danish', 'Smoked Salmon Multigrain Danish', 'breakfast', 'sandwiches', 'bagels.jpg', 'Smoked salmon on a multigrain danish.', { sizes: each(11.99), addons: ['cutlery'] }),
  item('bagel-box', 'Assorted Bagels', 'breakfast', 'bakery', 'bagels.jpg', 'Assorted bagels with butter, cream cheese and jam on the side.', { sizes: each(4.99), diet: ['vegetarian'], popular: true, addons: ['cutlery'], includes: ['Assorted bagels', 'Butter, cream cheese and jam on the side'] }),
  item('pastry-box', 'Assorted Fresh-Baked Pastries', 'breakfast', 'bakery', 'slide-coffee.jpg', 'Croissants, raisin and cinnamon roll danishes, and savoury bistro muffins.', { sizes: each(4.99), popular: true, addons: ['cutlery'], includes: ['Croissants', 'Raisin and cinnamon roll danishes', 'Savoury bistro muffins'] }),

  // ---- Salads (individual container, or a bowl for 10, 15 or 20) ----
  item('caesar', 'Classic Caesar Salad', 'salads', 'classic', 'sal-caesar.jpg', 'Crisp romaine, crunchy croutons, parmesan and creamy dressing.', { sizes: SALAD, popular: true, addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('greek', 'Mediterranean Greek Salad', 'salads', 'classic', 'sal-greek.jpg', 'Feta, olives, cucumber, tomato and red onion with oregano dressing.', { sizes: SALAD, diet: ['vegetarian', 'gluten-free'], popular: true, addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('garden', 'Garden Harvest Salad', 'salads', 'classic', 'sal-garden.jpg', 'Mixed greens with colourful vegetables and a light vinaigrette.', { sizes: SALAD, diet: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('kale-beet', 'Kale, Beet & Roasted Walnut Salad', 'salads', 'signature', 'sal-berry.jpg', 'Kale with beets and roasted walnuts.', { sizes: SALAD, popular: true, addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('pasta-pesto-salad', 'Pasta, Kale & Pesto Salad', 'salads', 'signature', 'sal-grain.jpg', 'Pasta tossed with kale and pesto.', { sizes: SALAD, addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('pizza-salad', 'Pizza Salad', 'salads', 'signature', 'sal-caprese.jpg', 'Our pizza salad.', { sizes: SALAD, addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('thai-salad', 'Thai Salad', 'salads', 'signature', 'sal-rainbow.jpg', 'Our Thai salad.', { sizes: SALAD, addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('coleslaw', 'Coleslaw Salad', 'salads', 'signature', 'sal-garden.jpg', 'Crisp, creamy coleslaw.', { sizes: SALAD, addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('potato-egg', 'Potato & Egg Salad', 'salads', 'signature', 'sal-cobb.jpg', 'A hearty potato and egg salad.', { sizes: SALAD, addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),

  // ---- Sandwiches and wraps ----
  item('chicken-pesto', 'Chicken Pesto Sandwich', 'sandwiches', 'sand', 'sandwiches.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), popular: true, addons: ['cutlery'] }),
  item('spicy-chicken', 'Spicy Chicken Sandwich', 'sandwiches', 'sand', 'sandwiches.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), addons: ['cutlery'] }),
  item('ham-brie', 'Ham & Brie Sandwich', 'sandwiches', 'sand', 'sandwiches.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), addons: ['cutlery'] }),
  item('turkey-swiss', 'Turkey & Swiss Sandwich', 'sandwiches', 'sand', 'sandwiches.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), addons: ['cutlery'] }),
  item('chicken-avocado', 'Chicken & Avocado Sandwich', 'sandwiches', 'sand', 'sandwiches.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), popular: true, addons: ['cutlery'] }),
  item('chicken-bacon', 'Chicken & Bacon Sandwich', 'sandwiches', 'sand', 'sandwiches.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), addons: ['cutlery'] }),
  item('tuna-salad-sandwich', 'Tuna Salad Sandwich', 'sandwiches', 'sand', 'sandwiches.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), addons: ['cutlery'] }),
  item('beef-pepper', 'Roast Beef & Grilled Pepper Sandwich', 'sandwiches', 'sand', 'sandwiches.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), addons: ['cutlery'] }),
  item('tomato-bocconcini', 'Tomato Bocconcini Sandwich', 'sandwiches', 'sand', 'sandwiches.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), diet: ['vegetarian'], addons: ['cutlery'] }),
  item('asian-chicken', 'Asian Chicken Sandwich', 'sandwiches', 'sand', 'sandwiches.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), addons: ['cutlery'] }),
  item('chicken-salad-wrap', 'Chicken Salad Wrap', 'sandwiches', 'wraps', 'wraps.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), addons: ['cutlery'] }),
  item('chicken-caesar-wrap', 'Chicken Caesar Wrap', 'sandwiches', 'wraps', 'wraps.jpg', 'Freshly prepared and ready to enjoy.', { sizes: each(13.99), popular: true, addons: ['cutlery'] }),

  // ---- Hot food ----
  item('salmon', 'Grilled Salmon & Vegetables', 'hot', 'mains', 'salmon.jpg', 'Grilled salmon served with vegetables.', { sizes: perPerson(15.99), popular: true, addons: ['cutlery'], includes: ['Grilled salmon', 'Vegetables'] }),
  item('pasta-meatball', 'Spaghetti & Meatballs', 'hot', 'pasta', 'italian.jpg', 'A tray of spaghetti and meatballs that serves 10 people.', { sizes: PASTA, addons: ['cutlery'] }),
  item('pasta-ravioli', 'Ravioli', 'hot', 'pasta', 'slide-pasta.jpg', 'A tray of ravioli that serves 10 people.', { sizes: PASTA, addons: ['cutlery'] }),
  item('pasta-tortellini', 'Tortellini', 'hot', 'pasta', 'italian.jpg', 'A tray of tortellini that serves 10 people.', { sizes: PASTA, addons: ['cutlery'] }),
  item('lasagna', 'Lasagna', 'hot', 'pasta', 'lasagna.jpg', 'A tray of lasagna that serves 10 people.', { sizes: PASTA, popular: true, addons: ['cutlery'] }),
  item('mac-cheese', 'Mac & Cheese', 'hot', 'pasta', 'slide-lasagna.jpg', 'A tray of mac and cheese that serves 10 people.', { sizes: PASTA, diet: ['vegetarian'], addons: ['cutlery'] }),
  item('pizza', 'Party-Size Pizza', 'hot', 'party', 'pizza.jpg', 'A party-size pizza, made for sharing.', { sizes: one('Party size', '', 40), popular: true, addons: ['cutlery'] }),
  item('wings', 'Tray of Wings', 'hot', 'party', 'wings.jpg', 'A tray of wings that serves 10 people.', { sizes: one('Tray', 'Serves 10 people', 49.99), popular: true, addons: ['cutlery'] }),

  // ---- Platters ----
  item('cheese', 'Fine Cheese Platter', 'platters', 'cheese', 'cheese.jpg', 'A selection of fine cheeses, beautifully arranged.', { sizes: perPerson(6.99), popular: true, addons: ['cutlery'] }),
  item('charcuterie', 'Cheese & Charcuterie Board', 'platters', 'cheese', 'charcuterie.jpg', 'Cheeses and cured meats on a board.', { sizes: perPerson(7.99), popular: true, addons: ['cutlery'] }),
  item('cheese-fruit', 'Cheese & Fruit Platter', 'platters', 'cheese', 'cheese-fruit.jpg', 'Cheeses with fresh fruit.', { sizes: perPerson(7.99), diet: ['vegetarian'], addons: ['cutlery'] }),
  item('fruit-p', 'Fruit Platter', 'platters', 'cheese', 'fruit.jpg', 'Fresh fruit, cut and arranged.', { sizes: perPerson(6.49), diet: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], popular: true, addons: ['cutlery'] }),

  // ---- Drinks ----
  item('coffee-carafe', 'Carafe of Coffee', 'drinks', 'hotd', 'hotdrinks.jpg', 'A carafe of fresh coffee.', { sizes: one('Carafe', '', 25.99), addons: [] }),
  item('tea-carafe', 'Carafe of Tea', 'drinks', 'hotd', 'hotdrinks.jpg', 'A carafe of tea.', { sizes: one('Carafe', '', 27.99), addons: [] }),
  item('coffee-thermos', 'Catering Coffee Thermos', 'drinks', 'hotd', 'slide-coffee.jpg', 'Coffee in a catering thermos for groups of 20 or more.', { sizes: one('Per person', 'Minimum 20 people', 3.50, 20), addons: [] }),
  item('juice', 'Bottled Juice', 'drinks', 'cold', 'colddrinks.jpg', 'Juice by the bottle.', { sizes: bottle(3.50), addons: [] }),
  item('water', 'Bottled Water', 'drinks', 'cold', 'colddrinks.jpg', 'Water by the bottle.', { sizes: bottle(2.49), addons: [] }),
  item('pop', 'Bottled Pop', 'drinks', 'cold', 'colddrinks.jpg', 'Pop by the bottle.', { sizes: bottle(2.49), addons: [] }),
  item('lemonade', 'Basil Lemonade', 'drinks', 'cold', 'colddrinks.jpg', 'Fresh basil lemonade, priced per person.', { sizes: perPerson(3.99), addons: [] })
];

const CATALOG = { categories: CATEGORIES, items: ITEMS, addons: ADDONS, diets: DIETS, allergenNote: ALLERGEN_NOTE };
