// ============================================================
// THE MENU: edit this file to change items, photos and prices.
//
//  * price: null  shows just "$" (price not set yet).
//    Replace null with a number, e.g. price: 48.50, and every page,
//    the cart and the checkout will use it automatically.
//  * image: path inside the "images" folder. Replace the file with
//    your own photo (same name) or change the name here.
// ============================================================

// Sizes. "group" sizes are for catering; "single" is for quick lunch.
const TRAYS = [
  { name: 'Small tray',  kind: 'group', price: null },
  { name: 'Medium tray', kind: 'group', price: null },
  { name: 'Large tray',  kind: 'group', price: null }
];
const SINGLE = [{ name: 'Individual', kind: 'single', price: null }];

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
  pastry:     { name: 'Mini pastries',               price: null }
};

// Main sections of the shop.
const CATEGORIES = [
  { id: 'breakfast',  name: 'Breakfast',          color: 'bg-sun',   image: 'brunch.jpg',   blurb: 'Pastries, bagels, sandwiches, seasonal fruit and cooked breakfasts, for mornings begun beautifully.',
    groups: [['sandwiches', 'Breakfast Sandwiches'], ['bagels', 'Bagels'], ['pastries', 'Breads and Pastries'], ['hot', 'Cooked Breakfasts'], ['fruit', 'Fruit Cups and Platters']] },
  { id: 'salads',     name: 'Salads',             color: 'bg-mint',  image: 'sal-rainbow.jpg', blurb: 'Generous, artfully composed salads. Finish with grilled salmon or chicken for a complete luncheon.',
    groups: [['classic', 'Classic Salads'], ['hearty', 'Hearty Salads and Bowls']] },
  { id: 'sandwiches', name: 'Sandwiches & Wraps', color: 'bg-peach', image: 'sandwiches.jpg', blurb: 'Generously filled, pressed warm and wrapped for graceful desk-side dining.',
    groups: [['sand', 'Sandwiches and Paninis'], ['wraps', 'Wraps'], ['burgers', 'Burgers']] },
  { id: 'hot',        name: 'Hot Entrées',         color: 'bg-lilac', image: 'salmon.jpg',   blurb: 'Salmon, chicken, pasta, pizza and more, prepared fresh and delivered hot.',
    groups: [['mains', 'Salmon and Chicken'], ['italian', 'Italian'], ['french', 'French'], ['party', 'Team Favourites']] },
  { id: 'platters',   name: 'Platters & Meze',    color: 'bg-sky',   image: 'platters.jpg', blurb: 'Fine cheeses, meze and grazing boards, arranged with care for meetings and celebrations.',
    groups: [['boards', 'Sharing Boards'], ['meze', 'Meze'], ['fruitp', 'Fruit']] },
  { id: 'drinks',     name: 'Beverages',             color: 'bg-sun',   image: 'colddrinks.jpg', blurb: 'Hot and cold beverages, with cocktails, wine and sparkling for celebrations.',
    groups: [['hotd', 'Hot Drinks'], ['cold', 'Cold Drinks'], ['bar', 'Cocktails, Wine and Sparkling']] }
];

// Every item. lunch:true means it is also in the Quick Lunch shop.
function item(id, name, cat, group, image, desc, opts) {
  opts = opts || {};
  return {
    id: id, name: name, cat: cat, group: group, image: 'images/' + image, desc: desc,
    lunch: !!opts.lunch, onlyLunch: !!opts.onlyLunch,
    sizes: (opts.onlyLunch ? [] : TRAYS).concat(opts.lunch || opts.onlyLunch ? SINGLE : []),
    addons: opts.addons || ['cutlery', 'fruitcup', 'cookie', 'water'],
    tags: opts.tags || [], popular: !!opts.popular
  };
}

const ITEMS = [
  // ---- Breakfast ----
  item('egg-sandwich',  'Signature Egg & Cheese Sandwiches', 'breakfast', 'sandwiches', 'sandwiches.jpg', 'Soft eggs and melted cheese on fresh bread. A morning meeting favourite.', { lunch: true, addons: ['fruitcup', 'juice', 'coffeebox', 'cutlery'] }),
  item('bacon-sandwich','Bacon & Egg Sandwiches',            'breakfast', 'sandwiches', 'sandwiches.jpg', 'Crispy bacon, egg and cheese, pressed warm.', { lunch: true, addons: ['fruitcup', 'juice', 'coffeebox', 'cutlery'] }),
  item('veg-wrap',      'Garden Breakfast Wraps',              'breakfast', 'sandwiches', 'wraps.jpg',      'Scrambled egg, peppers, spinach and cheese in a soft wrap.', { lunch: true, tags: ['Vegetarian'], addons: ['fruitcup', 'juice', 'coffeebox', 'cutlery'] }),
  item('bagel-box',     'Artisan Bagel Collection',         'breakfast', 'bagels',     'bagels.jpg',     'Assorted fresh bagels with cream cheese, butter and jam.', { lunch: true, popular: true, tags: ['Vegetarian'], addons: ['fruitcup', 'coffeebox', 'juice', 'cutlery'] }),
  item('lox-bagel',     'Smoked Salmon Bagels',                'breakfast', 'bagels',     'bagels.jpg',     'Bagels with smoked salmon, cream cheese, capers and red onion.', { addons: ['fruitcup', 'coffeebox', 'juice', 'cutlery'] }),
  item('croissants',    'Freshly Baked Croissants',                   'breakfast', 'pastries',   'croissant.jpg',  'Golden, flaky and baked fresh.', { lunch: true, tags: ['Vegetarian'], addons: ['coffeebox', 'fruitcup', 'juice'] }),
  item('pastry-box',    'The Pastry Collection',                 'breakfast', 'pastries',   'slide-coffee.jpg', 'Croissants, muffins and sweet pastries with coffee-time charm.', { popular: true, tags: ['Vegetarian'], addons: ['coffeebox', 'fruitcup', 'juice'] }),
  item('english',       'The Full English Breakfast',              'breakfast', 'hot',        'breakfast.jpg',  'Eggs, sausage, bacon, beans, grilled tomato and toast.', { addons: ['coffeebox', 'juice', 'fruitcup', 'cutlery'] }),
  item('brunch',        'The Brunch Collection',                       'breakfast', 'hot',        'brunch.jpg',     'Waffles, eggs, fruit and sweet treats for a lively brunch.', { popular: true, addons: ['coffeebox', 'juice', 'fruitcup', 'cutlery'] }),
  item('fruit-cups',    'Seasonal Fruit Cups',                    'breakfast', 'fruit',      'fruit.jpg',      'Individual cups of seasonal fruit. Easy to hand out.', { lunch: true, tags: ['Vegan'], addons: ['cookie', 'water'] }),
  item('fruit-tray',    'Seasonal Fruit Display',                 'breakfast', 'fruit',      'fruit.jpg',      'A colourful tray of berries, melon, citrus and more.', { tags: ['Vegan'], addons: ['cutlery', 'cookie', 'water'] }),

  // ---- Salads ----
  item('caesar',   'Classic Caesar Salad',        'salads', 'classic', 'sal-caesar.jpg',  'Crisp romaine, crunchy croutons, parmesan and creamy dressing.', { lunch: true, popular: true, addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('greek',    'Mediterranean Greek Salad',         'salads', 'classic', 'sal-greek.jpg',   'Feta, olives, cucumber, tomato and red onion with oregano dressing.', { lunch: true, tags: ['Vegetarian'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('garden',   'Garden Harvest Salad',  'salads', 'classic', 'sal-garden.jpg',  'Mixed greens with colourful vegetables and a light vinaigrette.', { lunch: true, tags: ['Vegan'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('caprese',  'Caprese Salad',       'salads', 'classic', 'sal-caprese.jpg', 'Ripe tomato, fresh mozzarella and basil with balsamic.', { lunch: true, tags: ['Vegetarian'], addons: ['dressing', 'cutlery', 'dips'] }),
  item('rainbow',  'Rainbow Harvest Salad','salads','hearty',  'sal-rainbow.jpg', 'A bright mix of crunchy raw vegetables and seeds.', { lunch: true, popular: true, tags: ['Vegan'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('grain',    'Harvest Grain Bowl',          'salads', 'hearty',  'sal-grain.jpg',   'Hearty grains, avocado, greens and fresh toppings.', { lunch: true, tags: ['Vegan'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),
  item('cobb',     'Cobb Salad',          'salads', 'hearty',  'sal-cobb.jpg',    'Chicken, bacon, egg, avocado and tomato in neat rows.', { lunch: true, popular: true, addons: ['dressing', 'cutlery', 'water'] }),
  item('berry',    'Berry & Spinach Salad','salads','hearty','sal-berry.jpg',   'Sweet berries on tender spinach with a light dressing.', { lunch: true, tags: ['Vegetarian'], addons: ['chicken', 'salmonadd', 'dressing', 'cutlery'] }),

  // ---- Sandwiches and wraps ----
  item('sand-plat',  'Signature Sandwich Collection',   'sandwiches', 'sand',    'sandwiches.jpg', 'A mix of deli, chicken and vegetarian sandwiches, cut and ready to share.', { lunch: true, popular: true, addons: ['fruitcup', 'cookie', 'water', 'cutlery'] }),
  item('panini',     'Pressed Panini Collection',     'sandwiches', 'sand',    'sandwiches.jpg', 'Warm pressed paninis with melted cheese and fresh fillings.', { lunch: true, addons: ['fruitcup', 'cookie', 'water', 'cutlery'] }),
  item('wraps',      'Garden Wrap Collection',       'sandwiches', 'wraps',   'wraps.jpg',      'Fresh wraps that are tidy and easy to eat at a desk.', { lunch: true, popular: true, addons: ['fruitcup', 'cookie', 'water', 'cutlery'] }),
  item('burgers',    'Gourmet Burger Collection',         'sandwiches', 'burgers', 'burgers.jpg',    'Juicy burgers with all the toppings, stacked and satisfying.', { lunch: true, addons: ['cookie', 'water', 'cutlery', 'lemonade'] }),

  // ---- Hot dishes ----
  item('salmon',   'Lemon & Herb Salmon',   'hot', 'mains',   'salmon.jpg',   'Oven-baked salmon with lemon and fresh herbs. Light and filling.', { lunch: true, popular: true, addons: ['fruitcup', 'water', 'cutlery', 'dressing'] }),
  item('chicken',  'Herb-Roasted Chicken',       'hot', 'mains',   'chicken.jpg',  'Herb roasted chicken with seasonal vegetables.', { lunch: true, addons: ['fruitcup', 'water', 'cutlery'] }),
  item('pasta',    'Fresh Pasta Collection',  'hot', 'italian', 'italian.jpg',  'Fresh pasta with your choice of sauce.', { lunch: true, addons: ['dips', 'water', 'cutlery', 'cookie'] }),
  item('lasagna',  'Baked Lasagna',       'hot', 'italian', 'lasagna.jpg',  'Rich, layered and baked until bubbling.', { addons: ['dips', 'water', 'cutlery', 'cookie'] }),
  item('pizza',    'Artisan Pizza Collection',    'hot', 'italian', 'pizza.jpg',    'Freshly baked pizzas in a mix of classic flavours.', { popular: true, addons: ['water', 'lemonade', 'cutlery', 'cookie'] }),
  item('quiche',   'French Quiche',       'hot', 'french',  'french.jpg',   'Golden quiche served with a fresh green salad.', { lunch: true, tags: ['Vegetarian'], addons: ['fruitcup', 'water', 'cutlery'] }),
  item('wings',    'Signature Wings',  'hot', 'party',   'wings.jpg',    'Crispy wings tossed in your choice of sauce.', { popular: true, addons: ['water', 'lemonade', 'cutlery', 'dips'] }),

  // ---- Platters and meze ----
  item('cheese',   'Fine Cheese Platter',      'platters', 'boards', 'cheese.jpg',    'Cheeses, cured meats, fruit and honey, beautifully arranged.', { addons: ['cutlery', 'water', 'dips'] }),
  item('sharing',  'Grand Grazing Board',       'platters', 'boards', 'platters.jpg',  'A big, colourful board with something for everyone.', { popular: true, addons: ['cutlery', 'water', 'dips'] }),
  item('meze',     'The Meze Collection',         'platters', 'meze',   'meze.jpg',      'Dips, salads, olives and warm pita for sharing.', { popular: true, tags: ['Vegetarian'], addons: ['cutlery', 'water', 'lemonade'] }),
  item('fruit-p',  'Seasonal Fruit Platter', 'platters', 'fruitp', 'fruit.jpg',     'Fresh seasonal fruit, cut and arranged.', { tags: ['Vegan'], addons: ['cutlery', 'water', 'cookie'] }),

  // ---- Drinks ----
  item('coffee-box','Coffee & Tea Service',  'drinks', 'hotd', 'hotdrinks.jpg',  'Fresh coffee, tea and hot chocolate with cups and stirrers.', { lunch: true, addons: ['cookie', 'pastry'] }),
  item('lemonade',  'Fresh Lemonade',      'drinks', 'cold', 'colddrinks.jpg', 'Bright, refreshing lemonade by the jug or by the cup.', { lunch: true, addons: ['cookie', 'water'] }),
  item('juice',     'Juices & Iced Beverages','drinks','cold', 'colddrinks.jpg', 'Orange juice, iced coffee and more.', { lunch: true, addons: ['cookie', 'water'] }),
  item('cocktails', 'Celebration Cocktails',     'drinks', 'bar',  'drinks.jpg',     'Cocktails for celebrations. Ask us about options for your event.', { addons: ['water', 'lemonade'] }),
  item('wine',      'Wine & Sparkling',  'drinks', 'bar',  'champagne.jpg',  'Wine and sparkling to match your menu. Ask us about options.', { addons: ['water', 'cutlery'] })
];

const CATALOG = { categories: CATEGORIES, items: ITEMS, addons: ADDONS };
