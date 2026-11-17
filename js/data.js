// ============================================================
// THE MENU: edit this file to change items, photos, prices and details.
//
//  * price: null  shows just "$" (price not set yet).
//    Replace null with a number, e.g. price: 48.50, and every page,
//    the cart and the checkout will use it automatically.
//  * image: a file inside the "images" folder. Replace the file with
//    your own photo (same name) or change the name here.
//  * serves: how many guests a tray feeds. These are our best guesses:
//    please change them to match your real trays.
//  * diet: which dietary labels the item can carry. Please check each
//    one carefully before the site goes live.
//  * includes: the "What's included" list on the item page.
// ============================================================

// Sizes. "group" sizes are for catering; "single" is for Signature Lunch.
const TRAYS = [
  { name: 'Small tray',  kind: 'group', serves: '8 to 10 guests',  price: null },
  { name: 'Medium tray', kind: 'group', serves: '12 to 15 guests', price: null },
  { name: 'Large tray',  kind: 'group', serves: '18 to 25 guests', price: null }
];
const SINGLE = [{ name: 'Individual', kind: 'single', serves: '1 guest', price: null }];

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
  fruitcup:   { name: 'Fresh fruit cups',            price: null },
  cookie:     { name: 'Cookies',                     price: null },
  juice:      { name: 'Orange juice',                price: null },
  water:      { name: 'Bottled water',               price: null },
  coffeebox:  { name: 'Coffee and tea box',          price: null },
  dressing:   { name: 'Extra dressing on the side',  price: null },
  chicken:    { name: 'Add grilled chicken',         price: null },
  salmonadd:  { name: 'Add grilled salmon',          price: null },
  cutlery:    { name: 'Plates, cutlery and napkins', price: null },
  dips:       { name: 'Dips and pita',               price: null },
  lemonade:   { name: 'Fresh lemonade',              price: null },
  pastry:     { name: 'Mini pastries',               price: null },
  crackers:   { name: 'Extra crackers and bread',    price: null },
  honey:      { name: 'Honey and preserves',         price: null },
  olives:     { name: 'Marinated olives',            price: null },
  skewers:    { name: 'Serving boards and utensils', price: null }
};

// Main sections of the shop.
const CATEGORIES = [
  { id: 'breakfast',  name: 'Breakfast',          image: 'brunch.jpg',      blurb: 'Pastries, bagels, sandwiches, seasonal fruit and cooked breakfasts, for mornings begun beautifully.',
    groups: [['sandwiches', 'Breakfast Sandwiches'], ['bagels', 'Bagels'], ['pastries', 'Breads and Pastries'], ['hot', 'Cooked Breakfasts'], ['fruit', 'Fruit Cups and Platters']] },
  { id: 'salads',     name: 'Salads',             image: 'sal-rainbow.jpg', blurb: 'Generous, artfully composed salads. Finish with grilled salmon or chicken for a complete luncheon.',
    groups: [['classic', 'Classic Salads'], ['hearty', 'Hearty Salads and Bowls']] },
  { id: 'sandwiches', name: 'Sandwiches & Wraps', image: 'sandwiches.jpg',  blurb: 'Generously filled, pressed warm and wrapped for graceful desk-side dining.',
    groups: [['sand', 'Sandwiches and Paninis'], ['wraps', 'Wraps'], ['burgers', 'Burgers']] },
  { id: 'hot',        name: 'Hot Entrées',        image: 'salmon.jpg',      blurb: 'Salmon, chicken, pasta, pizza and more, prepared fresh and delivered hot.',
    groups: [['mains', 'Salmon and Chicken'], ['italian', 'Italian'], ['french', 'French'], ['party', 'Team Favourites']] },
  { id: 'platters',   name: 'Platters & Meze',    image: 'platters.jpg',    blurb: 'Cheese and charcuterie, grazing boards, meze, fruit and canapés, arranged with care for meetings and celebrations.',
    groups: [['cheese', 'Cheese and Charcuterie'], ['grazing', 'Grazing Boards'], ['meze', 'Meze and Dips'], ['fruitp', 'Fruit Platters'], ['canapes', 'Canapés and Sweets']] },
  { id: 'drinks',     name: 'Beverages',          image: 'colddrinks.jpg',  blurb: 'Hot and cold beverages, with cocktails, wine and sparkling for celebrations.',
    groups: [['hotd', 'Hot Drinks'], ['cold', 'Cold Drinks'], ['bar', 'Cocktails, Wine and Sparkling']] }
];

// Every item. lunch:true means it is also in the Signature Lunch shop.
function item(id, name, cat, group, image, desc, opts) {
  opts = opts || {};
  var diet = opts.diet || [];
  return {
    id: id, name: name, cat: cat, group: group, image: 'images/' + image, desc: desc,
    lunch: !!opts.lunch,
    sizes: TRAYS.concat(opts.lunch ? SINGLE : []),
    addons: opts.addons || ['cutlery', 'fruitcup', 'cookie', 'water'],
    diet: diet, tags: diet.map(function (d) { return DIETS[d]; }),
    includes: opts.includes || [], popular: !!opts.popular
  };
}

const ITEMS = [
  // ---- Breakfast ----
  item('egg-sandwich',  'Signature Egg & Cheese Sandwiches', 'breakfast', 'sandwiches', 'sandwiches.jpg', 'Soft eggs and melted cheese on fresh bread. A morning meeting favourite.', { lunch: true, diet: ['vegetarian'], addons: ['fruitcup', 'juice', 'coffeebox', 'cutlery'], includes: ['Egg and cheese sandwiches, pressed warm', 'Cut in halves for easy serving', 'Napkins'] }),
  item('bacon-sandwich','Bacon & Egg Sandwiches',            'breakfast', 'sandwiches', 'sandwiches.jpg', 'Crispy bacon, egg and cheese, pressed warm.', { lunch: true, addons: ['fruitcup', 'juice', 'coffeebox', 'cutlery'], includes: ['Bacon, egg and cheese sandwiches', 'Cut in halves', 'Napkins'] }),
  item('veg-wrap',      'Garden Breakfast Wraps',            'breakfast', 'sandwiches', 'wraps.jpg',      'Scrambled egg, peppers, spinach and cheese in a soft wrap.', { lunch: true, diet: ['vegetarian'], addons: ['fruitcup', 'juice', 'coffeebox', 'cutlery'], includes: ['Egg, pepper, spinach and cheese wraps', 'Cut in halves', 'Napkins'] }),
  item('bagel-box',     'Artisan Bagel Collection',          'breakfast', 'bagels',     'bagels.jpg',     'Assorted fresh bagels with cream cheese, butter and jam.', { lunch: true, popular: true, diet: ['vegetarian'], addons: ['fruitcup', 'coffeebox', 'juice', 'cutlery'], includes: ['Assorted fresh bagels, sliced', 'Plain and flavoured cream cheese', 'Butter and jam', 'Knives and napkins'] }),
  item('lox-bagel',     'Smoked Salmon Bagels',              'breakfast', 'bagels',     'bagels.jpg',     'Bagels with smoked salmon, cream cheese, capers and red onion.', { addons: ['fruitcup', 'coffeebox', 'juice', 'cutlery'], includes: ['Bagels with smoked salmon and cream cheese', 'Capers, red onion and lemon on the side', 'Napkins'] }),
  item('croissants',    'Freshly Baked Croissants',          'breakfast', 'pastries',   'croissant.jpg',  'Golden, flaky and baked fresh.', { lunch: true, diet: ['vegetarian'], addons: ['coffeebox', 'fruitcup', 'juice'], includes: ['Butter croissants', 'Butter and jam on the side'] }),
  item('pastry-box',    'The Pastry Collection',             'breakfast', 'pastries',   'slide-coffee.jpg', 'Croissants, muffins and sweet pastries, beautifully arranged.', { popular: true, diet: ['vegetarian'], addons: ['coffeebox', 'fruitcup', 'juice'], includes: ['Croissants', 'Muffins', 'Sweet pastries', 'Napkins'] }),
  item('english',       'The Full English Breakfast',        'breakfast', 'hot',        'breakfast.jpg',  'Eggs, sausage, bacon, beans, grilled tomato and toast.', { addons: ['coffeebox', 'juice', 'fruitcup', 'cutlery'], includes: ['Eggs', 'Sausage and bacon', 'Baked beans', 'Grilled tomato and mushrooms', 'Toast and butter'] }),
  item('brunch',        'The Brunch Collection',             'breakfast', 'hot',        'brunch.jpg',     'Waffles, eggs, fruit and sweet treats for a lively brunch.', { popular: true, addons: ['coffeebox', 'juice', 'fruitcup', 'cutlery'], includes: ['Waffles with syrup', 'Eggs', 'Seasonal fruit', 'Sweet treats'] }),
  item('fruit-cups',    'Seasonal Fruit Cups',               'breakfast', 'fruit',      'fruit.jpg',      'Individual cups of seasonal fruit. Easy to hand out.', { lunch: true, diet: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], addons: ['cookie', 'water'], includes: ['Individual cups of cut seasonal fruit', 'Forks'] }),
  item('fruit-tray',    'Seasonal Fruit Display',            'breakfast', 'fruit',      'fruit.jpg',      'A colourful tray of berries, melon, citrus and more.', { diet: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], addons: ['cutlery', 'cookie', 'water'], includes: ['Cut seasonal fruit, arranged on a tray', 'Serving utensils'] }),

  // ---- Salads ----
  item('caesar',   'Classic Caesar Salad',        'salads', 'classic', 'sal-caesar.jpg',  'Crisp romaine, crunchy croutons, parmesan and creamy dressing.', { lunch: true, popular: true, addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'], includes: ['Romaine lettuce', 'Croutons and parmesan', 'Caesar dressing on the side', 'Serving utensils'] }),
  item('greek',    'Mediterranean Greek Salad',   'salads', 'classic', 'sal-greek.jpg',   'Feta, olives, cucumber, tomato and red onion with oregano dressing.', { lunch: true, diet: ['vegetarian', 'gluten-free'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'], includes: ['Cucumber, tomato and red onion', 'Feta and olives', 'Oregano dressing on the side'] }),
  item('garden',   'Garden Harvest Salad',        'salads', 'classic', 'sal-garden.jpg',  'Mixed greens with colourful vegetables and a light vinaigrette.', { lunch: true, diet: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'], includes: ['Mixed greens', 'Seasonal vegetables', 'Light vinaigrette on the side'] }),
  item('caprese',  'Caprese Salad',               'salads', 'classic', 'sal-caprese.jpg', 'Ripe tomato, fresh mozzarella and basil with balsamic.', { lunch: true, diet: ['vegetarian', 'gluten-free', 'nut-free'], addons: ['dressing', 'cutlery', 'dips'], includes: ['Ripe tomato', 'Fresh mozzarella', 'Basil', 'Balsamic glaze'] }),
  item('rainbow',  'Rainbow Harvest Salad',       'salads', 'hearty',  'sal-rainbow.jpg', 'A bright mix of crunchy raw vegetables and seeds.', { lunch: true, popular: true, diet: ['vegan', 'gluten-free', 'dairy-free'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'], includes: ['Colourful raw vegetables', 'Seeds', 'Light dressing on the side'] }),
  item('grain',    'Harvest Grain Bowl',          'salads', 'hearty',  'sal-grain.jpg',   'Hearty grains, avocado, greens and fresh toppings.', { lunch: true, diet: ['vegan', 'dairy-free'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'], includes: ['Grains', 'Avocado and greens', 'Fresh vegetables', 'Dressing on the side'] }),
  item('cobb',     'Cobb Salad',                  'salads', 'hearty',  'sal-cobb.jpg',    'Chicken, bacon, egg, avocado and tomato in neat rows.', { lunch: true, popular: true, diet: ['gluten-free'], addons: ['dressing', 'cutlery', 'water'], includes: ['Grilled chicken', 'Bacon and egg', 'Avocado and tomato', 'Dressing on the side'] }),
  item('berry',    'Berry & Spinach Salad',       'salads', 'hearty',  'sal-berry.jpg',   'Sweet berries on tender spinach with a light dressing.', { lunch: true, diet: ['vegetarian', 'gluten-free'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'], includes: ['Baby spinach', 'Fresh berries', 'Light dressing on the side'] }),

  // ---- Sandwiches and wraps ----
  item('sand-plat',  'Signature Sandwich Collection', 'sandwiches', 'sand',    'sandwiches.jpg', 'A mix of deli, chicken and vegetarian sandwiches, cut and ready to share.', { lunch: true, popular: true, addons: ['fruitcup', 'cookie', 'water', 'cutlery'], includes: ['Assorted sandwiches, cut in halves', 'A mix of meat and vegetarian fillings', 'Napkins'] }),
  item('panini',     'Pressed Panini Collection',     'sandwiches', 'sand',    'sandwiches.jpg', 'Warm pressed paninis with melted cheese and fresh fillings.', { lunch: true, addons: ['fruitcup', 'cookie', 'water', 'cutlery'], includes: ['Assorted pressed paninis', 'Cut for easy serving', 'Napkins'] }),
  item('wraps',      'Garden Wrap Collection',        'sandwiches', 'wraps',   'wraps.jpg',      'Fresh wraps that are tidy and easy to eat at a desk.', { lunch: true, popular: true, addons: ['fruitcup', 'cookie', 'water', 'cutlery'], includes: ['Assorted wraps, cut in halves', 'A mix of meat and vegetarian fillings', 'Napkins'] }),
  item('burgers',    'Gourmet Burger Collection',     'sandwiches', 'burgers', 'burgers.jpg',    'Juicy burgers with all the toppings, stacked and satisfying.', { lunch: true, addons: ['cookie', 'water', 'cutlery', 'lemonade'], includes: ['Burgers with toppings', 'Sauces on the side', 'Napkins'] }),

  // ---- Hot entrées ----
  item('salmon',   'Lemon & Herb Salmon',     'hot', 'mains',   'salmon.jpg',   'Oven-baked salmon with lemon and fresh herbs. Light and filling.', { lunch: true, popular: true, diet: ['gluten-free', 'dairy-free'], addons: ['fruitcup', 'water', 'cutlery', 'dressing'], includes: ['Oven-baked salmon portions', 'Lemon and fresh herbs', 'Seasonal side'] }),
  item('chicken',  'Herb-Roasted Chicken',    'hot', 'mains',   'chicken.jpg',  'Herb roasted chicken with seasonal vegetables.', { lunch: true, diet: ['gluten-free', 'dairy-free'], addons: ['fruitcup', 'water', 'cutlery'], includes: ['Herb-roasted chicken', 'Seasonal vegetables'] }),
  item('pasta',    'Fresh Pasta Collection',  'hot', 'italian', 'italian.jpg',  'Fresh pasta with your choice of sauce.', { lunch: true, addons: ['dips', 'water', 'cutlery', 'cookie'], includes: ['Fresh pasta in your choice of sauce', 'Parmesan on the side'] }),
  item('lasagna',  'Baked Lasagna',           'hot', 'italian', 'lasagna.jpg',  'Rich, layered and baked until bubbling.', { addons: ['dips', 'water', 'cutlery', 'cookie'], includes: ['Baked lasagna, portioned', 'Served hot'] }),
  item('pizza',    'Artisan Pizza Collection','hot', 'italian', 'pizza.jpg',    'Freshly baked pizzas in a mix of classic flavours.', { popular: true, addons: ['water', 'lemonade', 'cutlery', 'cookie'], includes: ['Assorted freshly baked pizzas', 'Cut into slices'] }),
  item('quiche',   'French Quiche',           'hot', 'french',  'french.jpg',   'Golden quiche served with a fresh green salad.', { lunch: true, diet: ['vegetarian'], addons: ['fruitcup', 'water', 'cutlery'], includes: ['Golden quiche, portioned', 'Fresh green salad'] }),
  item('wings',    'Signature Wings',         'hot', 'party',   'wings.jpg',    'Crispy wings tossed in your choice of sauce.', { popular: true, addons: ['water', 'lemonade', 'cutlery', 'dips'], includes: ['Crispy wings in your choice of sauce', 'Dipping sauce and celery'] }),

  // ---- Platters and meze (the detailed section) ----
  item('cheese',       'Fine Cheese Platter',        'platters', 'cheese',  'cheese.jpg',        'Cheeses, cured meats, fruit and honey, beautifully arranged.', { diet: [], addons: ['crackers', 'honey', 'cutlery', 'water'], includes: ['A selection of soft, firm and aged cheeses', 'Cured meats', 'Seasonal fruit and grapes', 'Honey and preserves', 'Crackers and sliced bread'] }),
  item('charcuterie',  'Cheese & Charcuterie Board', 'platters', 'cheese',  'charcuterie.jpg',   'Cured meats, cheeses, olives and crisp crackers on a wooden board.', { addons: ['crackers', 'olives', 'cutlery', 'water'], includes: ['Selected cured meats', 'A variety of cheeses', 'Olives and pickles', 'Crackers and baguette slices', 'Fresh fruit'] }),
  item('cheese-fruit', 'Cheese & Fruit Platter',     'platters', 'cheese',  'cheese-fruit.jpg',  'A lighter platter of cheeses with fresh fruit and honey. Meat-free.', { diet: ['vegetarian'], addons: ['crackers', 'honey', 'cutlery', 'water'], includes: ['A selection of cheeses', 'Berries, grapes and sliced fruit', 'Honey', 'Crackers'] }),
  item('sharing',      'Grand Grazing Board',        'platters', 'grazing', 'platters.jpg',      'A big, colourful board with something for everyone.', { popular: true, addons: ['crackers', 'dips', 'cutlery', 'skewers'], includes: ['Cheeses and cured meats', 'Fresh and dried fruit', 'Vegetables and dips', 'Crackers, breads and spreads'] }),
  item('grazing-harvest','Harvest Grazing Table',    'platters', 'grazing', 'grazing-harvest.jpg','Seasonal vegetables, fruit, cheeses and spreads in a generous display. Meat-free.', { diet: ['vegetarian'], addons: ['crackers', 'dips', 'cutlery', 'skewers'], includes: ['Seasonal vegetables and fruit', 'A selection of cheeses', 'Dips and spreads', 'Breads and crackers'] }),
  item('meze',         'The Meze Collection',        'platters', 'meze',    'meze.jpg',          'Dips, salads, olives and warm pita for sharing.', { popular: true, diet: ['vegetarian'], addons: ['olives', 'lemonade', 'cutlery', 'water'], includes: ['Hummus', 'Baba ghanoush', 'Tabbouleh', 'Marinated olives', 'Feta with cucumber and tomato', 'Warm pita'] }),
  item('meze-garden',  'Garden Meze Tray',           'platters', 'meze',    'meze-garden.jpg',   'A plant-based meze of dips, salads and warm pita.', { diet: ['vegan', 'dairy-free'], addons: ['olives', 'lemonade', 'cutlery', 'water'], includes: ['Hummus', 'Roasted vegetable dip', 'Tabbouleh', 'Cucumber and tomato salad', 'Olives', 'Warm pita'] }),
  item('meze-grand',   'Grand Meze Display',         'platters', 'meze',    'meze-grand.jpg',    'The full meze experience for a larger celebration.', { addons: ['olives', 'lemonade', 'cutlery', 'skewers'], includes: ['A full selection of dips, salads and small plates', 'Olives, pickles and marinated vegetables', 'Warm pita and flatbreads', 'Serving boards and utensils'] }),
  item('hummus',       'Hummus Trio with Pita',      'platters', 'meze',    'hummus.jpg',        'Three flavours of hummus with warm pita and crisp vegetables.', { diet: ['vegan', 'dairy-free'], addons: ['olives', 'cutlery', 'water'], includes: ['Three flavours of hummus', 'Warm pita', 'Crisp vegetable sticks'] }),
  item('dips',         'Dips & Warm Pita',           'platters', 'meze',    'dips-pita.jpg',     'A selection of dips with warm pita and fresh vegetables.', { diet: ['vegan', 'dairy-free'], addons: ['olives', 'cutlery', 'water'], includes: ['A selection of dips', 'Warm pita', 'Fresh vegetables'] }),
  item('fruit-p',      'Seasonal Fruit Platter',     'platters', 'fruitp',  'fruit.jpg',         'Fresh seasonal fruit, cut and arranged.', { diet: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], addons: ['cutlery', 'water', 'cookie'], includes: ['Cut seasonal fruit', 'Serving utensils'] }),
  item('fruit-berries','Berry Platter',              'platters', 'fruitp',  'fruit-berries.jpg', 'Strawberries, blueberries, raspberries and blackberries.', { diet: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], addons: ['cutlery', 'water', 'cookie'], includes: ['Assorted fresh berries', 'Serving utensils'] }),
  item('fruit-citrus', 'Citrus & Melon Platter',     'platters', 'fruitp',  'fruit-citrus.jpg',  'Oranges, melon, kiwi and more, bright and refreshing.', { diet: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], addons: ['cutlery', 'water', 'cookie'], includes: ['Citrus, melon and kiwi', 'Serving utensils'] }),
  item('canape',       'The Canapé Collection',      'platters', 'canapes', 'events.jpg',        'Elegant hot and cold bites for celebrations and receptions.', { addons: ['cutlery', 'water', 'lemonade'], includes: ['An assortment of hot and cold bites', 'Mini tartlets and savoury pastries', 'Napkins'] }),
  item('skewers',      'Party Skewers',              'platters', 'canapes', 'space2.jpg',        'Colourful skewers, ready to serve and easy to eat.', { addons: ['cutlery', 'water', 'lemonade'], includes: ['Assorted skewers', 'Dipping sauces', 'Napkins'] }),
  item('sweet-board',  'Sweet Grazing Board',        'platters', 'canapes', 'grazing-fruit.jpg', 'A dessert board of fruit, sweets and small treats.', { diet: ['vegetarian'], addons: ['coffeebox', 'cutlery', 'water'], includes: ['Fresh fruit', 'Mini sweets and treats', 'Cookies'] }),

  // ---- Beverages ----
  item('coffee-box','Coffee & Tea Service',        'drinks', 'hotd', 'hotdrinks.jpg',  'Fresh coffee, tea and hot chocolate with cups and stirrers.', { lunch: true, addons: ['cookie', 'pastry'], includes: ['Fresh coffee', 'Tea selection', 'Hot chocolate', 'Cups, lids and stirrers', 'Milk and sugar'] }),
  item('lemonade',  'Fresh Lemonade',              'drinks', 'cold', 'colddrinks.jpg', 'Bright, refreshing lemonade by the jug or by the cup.', { lunch: true, diet: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'], addons: ['cookie', 'water'], includes: ['Fresh lemonade', 'Cups and ice'] }),
  item('juice',     'Juices & Iced Beverages',     'drinks', 'cold', 'colddrinks.jpg', 'Orange juice, iced coffee and more.', { lunch: true, addons: ['cookie', 'water'], includes: ['Selection of juices and iced drinks', 'Cups and ice'] }),
  item('cocktails', 'Celebration Cocktails',       'drinks', 'bar',  'drinks.jpg',     'Cocktails for celebrations. Ask us about options for your event.', { addons: ['water', 'lemonade'], includes: ['Cocktails for your event', 'Garnishes', 'Ask us about options'] }),
  item('wine',      'Wine & Sparkling',            'drinks', 'bar',  'champagne.jpg',  'Wine and sparkling to match your menu. Ask us about options.', { addons: ['water', 'cutlery'], includes: ['Wine and sparkling selection', 'Ask us about options'] })
];

const CATALOG = { categories: CATEGORIES, items: ITEMS, addons: ADDONS, diets: DIETS, allergenNote: ALLERGEN_NOTE };
