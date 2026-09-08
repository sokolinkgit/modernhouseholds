# Casa Kitchen and Home 🏠

**Household Supplies & Home Decor** — Malik Heights, Adams Arcade, Ngong Road, Nairobi.

A fully responsive single-page website for Casa Kitchen and Home, a Nairobi shop dealing in household supplies and home décor. Delivery is available.

## 📍 Shop Details
- **Location:** Malik Heights, Adams Arcade, Ngong Road, Nairobi
- **Map:** [Google Maps](https://maps.app.goo.gl/DoWsDo4oT7RYQKDb9)
- **Phone / WhatsApp:** 0796 014 187

## ✨ Features
- Hero, about, products, why-us, testimonials and visit-us sections
- Product catalogue with category filters (Kitchen Appliances, Flasks & Thermos, Dining, Cookware, Home Decor)
- Shopping cart with quantity controls (saved in localStorage)
- **Order via WhatsApp** — the cart builds a ready-to-send order message
- **Admin panel** (tap the logo five times to sign in) — add/edit/delete categories & products with photo uploads. Catalogue is stored on this device so a dedicated database can be connected later without changing the site architecture.
  - **Bulk upload** — pick (or create) a category, then select *all* product photos at once (file picker or drag & drop); each photo becomes one product, and price, tag and description can be filled in later, one by one. Tick **Combine all selected photos into one product** to keep a batch of colours/types as a single multi-photo product
  - **Merge products** — in "Manage all", tick 2 or more entries for the same item in different colours / types / sizes, then press **Merge selected**; the variants become one product that keeps all of their photos (the customer sees them as a single product with multiple images)
  - **Bulk delete** — in "Manage all", tick any products (or hit "Select all") and delete them in one go
- Embedded Google Map + directions link, floating WhatsApp button, back-to-top
- Mobile-first responsive design with hamburger menu
- Scroll-reveal animations, toast notifications, active-nav highlighting

## 🛠️ Built With
HTML, CSS and vanilla JavaScript only — no frameworks, no libraries.

## 🚀 Run Locally
Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## 📁 Structure
```
├── index.html        # Page markup
├── css/style.css     # All styling
├── js/main.js        # Catalogue, cart, WhatsApp checkout & interactions
└── images/           # Product & hero images
```
