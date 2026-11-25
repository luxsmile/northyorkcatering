# North York Catering: how the site is put together

Plain HTML, JavaScript and CSS. No build step. Styling uses Tailwind (loaded from the web).

## Pages
| Page | What it is |
| --- | --- |
| `index.html` | The opening page of the web address: the Catering shop (same as `catering.html`) |
| `home.html` | Home: fast slideshow, two ways to dine, guest favourites, bespoke order form, event space, questions |
| `catering.html` | Catering shop: browse the collections, then "the full collection" |
| `takeout.html` | Signature Lunch shop (individually presented lunches) |
| `category.html` | One collection (e.g. Platters & Meze), split into sections, with a filter sidebar (Vegan, Vegetarian, Gluten-free, Dairy-free, Nut-free) |
| `product.html` | One item: serving sizes, extras (fruit cups, drinks), what's included, dietary and allergen details, serving guide |
| `build.html` | Build Your Menu: choose an occasion |
| `build-breakfast.html`, `build-lunch.html`, `build-party.html`, `build-full.html` | Separate pages where customers pick their own dishes step by step, then add the whole menu to the cart |
| `cart.html` | The cart |
| `checkout.html` | Demonstration checkout (no real payment) |
| `login.html` | Demonstration login, account and past orders |
| `locations.html` | Where we deliver, contact details, delivery area check |

## Where to change things
- **Menu, photos, prices:** `js/data.js`. Each item says how it is sold: `each(9.99)`, `bottle(2.49)`, `perPerson(6.99)`, `one(name, note, price, minimum)`, or the shared `SALAD` (individual, or bowl for 10, 15, 20) and `PASTA` (tray for 10) lists. A price of `null` shows just "$". Items with a "single" size also appear in Signature Lunch. A minimum (coffee thermos: 20) is enforced on the item page, builder and cart.
- **Photos:** `images/`. Replace a file with your own photo using the same name.
- **Header, footer, cart, login logic:** `js/app.js`
- **Menu builders (steps and which dishes appear in each):** `js/builder.js`. Edit the item lists at the top to change what customers can choose.
- **Shop page behaviour:** `js/pages.js`
- **Colours and fonts:** `js/tw.js` and `css/site.css`. The look is white pages and black ink, with green and dark orange used only as accents.
- **Dietary labels, serving sizes and "What's included":** also in `js/data.js` (`diet`, the size note, `includes`). These are best guesses and need checking before the site goes live.

## Decisions
- **Same header and footer on every page** are written once in `js/app.js`.
- **Cart, login and past orders are saved in the visitor's own browser** (not a server). They are for demonstration.
- **Checkout is simulated.** It never stores or sends card details. Real payment needs a payment provider account (for example Square or Stripe) and a small secure back end; this is a later step.
- **Sales tax:** 13% HST is shown in the cart and checkout.
- **Photos are free stock photos** (Unsplash) and are placeholders until replaced with real photos. See `CREDITS.md`.
- **Wording and layout** follow the structure of a lively catering site (slideshow, two ways to order, shop by category) with original wording, photos and colours.

- **Customers compose their own menus.** The old request form is gone. Each builder page lets guests pick dishes, sizes and quantities; the choices go into the cart with the guest count, date and notes, and the checkout pre-fills the guest count and date.

- **Cache stamp:** every page loads its scripts and styles with a version tag (for example `js/app.js?v=20261118b`). When the code changes, change that tag on every page so visitors get the newest version at once instead of an old saved copy.

- **The web address opens on Catering** (owner request, 25 Nov 2026). Keep `index.html` and `catering.html` identical.
- **Menu replaced 25 Nov 2026** with the owner's list and prices. Pasta tray price is waiting for confirmation.
- **Bank account details** are never put on the site or in these files.
- **Delivery fee** (owner, 25 Nov 2026): 10% of the food subtotal, capped at $50; pickup free. HST is charged on food plus delivery. Rates are at the top of `js/app.js`.
- **Order rules** (owner, 25 Nov 2026): delivery minimum $200 on food (none for pickup); 24 hours notice (date and time window at checkout); cancellation free 4 or more days before, 30% within 4 days; 13% HST added to prices. Settings and wording are at the top of `js/app.js`; the same wording is repeated in the questions on `home.html`.
