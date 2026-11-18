# North York Catering: how the site is put together

Plain HTML, JavaScript and CSS. No build step. Styling uses Tailwind (loaded from the web).

## Pages
| Page | What it is |
| --- | --- |
| `index.html` | Home: fast slideshow, two ways to dine, guest favourites, bespoke order form, event space, questions |
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
- **Menu, photos, prices:** `js/data.js`. A price of `null` shows just "$". Replace it with a number (for example `48.50`) and every page, the cart and checkout use it.
- **Photos:** `images/`. Replace a file with your own photo using the same name.
- **Header, footer, cart, login logic:** `js/app.js`
- **Menu builders (steps and which dishes appear in each):** `js/builder.js`. Edit the item lists at the top to change what customers can choose.
- **Shop page behaviour:** `js/pages.js`
- **Colours and fonts:** `js/tw.js` and `css/site.css`. The look is white pages and black ink, with green and dark orange used only as accents.
- **Dietary labels, serving sizes and "What's included":** also in `js/data.js` (`diet`, `serves`, `includes`). These are best guesses and need checking before the site goes live.

## Decisions
- **Same header and footer on every page** are written once in `js/app.js`.
- **Cart, login and past orders are saved in the visitor's own browser** (not a server). They are for demonstration.
- **Checkout is simulated.** It never stores or sends card details. Real payment needs a payment provider account (for example Square or Stripe) and a small secure back end; this is a later step.
- **Sales tax:** 13% HST is shown in the cart and checkout.
- **Photos are free stock photos** (Unsplash) and are placeholders until replaced with real photos. See `CREDITS.md`.
- **Wording and layout** follow the structure of a lively catering site (slideshow, two ways to order, shop by category) with original wording, photos and colours.

- **Customers compose their own menus.** The old request form is gone. Each builder page lets guests pick dishes, sizes and quantities; the choices go into the cart with the guest count, date and notes, and the checkout pre-fills the guest count and date.

- **Cache stamp:** every page loads its scripts and styles with a version tag (for example `js/app.js?v=20261118b`). When the code changes, change that tag on every page so visitors get the newest version at once instead of an old saved copy.
