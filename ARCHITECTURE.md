# North York Catering: how the site is put together

Plain HTML, JavaScript and CSS. No build step. Styling uses Tailwind (loaded from the web).

## Pages
| Page | What it is |
| --- | --- |
| `index.html` | Home: fast slideshow, two ways to dine, guest favourites, bespoke order form, event space, questions |
| `catering.html` | Catering shop: browse the collections, then "the full collection" |
| `takeout.html` | Signature Lunch shop (individually presented lunches) |
| `category.html` | One collection (e.g. Breakfast), split into sections (Sandwiches, Bagels, Pastries, Fruit) |
| `product.html` | One item: choose size, add extras (fruit cups, drinks), quantity, special requests |
| `cart.html` | The cart |
| `checkout.html` | Demonstration checkout (no real payment) |
| `login.html` | Demonstration login, account and past orders |
| `locations.html` | Where we deliver, contact details, delivery area check |

## Where to change things
- **Menu, photos, prices:** `js/data.js`. A price of `null` shows just "$". Replace it with a number (for example `48.50`) and every page, the cart and checkout use it.
- **Photos:** `images/`. Replace a file with your own photo using the same name.
- **Header, footer, cart, login logic:** `js/app.js`
- **Shop page behaviour:** `js/pages.js`
- **Colours and fonts:** `js/tw.js` and `css/site.css`

## Decisions
- **Same header and footer on every page** are written once in `js/app.js`.
- **Cart, login and past orders are saved in the visitor's own browser** (not a server). They are for demonstration.
- **Checkout is simulated.** It never stores or sends card details. Real payment needs a payment provider account (for example Square or Stripe) and a small secure back end; this is a later step.
- **Sales tax:** 13% HST is shown in the cart and checkout.
- **Photos are free stock photos** (Unsplash) and are placeholders until replaced with real photos. See `CREDITS.md`.
- **Wording and layout** follow the structure of a lively catering site (slideshow, two ways to order, shop by category) with original wording, photos and colours.
