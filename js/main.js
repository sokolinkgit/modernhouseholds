/* ============================================================
   CASA KITCHEN AND HOME — Household Supplies & Home Decor
   Pure JavaScript (no libraries)
   Catalogue lives locally so a dedicated database can be
   plugged in later without changing the site architecture.
   ============================================================ */

const SHOP_NAME = "Casa Kitchen and Home";
const SHOP_PHONE_DISPLAY = "0796 014 187";
const WHATSAPP_NUMBER = "254796014187";
const CATALOGUE_KEY = "casaCatalogue";
const CART_KEY = "casaCart";
const ADMIN_SESSION_KEY = "casaAdminSession";
let CATEGORIES = [
  { id: "appliances", slug: "appliances", name: "Kitchen Appliances", emoji: "🍳", image_url: "" },
  { id: "flasks", slug: "flasks", name: "Flasks & Thermos", emoji: "🧴", image_url: "" },
  { id: "dining", slug: "dining", name: "Dining", emoji: "🍽️", image_url: "" },
  { id: "cookware", slug: "cookware", name: "Cookware", emoji: "🥘", image_url: "" },
  { id: "decor", slug: "decor", name: "Home Decor", emoji: "🕯️", image_url: "" },
];
let isAdmin = false;

/* ---------- Product catalogue ---------- */
let PRODUCTS = [
  {
    id: "flask",
    name: "Stainless Steel Vacuum Flask",
    category: "flasks",
    categoryLabel: "Flasks & Thermos",
    price: 1500,
    image: "images/flask.jpg",
    tag: "Best Seller",
    desc: "1.5L food-grade flask that keeps drinks hot or cold for 12+ hours.",
  },
  {
    id: "kettle",
    name: "Electric Kettle",
    category: "appliances",
    categoryLabel: "Kitchen Appliances",
    price: 2200,
    image: "images/kettle.jpg",
    tag: "Hot",
    desc: "Fast-boiling 1.7L stainless steel kettle with auto shut-off safety.",
  },
  {
    id: "blender",
    name: "Heavy-Duty Blender",
    category: "appliances",
    categoryLabel: "Kitchen Appliances",
    price: 4500,
    image: "images/blender.jpg",
    tag: null,
    desc: "Powerful glass-jug blender for smoothies, juices and soft foods.",
  },
  {
    id: "thermos",
    name: "Premium Vacuum Thermos",
    category: "flasks",
    categoryLabel: "Flasks & Thermos",
    price: 1800,
    image: "images/thermos.jpg",
    tag: null,
    desc: "Sleek matte thermos with cup lid — perfect for office, travel and home.",
  },
  {
    id: "plates",
    name: "Ceramic Dinner Plates (Set of 6)",
    category: "dining",
    categoryLabel: "Dining",
    price: 2500,
    image: "images/plates.jpg",
    tag: null,
    desc: "Elegant white ceramic plates — durable, chip-resistant, easy to clean.",
  },
  {
    id: "bottles",
    name: "Stainless Water Bottles",
    category: "flasks",
    categoryLabel: "Flasks & Thermos",
    price: 850,
    image: "images/bottles.jpg",
    tag: null,
    desc: "Leak-proof reusable bottles in assorted colours. Great for kids & gym.",
  },
  {
    id: "pots",
    name: "Cooking Pots Set (3 pcs)",
    category: "cookware",
    categoryLabel: "Cookware",
    price: 5500,
    image: "images/pots.jpg",
    tag: "Best Seller",
    desc: "Gleaming stainless steel sufuria set with glass lids — a kitchen must-have.",
  },
  {
    id: "cutlery",
    name: "Cutlery Set (24 pcs)",
    category: "dining",
    categoryLabel: "Dining",
    price: 1200,
    image: "images/cutlery.jpg",
    tag: null,
    desc: "Complete fork, knife and spoon set for 6 — polished stainless steel.",
  },
  {
    id: "mugs",
    name: "Ceramic Mugs (Set of 4)",
    category: "dining",
    categoryLabel: "Dining",
    price: 1000,
    image: "images/mugs.jpg",
    tag: null,
    desc: "Stylish warm-coloured mugs for tea, coffee and cocoa moments.",
  },
];

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function formatKES(n) {
  return "KES " + n.toLocaleString("en-KE");
}

function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- Render products ---------- */
const productsGrid = $("#productsGrid");
const escapeHtml = (value = "") => String(value).replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#039;" }[c]));
function categoryLabel(slug) {
  return CATEGORIES.find((c) => c.slug === slug)?.name || slug;
}
function slugify(str) {
  return (
    String(str || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-+|-+$)/g, "") || "category"
  );
}
function categoryChipIcon(cat) {
  if (cat?.image_url) return `<img class="filter-chip-img" src="${escapeHtml(cat.image_url)}" alt="" />`;
  return cat?.emoji ? `${escapeHtml(cat.emoji)} ` : "";
}
function productImages(p) {
  if (p?.images && p.images.length) return p.images;
  return p?.image ? [p.image] : [];
}

function renderProducts(filter = "all") {
  productsGrid.innerHTML = "";
  const list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  list.forEach((p, i) => {
    const waText = encodeURIComponent(
      `Hello ${SHOP_NAME}! \n\n` +
        `I'd like to order:\n• ${p.name} — ${formatKES(p.price)}\n\n` +
        `Please confirm availability and delivery details.\n\n` +
        `Thank you!`
    );
    const imgs = productImages(p);
    const cover = imgs[0] || p.image || "";
    const card = document.createElement("article");
    card.className = "product-card" + (isAdmin ? " is-admin" : "");
    card.style.animationDelay = i * 0.06 + "s";
    card.innerHTML = `
      <div class="product-media" data-product-gallery="${escapeHtml(p.id)}">
        <img class="product-main-img" src="${cover}" alt="${p.name}" loading="lazy" />
        ${imgs.length > 1 ? `
          <button class="product-gal-nav product-gal-prev" type="button" data-id="${escapeHtml(p.id)}" data-step="-1" aria-label="Previous photo" title="Previous photo">‹</button>
          <button class="product-gal-nav product-gal-next" type="button" data-id="${escapeHtml(p.id)}" data-step="1" aria-label="Next photo" title="Next photo">›</button>
          <div class="product-gal-dots" aria-label="Product photo gallery">
            ${imgs.map((_, idx) => `<button class="product-gal-dot${idx === 0 ? " active" : ""}" type="button" data-id="${escapeHtml(p.id)}" data-index="${idx}" aria-label="Show photo ${idx + 1} of ${imgs.length}"></button>`).join("")}
          </div>` : ""}
        ${p.tag ? `<span class="product-tag ${p.tag === "Hot" ? "hot" : ""}">${p.tag}</span>` : ""}
        ${isAdmin ? `
          <div class="admin-overlay">
            <button class="admin-overlay-btn edit-product-quick" data-id="${p.id}" type="button" aria-label="Edit ${escapeHtml(p.name)}" title="Edit">✎</button>
            <button class="admin-overlay-btn delete-product-quick" data-id="${p.id}" type="button" aria-label="Delete ${escapeHtml(p.name)}" title="Delete">🗑</button>
          </div>` : ""}
      </div>
      <div class="product-body">
        <span class="product-cat">${escapeHtml(categoryLabel(p.category))}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="product-desc">${escapeHtml(p.desc)}</p>
        ${isAdmin ? `
          <label class="admin-quick-move">Move to category
            <select class="quick-category-select" data-id="${p.id}">
              ${CATEGORIES.map((c) => `<option value="${escapeHtml(c.slug)}" ${c.slug === p.category ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}
            </select>
          </label>` : ""}
        <div class="product-foot">
          <span class="product-price">${formatKES(p.price)}</span>
          <button class="add-btn" data-id="${p.id}" aria-label="Add ${p.name} to cart">
            <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Add
          </button>
        </div>
        <a class="wa-order-btn" href="https://wa.me/${WHATSAPP_NUMBER}?text=${waText}" target="_blank" rel="noopener" aria-label="Order ${p.name} on WhatsApp">
          <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zm-5.45 7.23a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3.14.82.84-3.06-.2-.31a8.3 8.3 0 0 1-1.28-4.44c0-4.6 3.75-8.35 8.37-8.35a8.3 8.3 0 0 1 8.35 8.37c0 4.6-3.76 8.34-8.41 8.34zm8.42-18.37C18.85 1.75 17.06 1 15.1 1h-.07A11.11 11.11 0 0 0 3.94 12.14c0 1.96.51 3.87 1.49 5.56L3.85 23l5.44-1.42a11.05 11.05 0 0 0 5.3 1.35h.01c6.15 0 11.15-5 11.16-11.14 0-2.97-1.16-5.77-3.27-7.87z"/></svg>
          Order on WhatsApp
        </a>
      </div>`;
    productsGrid.appendChild(card);
  });

  if (isAdmin) {
    const addCard = document.createElement("button");
    addCard.type = "button";
    addCard.id = "addProductGhostCard";
    addCard.className = "product-card add-product-card";
    addCard.innerHTML = `<span class="add-product-plus">+</span><span>Add product${filter !== "all" ? ` to ${escapeHtml(categoryLabel(filter))}` : ""}</span>`;
    productsGrid.appendChild(addCard);
  }
}

/* ---------- Filters ---------- */
const filterBar = $("#filterBar");
filterBar.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".filter-chip-edit");
  const addBtn = e.target.closest("#addCategoryChipBtn");
  const btn = e.target.closest(".filter-btn");
  if (editBtn) return openCategoryDialog(CATEGORIES.find((c) => String(c.id) === String(editBtn.dataset.id)));
  if (addBtn) return openCategoryDialog();
  if (!btn) return;
  $$(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(btn.dataset.filter);
});

/* ---------- Cart ---------- */
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
} catch {
  cart = [];
}

const cartBtn = $("#cartBtn");
const cartDrawer = $("#cartDrawer");
const cartOverlay = $("#cartOverlay");
const cartCount = $("#cartCount");
const cartHeadCount = $("#cartHeadCount");
const cartItems = $("#cartItems");
const cartEmpty = $("#cartEmpty");
const cartFoot = $("#cartFoot");
const cartTotal = $("#cartTotal");
const cartClose = $("#cartClose");

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderCart() {
  const count = cart.reduce((s, it) => s + it.qty, 0);
  cartCount.textContent = count;
  cartHeadCount.textContent = count ? `(${count} item${count > 1 ? "s" : ""})` : "";
  cartCount.classList.remove("bump");
  void cartCount.offsetWidth;
  if (count) cartCount.classList.add("bump");

  const isEmpty = cart.length === 0;
  cartEmpty.style.display = isEmpty ? "flex" : "none";
  cartFoot.classList.toggle("visible", !isEmpty);
  cartItems.innerHTML = "";

  cart.forEach((item) => {
    const line = document.createElement("div");
    line.className = "cart-line";
    line.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-line-info">
        <span class="cart-line-name">${item.name}</span>
        <span class="cart-line-price">${formatKES(item.price)} each</span>
        <div class="cart-line-controls">
          <button class="qty-btn minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
          <button class="cart-line-remove" data-id="${item.id}">Remove</button>
        </div>
      </div>
      <span class="cart-line-total">${formatKES(item.price * item.qty)}</span>`;
    cartItems.appendChild(line);
  });

  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
  cartTotal.textContent = formatKES(total);
}

function addToCart(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  const existing = cart.find((it) => it.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, name: product.name, price: product.price, image: product.image, qty: 1 });
  saveCart();
  renderCart();
  showToast(`✔ ${product.name} added to your order`);
}

function changeQty(id, delta) {
  const item = cart.find((it) => it.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((it) => it.id !== id);
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((it) => it.id !== id);
  saveCart();
  renderCart();
  showToast("Item removed from your order");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

function showProductGalleryImage(media, product, index) {
  const imgs = productImages(product);
  if (!imgs.length || !media) return;
  const i = ((index % imgs.length) + imgs.length) % imgs.length;
  const main = media.querySelector(".product-main-img");
  if (main) main.src = imgs[i];
  $$(".product-gal-dot", media).forEach((d, idx) => d.classList.toggle("active", idx === i));
}

productsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  const edit = e.target.closest(".edit-product-quick");
  const del = e.target.closest(".delete-product-quick");
  const addGhost = e.target.closest("#addProductGhostCard");
  const galBtn = e.target.closest(".product-gal-nav");
  const galDot = e.target.closest(".product-gal-dot");
  const media = e.target.closest(".product-media");
  if (galBtn) {
    const product = PRODUCTS.find((p) => String(p.id) === String(galBtn.dataset.id));
    const activeDot = media?.querySelector(".product-gal-dot.active");
    const current = activeDot ? Number(activeDot.dataset.index) : 0;
    const next = current + Number(galBtn.dataset.step || 1);
    showProductGalleryImage(media, product, next);
  }
  if (galDot) showProductGalleryImage(media, PRODUCTS.find((p) => String(p.id) === String(galDot.dataset.id)), Number(galDot.dataset.index));
  if (btn) addToCart(btn.dataset.id);
  if (edit) openProductDialog(PRODUCTS.find((p) => String(p.id) === String(edit.dataset.id)));
  if (del) deleteProductQuick(del.dataset.id);
  if (addGhost) openProductDialog();
});
productsGrid.addEventListener("change", (e) => {
  const sel = e.target.closest(".quick-category-select");
  if (sel) moveProductToCategory(sel.dataset.id, sel.value);
});

cartItems.addEventListener("click", (e) => {
  const plus = e.target.closest(".plus");
  const minus = e.target.closest(".minus");
  const remove = e.target.closest(".cart-line-remove");
  if (plus) changeQty(plus.dataset.id, 1);
  if (minus) changeQty(minus.dataset.id, -1);
  if (remove) removeItem(remove.dataset.id);
});

cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
$("#cartEmptyBrowse").addEventListener("click", () => {
  closeCart();
  $("#products").scrollIntoView({ behavior: "smooth" });
});
$("#clearCartBtn").addEventListener("click", () => {
  if (!cart.length) return;
  cart = [];
  saveCart();
  renderCart();
  showToast("Cart cleared");
});

/* ---------- WhatsApp checkout ---------- */
$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return;
  const lines = cart.map(
    (it) => `• ${it.name} × ${it.qty} — ${formatKES(it.price * it.qty)}`
  );
  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const msg =
    `Hello ${SHOP_NAME}! 🏠\n\n` +
    `I'd like to place this order:\n${lines.join("\n")}\n\n` +
    `*TOTAL: ${formatKES(total)}*\n\n` +
    `Name: \nDelivery/Pickup: \n\nThank you!`;
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank",
    "noopener"
  );
});

/* ---------- Hero slideshow ---------- */
const heroSlides = $$(".hero-slide");
const sliderDots = $("#sliderDots");
let slideIdx = 0;
let slideTimer = null;

if (heroSlides.length > 1 && sliderDots) {
  heroSlides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Show photo ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i, true));
    sliderDots.appendChild(dot);
  });

  const dots = $$(".slider-dot", sliderDots);

  function goToSlide(i, manual = false) {
    slideIdx = (i + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((s, idx) => s.classList.toggle("active", idx === slideIdx));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === slideIdx));
    if (manual) restartTimer();
  }

  function restartTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(slideIdx + 1), 4500);
  }

  $("#slidePrev").addEventListener("click", () => goToSlide(slideIdx - 1, true));
  $("#slideNext").addEventListener("click", () => goToSlide(slideIdx + 1, true));

  const slideshowBox = $("#heroSlideshow");
  slideshowBox.addEventListener("mouseenter", () => clearInterval(slideTimer));
  slideshowBox.addEventListener("mouseleave", restartTimer);

  restartTimer();
}

/* ---------- Navbar ---------- */
const navbar = $("#navbar");
const hamburger = $("#hamburger");
const navLinks = $("#navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

$$(".nav-link", navLinks).forEach((link) =>
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  })
);

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
  $("#backTop").classList.toggle("show", window.scrollY > 500);
  highlightNav();
});

/* ---------- Active nav link on scroll ---------- */
const sections = ["home", "products", "about", "why", "visit"].map((id) => $("#" + id));
function highlightNav() {
  const pos = window.scrollY + 140;
  let current = "home";
  sections.forEach((sec) => {
    if (sec && sec.offsetTop <= pos) current = sec.id;
  });
  $$(".nav-link").forEach((l) =>
    l.classList.toggle("active", l.getAttribute("href") === "#" + current)
  );
}

/* ---------- Back to top ---------- */
$("#backTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- Scroll reveal ---------- */
const revealEls = $$(
  ".about-inner, .section-head, .why-card, .testi-card, .visit-card, .map-wrap, .feature, .cta-inner"
);
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

/* ---------- Local catalogue + admin ---------- */
function newId() {
  return (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function persistCatalogue() {
  try {
    localStorage.setItem(CATALOGUE_KEY, JSON.stringify({ categories: CATEGORIES, products: PRODUCTS }));
  } catch (err) {
    throw new Error("Could not save the catalogue on this device. Try fewer or smaller photos.");
  }
}
function mapSavedProduct(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    categoryLabel: p.categoryLabel || categoryLabel(p.category),
    price: Number(p.price) || 0,
    image: p.image || (p.images && p.images[0]) || "",
    images: p.images && p.images.length ? p.images : (p.image ? [p.image] : []),
    tag: p.tag || null,
    desc: p.desc || "",
    sort_order: p.sort_order || 0,
  };
}
async function loadCatalogue() {
  try {
    const saved = JSON.parse(localStorage.getItem(CATALOGUE_KEY) || "null");
    if (saved?.categories?.length) CATEGORIES = saved.categories;
    if (saved?.products?.length) PRODUCTS = saved.products.map(mapSavedProduct);
  } catch { /* keep bundled defaults */ }
  renderFilterBar();
  renderProducts($(".filter-btn.active")?.dataset.filter || "all");
  if ($("#manageDialog").open) renderManageList();
}

function renderFilterBar() {
  const activeSlug = $(".filter-btn.active")?.dataset.filter || "all";
  filterBar.innerHTML =
    `<button class="filter-btn ${activeSlug === "all" ? "active" : ""}" data-filter="all">All Items</button>` +
    CATEGORIES.map(
      (c) => `
      <span class="filter-chip-wrap">
        <button class="filter-btn ${activeSlug === c.slug ? "active" : ""}" data-filter="${escapeHtml(c.slug)}">${categoryChipIcon(c)}${escapeHtml(c.name)}</button>
        ${isAdmin ? `<button class="filter-chip-edit" type="button" data-id="${c.id}" aria-label="Edit ${escapeHtml(c.name)}" title="Edit category">✎</button>` : ""}
      </span>`
    ).join("") +
    (isAdmin ? `<button class="filter-btn filter-btn-add" type="button" id="addCategoryChipBtn">+ Category</button>` : "");
}

/* ---------- Admin mode toggle ---------- */
function applyAdminUI() {
  document.body.classList.toggle("is-admin", isAdmin);
  $("#adminToolbar").hidden = !isAdmin;
  renderFilterBar();
  renderProducts($(".filter-btn.active")?.dataset.filter || "all");
}

async function refreshAdmin() {
  persistCatalogue();
  await loadCatalogue();
}

function checkAdminSession() {
  isAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  applyAdminUI();
}

/* ---------- Image uploads (stored with the local catalogue until a database is connected) ---------- */
async function uploadImage(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read that photo"));
    reader.readAsDataURL(file);
  });
}
async function deleteUploadedImage() { /* local catalogue — nothing to delete remotely */ }

/* ---------- Category dialog ---------- */
let categoryReturnToProduct = false;
let categoryReturnToBulk = false;
let pendingCategoryImageFile = null;
function setCategoryImagePreview(url) {
  const img = $("#categoryImagePreview");
  const empty = $("#categoryImageEmpty");
  const removeBtn = $("#removeCategoryImageBtn");
  if (url) { img.src = url; img.hidden = false; empty.hidden = true; removeBtn.hidden = false; }
  else { img.hidden = true; img.removeAttribute("src"); empty.hidden = false; removeBtn.hidden = true; }
}
function openCategoryDialog(cat = null) {
  $("#categoryForm").reset();
  $("#categoryError").textContent = "";
  pendingCategoryImageFile = null;
  if (cat) {
    $("#categoryId").value = cat.id;
    $("#categoryExistingImage").value = cat.image_url || "";
    $("#categoryName").value = cat.name;
    $("#categoryFormTitle").textContent = "Edit category";
    $("#deleteCategoryBtn").hidden = false;
    setCategoryImagePreview(cat.image_url || "");
  } else {
    $("#categoryId").value = "";
    $("#categoryExistingImage").value = "";
    $("#categoryFormTitle").textContent = "Add category";
    $("#deleteCategoryBtn").hidden = true;
    setCategoryImagePreview("");
  }
  $("#categoryDialog").showModal();
}
$("#categoryDialogClose").addEventListener("click", () => { categoryReturnToProduct = false; categoryReturnToBulk = false; $("#categoryDialog").close(); });
$("#categoryImageFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  pendingCategoryImageFile = file;
  const reader = new FileReader();
  reader.onload = () => setCategoryImagePreview(reader.result);
  reader.readAsDataURL(file);
});
$("#removeCategoryImageBtn").addEventListener("click", () => {
  $("#categoryExistingImage").value = "";
  pendingCategoryImageFile = null;
  $("#categoryImageFile").value = "";
  setCategoryImagePreview("");
});
async function saveCategoryRow(id, baseSlug, rest) {
  let slug = baseSlug;
  let attempt = 0;
  while (CATEGORIES.some((c) => c.slug === slug && String(c.id) !== String(id || ""))) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
    if (attempt >= 8) break;
  }
  if (id) {
    const i = CATEGORIES.findIndex((c) => String(c.id) === String(id));
    if (i === -1) return { error: { message: "Category not found" } };
    const previousSlug = CATEGORIES[i].slug;
    CATEGORIES[i] = { ...CATEGORIES[i], ...rest, slug };
    if (previousSlug !== slug) {
      PRODUCTS.forEach((p) => {
        if (p.category === previousSlug) {
          p.category = slug;
          p.categoryLabel = CATEGORIES[i].name;
        }
      });
    } else {
      PRODUCTS.forEach((p) => {
        if (p.category === slug) p.categoryLabel = CATEGORIES[i].name;
      });
    }
    persistCatalogue();
    return { data: CATEGORIES[i], error: null };
  }
  const cat = {
    id: newId(),
    slug,
    name: rest.name,
    emoji: rest.emoji || "",
    image_url: rest.image_url || "",
    sort_order: CATEGORIES.length + 1,
  };
  CATEGORIES.push(cat);
  persistCatalogue();
  return { data: cat, error: null };
}
$("#categoryForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin) return;
  const saveBtn = event.submitter || $("#categoryForm button[type=submit]");
  const originalLabel = saveBtn.textContent;
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";
  try {
    const id = $("#categoryId").value;
    const oldImage = $("#categoryExistingImage").value;
    let imageUrl = oldImage;
    if (pendingCategoryImageFile) imageUrl = await uploadImage(pendingCategoryImageFile);
    const name = $("#categoryName").value.trim();
    const result = await saveCategoryRow(id || null, slugify(name), { name, image_url: imageUrl || "" });
    if (result.error) throw result.error;
    $("#categoryDialog").close();
    await refreshAdmin();
    if (categoryReturnToProduct && $("#productDialog").open) {
      populateProductCategorySelect();
      $("#productCategory").value = result.data.slug;
    }
    if (categoryReturnToBulk && $("#bulkUploadDialog").open) {
      populateCategorySelect($("#bulkCategory"), result.data.slug);
    }
    showToast("Category saved");
  } catch (err) {
    $("#categoryError").textContent = err.message || "Something went wrong";
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = originalLabel;
    categoryReturnToProduct = false;
    categoryReturnToBulk = false;
  }
});
function deleteCategoryById(id) {
  const cat = CATEGORIES.find((c) => String(c.id) === String(id));
  if (!cat) return { error: { message: "Category not found" } };
  if (PRODUCTS.some((p) => p.category === cat.slug)) {
    return { error: { message: "Move or delete the products in this category first." } };
  }
  CATEGORIES = CATEGORIES.filter((c) => String(c.id) !== String(id));
  persistCatalogue();
  return { error: null };
}
async function deleteCategoryQuick(id) {
  const cat = CATEGORIES.find((c) => String(c.id) === String(id));
  if (!confirm(`Delete category "${cat?.name || ""}"? It must have no products left in it.`)) return;
  const r = deleteCategoryById(id);
  if (r.error) return showToast(r.error.message);
  await refreshAdmin();
  showToast("Category deleted");
}
$("#deleteCategoryBtn").addEventListener("click", async () => {
  const id = $("#categoryId").value;
  if (!id) return;
  const cat = CATEGORIES.find((c) => String(c.id) === String(id));
  if (!confirm(`Delete category "${cat?.name || ""}"? It must have no products left in it.`)) return;
  const r = deleteCategoryById(id);
  if (r.error) return ($("#categoryError").textContent = r.error.message);
  $("#categoryDialog").close();
  await refreshAdmin();
  showToast("Category deleted");
});

/* ---------- Product dialog ---------- */
let productPhotos = []; // ordered list of { url, file } — url is a preview (existing URL or data: preview), file is set for new/unsaved uploads
function populateCategorySelect(selectEl, current) {
  selectEl.innerHTML = CATEGORIES.map((c) => `<option value="${escapeHtml(c.slug)}">${escapeHtml(c.name)}</option>`).join("");
  if (current && CATEGORIES.some((c) => c.slug === current)) selectEl.value = current;
}
function populateProductCategorySelect() {
  populateCategorySelect($("#productCategory"), $("#productCategory").value);
}
function nextSortOrder() {
  return Math.max(0, ...PRODUCTS.map((p) => Number(p.sort_order) || 0)) + 1;
}
function productFromPayload(payload, existing) {
  return {
    id: existing?.id || newId(),
    name: payload.name,
    category: payload.category,
    categoryLabel: payload.categoryLabel,
    price: Number(payload.price) || 0,
    image: payload.image_url || "",
    images: payload.images || [],
    tag: payload.tag || null,
    desc: payload.description || "",
    sort_order: existing?.sort_order ?? payload.sort_order ?? nextSortOrder(),
  };
}
function saveProductRow(id, payload) {
  if (id) {
    const i = PRODUCTS.findIndex((p) => String(p.id) === String(id));
    if (i === -1) return { error: { message: "Product not found" } };
    PRODUCTS[i] = productFromPayload(payload, PRODUCTS[i]);
    persistCatalogue();
    return { data: PRODUCTS[i], error: null };
  }
  const created = productFromPayload(payload, null);
  PRODUCTS.push(created);
  persistCatalogue();
  return { data: created, error: null };
}
function deleteProductById(id) {
  const before = PRODUCTS.length;
  PRODUCTS = PRODUCTS.filter((p) => String(p.id) !== String(id));
  if (PRODUCTS.length === before) return { error: { message: "Product not found" } };
  persistCatalogue();
  return { error: null };
}
function renderProductPhotoGallery() {
  const gallery = $("#productPhotoGallery");
  const empty = $("#productImageEmpty");
  empty.hidden = productPhotos.length > 0;
  gallery.innerHTML = productPhotos
    .map(
      (p, i) => `
    <div class="photo-thumb${i === 0 ? " is-cover" : ""}" data-index="${i}">
      <img src="${p.url}" alt="Product photo ${i + 1}" />
      ${i === 0 ? `<span class="photo-thumb-cover-tag">Cover</span>` : ""}
      <button type="button" class="photo-thumb-remove" data-index="${i}" aria-label="Remove photo ${i + 1}" title="Remove">&times;</button>
    </div>`
    )
    .join("");
}
$("#productPhotoGallery").addEventListener("click", async (e) => {
  const removeBtn = e.target.closest(".photo-thumb-remove");
  const thumb = e.target.closest(".photo-thumb");
  if (removeBtn) {
    const i = Number(removeBtn.dataset.index);
    productPhotos.splice(i, 1);
    renderProductPhotoGallery();
    return;
  }
  if (thumb) {
    const i = Number(thumb.dataset.index);
    if (i > 0) {
      const [chosen] = productPhotos.splice(i, 1);
      productPhotos.unshift(chosen);
      renderProductPhotoGallery();
    }
  }
});
function openProductDialog(product = null) {
  $("#productForm").reset();
  $("#productError").textContent = "";
  populateProductCategorySelect();
  if (product) {
    productPhotos = productImages(product).map((url) => ({ url, file: null }));
    $("#productId").value = product.id;
    $("#productExistingImage").value = product.image || "";
    $("#productName").value = product.name;
    $("#productCategory").value = product.category;
    $("#productPrice").value = product.price;
    $("#productTag").value = product.tag || "";
    $("#productDescription").value = product.desc || "";
    $("#productFormTitle").textContent = "Edit product";
    $("#deleteProductBtn").hidden = false;
  } else {
    productPhotos = [];
    $("#productId").value = "";
    $("#productExistingImage").value = "";
    $("#productFormTitle").textContent = "Add product";
    $("#deleteProductBtn").hidden = true;
    const activeSlug = $(".filter-btn.active")?.dataset.filter;
    if (activeSlug && activeSlug !== "all") $("#productCategory").value = activeSlug;
  }
  renderProductPhotoGallery();
  $("#productDialog").showModal();
}
$("#productDialogClose").addEventListener("click", () => $("#productDialog").close());
$("#productCategoryAddBtn").addEventListener("click", () => {
  categoryReturnToProduct = true;
  openCategoryDialog();
});
$("#productCategoryEditBtn").addEventListener("click", () => {
  const cat = CATEGORIES.find((c) => c.slug === $("#productCategory").value);
  if (!cat) return showToast("Pick a category first");
  categoryReturnToProduct = true;
  openCategoryDialog(cat);
});
$("#productImageFile").addEventListener("change", (e) => {
  const files = [...e.target.files];
  if (!files.length) return;
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      productPhotos.push({ url: reader.result, file });
      renderProductPhotoGallery();
    };
    reader.readAsDataURL(file);
  });
  e.target.value = "";
});
$("#productForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin) return;
  const saveBtn = $("#productSaveBtn");
  saveBtn.disabled = true;
  const originalLabel = saveBtn.textContent;
  saveBtn.textContent = "Saving…";
  try {
    const id = $("#productId").value;
    const category = CATEGORIES.find((c) => c.slug === $("#productCategory").value);
    if (!category) throw new Error("Please pick a category");
    const images = [];
    for (const p of productPhotos) images.push(p.file ? await uploadImage(p.file) : p.url);
    const payload = {
      name: $("#productName").value.trim(),
      category: category.slug,
      categoryLabel: category.name,
      price: Number($("#productPrice").value),
      image_url: images[0] || "",
      images,
      tag: $("#productTag").value.trim() || null,
      description: $("#productDescription").value.trim(),
    };
    const result = saveProductRow(id || null, payload);
    if (result.error) throw result.error;
    $("#productDialog").close();
    await refreshAdmin();
    showToast("Product saved");
  } catch (err) {
    $("#productError").textContent = err.message || "Something went wrong";
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = originalLabel;
  }
});
async function deleteProductQuick(id) {
  const product = PRODUCTS.find((p) => String(p.id) === String(id));
  if (!confirm(`Delete "${product?.name || "this product"}"? This cannot be undone.`)) return;
  const r = deleteProductById(id);
  if (r.error) return showToast(r.error.message);
  await refreshAdmin();
  showToast("Product deleted");
}
$("#deleteProductBtn").addEventListener("click", async () => {
  const id = $("#productId").value;
  if (!id) return;
  const product = PRODUCTS.find((p) => String(p.id) === String(id));
  if (!confirm(`Delete "${product?.name || "this product"}"? This cannot be undone.`)) return;
  const r = deleteProductById(id);
  if (r.error) return ($("#productError").textContent = r.error.message);
  $("#productDialog").close();
  await refreshAdmin();
  showToast("Product deleted");
});
async function moveProductToCategory(productId, newSlug) {
  const category = CATEGORIES.find((c) => c.slug === newSlug);
  if (!category) return;
  const product = PRODUCTS.find((p) => String(p.id) === String(productId));
  if (!product) return;
  product.category = category.slug;
  product.categoryLabel = category.name;
  persistCatalogue();
  await refreshAdmin();
  showToast("Product moved");
}

/* ---------- Bulk product upload ---------- */
let bulkFiles = []; // { file, url (objectURL preview), name (suggested from file name) }

function nameFromFileName(file) {
  const pretty = (file.name || "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_\-.\u2013\u2014]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
  return pretty || "New product";
}

function renderBulkPreviews() {
  $("#bulkPreviewGrid").innerHTML = bulkFiles
    .map(
      (f, i) => `
    <figure class="bulk-thumb">
      <img src="${f.url}" alt="${escapeHtml(f.name)}" />
      <figcaption>${escapeHtml(f.name)}</figcaption>
      <button type="button" class="bulk-thumb-remove" data-index="${i}" aria-label="Remove ${escapeHtml(f.name)}" title="Remove">&times;</button>
    </figure>`
    )
    .join("");
  $("#bulkImageEmpty").hidden = bulkFiles.length > 0;
  const combine = $("#bulkCombinePhotos")?.checked;
  $("#bulkCountHint").textContent = bulkFiles.length
    ? combine
      ? `${bulkFiles.length} photo${bulkFiles.length === 1 ? "" : "s"} — saved as ONE product with these photos. Edit the name and details later.`
      : `${bulkFiles.length} photo${bulkFiles.length === 1 ? "" : "s"} — one product each, named after the file. You can rename and add details later, or use Manage all → Merge selected to combine colours/types into one product.`
    : "";
}

function resetBulkFiles() {
  bulkFiles.forEach((f) => URL.revokeObjectURL(f.url));
  bulkFiles = [];
}

function openBulkUploadDialog() {
  resetBulkFiles();
  $("#bulkCombinePhotos").checked = false;
  renderBulkPreviews();
  $("#bulkUploadError").textContent = "";
  const submitBtn = $("#bulkUploadSubmit");
  submitBtn.disabled = false;
  submitBtn.textContent = "Add products";
  const activeSlug = $(".filter-btn.active")?.dataset.filter;
  populateCategorySelect($("#bulkCategory"), activeSlug !== "all" ? activeSlug : $("#bulkCategory").value);
  $("#bulkUploadDialog").showModal();
}

function addBulkFiles(fileList) {
  const files = [...fileList].filter((f) => (f.type || "").startsWith("image/"));
  if (!files.length) return;
  files.forEach((file) => bulkFiles.push({ file, url: URL.createObjectURL(file), name: nameFromFileName(file) }));
  renderBulkPreviews();
}

async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await worker(items[i], i);
      }
    })
  );
  return results;
}

$("#bulkAddBtn").addEventListener("click", () => openBulkUploadDialog());
$("#manageBulkAddBtn").addEventListener("click", () => { $("#manageDialog").close(); openBulkUploadDialog(); });
$("#bulkUploadClose").addEventListener("click", () => { resetBulkFiles(); renderBulkPreviews(); $("#bulkUploadDialog").close(); });
$("#bulkCancelBtn").addEventListener("click", () => { resetBulkFiles(); renderBulkPreviews(); $("#bulkUploadDialog").close(); });
$("#bulkCategoryAddBtn").addEventListener("click", () => {
  categoryReturnToBulk = true;
  openCategoryDialog();
});
$("#bulkImageFile").addEventListener("change", (e) => {
  addBulkFiles(e.target.files);
  e.target.value = "";
});
$("#bulkCombinePhotos").addEventListener("change", () => renderBulkPreviews());
$("#bulkPreviewGrid").addEventListener("click", (e) => {
  const btn = e.target.closest(".bulk-thumb-remove");
  if (!btn) return;
  const i = Number(btn.dataset.index);
  const [removed] = bulkFiles.splice(i, 1);
  if (removed) URL.revokeObjectURL(removed.url);
  renderBulkPreviews();
});
// Drag & drop support for "select all images"
const bulkDropZone = $("#bulkDropZone");
["dragenter", "dragover"].forEach((ev) =>
  bulkDropZone.addEventListener(ev, (e) => { e.preventDefault(); bulkDropZone.classList.add("dragover"); })
);
["dragleave", "drop"].forEach((ev) =>
  bulkDropZone.addEventListener(ev, (e) => { e.preventDefault(); bulkDropZone.classList.remove("dragover"); })
);
bulkDropZone.addEventListener("drop", (e) => {
  if (e.dataTransfer?.files?.length) addBulkFiles(e.dataTransfer.files);
});

$("#bulkUploadForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin) return;
  const errorEl = $("#bulkUploadError");
  const submitBtn = $("#bulkUploadSubmit");
  errorEl.textContent = "";
  const category = CATEGORIES.find((c) => c.slug === $("#bulkCategory").value);
  if (!category) return (errorEl.textContent = "Please pick a category");
  if (!bulkFiles.length) return (errorEl.textContent = "Choose at least one product photo");
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  const urls = new Array(bulkFiles.length);
  try {
    submitBtn.textContent = `Uploading 0/${bulkFiles.length}…`;
    await runWithConcurrency(bulkFiles, 4, async (f, i) => {
      urls[i] = await uploadImage(f.file);
      submitBtn.textContent = `Uploading ${urls.filter(Boolean).length}/${bulkFiles.length}…`;
    });
    submitBtn.textContent = "Saving…";
    const combinePhotos = $("#bulkCombinePhotos").checked;
    const uploadedCount = urls.length;
    const base = nextSortOrder();
    if (combinePhotos) {
      saveProductRow(null, {
        name: nameFromFileName(bulkFiles[0].file),
        category: category.slug,
        categoryLabel: category.name,
        price: 0,
        image_url: urls[0],
        images: urls,
        tag: null,
        description: "",
        sort_order: base,
      });
    } else {
      bulkFiles.forEach((f, i) => {
        saveProductRow(null, {
          name: f.name,
          category: category.slug,
          categoryLabel: category.name,
          price: 0,
          image_url: urls[i],
          images: [urls[i]],
          tag: null,
          description: "",
          sort_order: base + i,
        });
      });
    }
    resetBulkFiles();
    renderBulkPreviews();
    $("#bulkUploadDialog").close();
    await refreshAdmin();
    showToast(
      combinePhotos
        ? `${uploadedCount} photo${uploadedCount === 1 ? "" : "s"} saved as ONE product in ${category.name} — edit the name/details later`
        : `${uploadedCount} product${uploadedCount === 1 ? "" : "s"} added to ${category.name} — edit details later, one by one`
    );
  } catch (err) {
    errorEl.textContent = err.message || "Something went wrong";
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});

/* ---------- Bulk product delete ---------- */
const selectedProductIds = new Set();

function updateManageBulkUI() {
  const liveIds = new Set(PRODUCTS.map((p) => p.id));
  for (const id of [...selectedProductIds]) if (!liveIds.has(id)) selectedProductIds.delete(id);
  const total = PRODUCTS.length;
  const sel = selectedProductIds.size;
  const selectAll = $("#manageSelectAll");
  if (selectAll) {
    selectAll.checked = total > 0 && sel === total;
    selectAll.indeterminate = sel > 0 && sel < total;
  }
  const countEl = $("#manageSelectedCount");
  if (countEl) countEl.textContent = sel ? `${sel} selected` : "";
  const btn = $("#manageDeleteSelectedBtn");
  if (btn) {
    btn.disabled = sel === 0;
    btn.textContent = sel ? `🗑 Delete selected (${sel})` : "🗑 Delete selected";
  }
  const mergeBtn = $("#manageMergeSelectedBtn");
  if (mergeBtn) {
    mergeBtn.disabled = sel < 2;
    mergeBtn.textContent = sel >= 2 ? `⧉ Merge selected (${sel})` : "⧉ Merge selected";
  }
}

async function deleteSelectedProducts() {
  const toDelete = PRODUCTS.filter((p) => selectedProductIds.has(p.id));
  if (!toDelete.length) return;
  const names = toDelete.map((p) => `"${p.name}"`);
  const preview = names.length > 4 ? names.slice(0, 4).join(", ") + ` and ${names.length - 4} more` : names.join(", ");
  if (!confirm(`Delete ${toDelete.length} product${toDelete.length === 1 ? "" : "s"} (${preview})? This cannot be undone.`)) return;
  const btn = $("#manageDeleteSelectedBtn");
  btn.disabled = true;
  try {
    const ids = toDelete.map((p) => p.id);
    const idSet = new Set(ids.map(String));
    PRODUCTS = PRODUCTS.filter((p) => !idSet.has(String(p.id)));
    persistCatalogue();
    selectedProductIds.clear();
    await refreshAdmin();
    updateManageBulkUI();
    showToast(`${ids.length} product${ids.length === 1 ? "" : "s"} deleted`);
  } catch (err) {
    showToast(err.message || "Something went wrong");
    updateManageBulkUI();
  }
}
$("#manageDeleteSelectedBtn").addEventListener("click", deleteSelectedProducts);
$("#manageSelectAll").addEventListener("change", (e) => {
  if (e.target.checked) PRODUCTS.forEach((p) => selectedProductIds.add(p.id));
  else PRODUCTS.forEach((p) => selectedProductIds.delete(p.id));
  $$("#manageList .manage-product-check").forEach((c) => (c.checked = e.target.checked));
  updateManageBulkUI();
});

/* ---------- Merge selected products ---------- */
let mergePhotos = []; // ordered { url, sourceName } — photos gathered from the selected products

function renderMergePhotoGallery() {
  const gallery = $("#mergePhotoGallery");
  const empty = $("#mergeImageEmpty");
  empty.hidden = mergePhotos.length > 0;
  gallery.innerHTML = mergePhotos
    .map(
      (photo, i) => `
    <figure class="photo-card-lg${i === 0 ? " is-cover" : ""}" data-index="${i}" title="${escapeHtml(photo.sourceName)} — click to make this the cover photo">
      <div class="photo-thumb">
        <img src="${photo.url}" alt="${escapeHtml(photo.sourceName)} photo ${i + 1}" />
        ${i === 0 ? `<span class="photo-thumb-cover-tag">Cover</span>` : ""}
        <button type="button" class="photo-thumb-remove" data-index="${i}" aria-label="Remove photo ${i + 1}" title="Remove">&times;</button>
      </div>
      <figcaption class="photo-card-lg-name">${escapeHtml(photo.sourceName)}</figcaption>
    </figure>`
    )
    .join("");
}

function openMergeDialog() {
  const selected = PRODUCTS.filter((p) => selectedProductIds.has(p.id));
  if (selected.length < 2) return showToast("Select at least two products to merge");
  const base = selected[0];
  const seen = new Set();
  mergePhotos = [];
  selected.forEach((product) => {
    productImages(product).forEach((url) => {
      if (!url || seen.has(url)) return;
      seen.add(url);
      mergePhotos.push({ url, sourceName: product.name });
    });
  });
  $("#mergeSourceIds").value = JSON.stringify(selected.map((p) => p.id));
  $("#mergeName").value = base.name || "";
  populateCategorySelect($("#mergeCategory"), base.category);
  $("#mergePrice").value = base.price ?? 0;
  $("#mergeTag").value = base.tag || "";
  $("#mergeDescription").value = base.desc || "";
  $("#mergeError").textContent = "";
  renderMergePhotoGallery();
  const submitBtn = $("#mergeSubmitBtn");
  submitBtn.disabled = false;
  submitBtn.textContent = `Merge ${selected.length} products`;
  if (!$("#mergeDialog").open) $("#mergeDialog").showModal();
}

$("#manageMergeSelectedBtn").addEventListener("click", openMergeDialog);
$("#mergeDialogClose").addEventListener("click", () => $("#mergeDialog").close());
$("#mergeCancelBtn").addEventListener("click", () => $("#mergeDialog").close());
$("#mergePhotoGallery").addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".photo-thumb-remove");
  const thumb = e.target.closest(".photo-card-lg");
  if (removeBtn) {
    mergePhotos.splice(Number(removeBtn.dataset.index), 1);
    renderMergePhotoGallery();
    return;
  }
  if (thumb) {
    const i = Number(thumb.dataset.index);
    if (i > 0) {
      const [chosen] = mergePhotos.splice(i, 1);
      mergePhotos.unshift(chosen);
      renderMergePhotoGallery();
    }
  }
});
$("#mergeForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin) return;
  const errorEl = $("#mergeError");
  const submitBtn = $("#mergeSubmitBtn");
  errorEl.textContent = "";
  const sourceIds = JSON.parse($("#mergeSourceIds").value || "[]");
  const sourceProducts = PRODUCTS.filter((p) => sourceIds.includes(p.id));
  const category = CATEGORIES.find((c) => c.slug === $("#mergeCategory").value);
  if (!category) return (errorEl.textContent = "Please pick a category");
  if (sourceProducts.length < 2) return (errorEl.textContent = "Select at least two products to merge");
  if (!mergePhotos.length) return (errorEl.textContent = "There are no photos to keep on the merged product");
  const original = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Merging…";
  const minOrder = sourceProducts.reduce((min, p) => Math.min(min, Number(p.sort_order) || Infinity), Infinity);
  try {
    const payload = {
      name: $("#mergeName").value.trim(),
      category: category.slug,
      categoryLabel: category.name,
      price: Number($("#mergePrice").value),
      image_url: mergePhotos[0].url,
      images: mergePhotos.map((photo) => photo.url),
      tag: $("#mergeTag").value.trim() || null,
      description: $("#mergeDescription").value.trim(),
      sort_order: isFinite(minOrder) ? minOrder : nextSortOrder(),
    };
    const inserted = saveProductRow(null, payload);
    if (inserted.error) throw inserted.error;
    const ids = new Set(sourceProducts.map((p) => String(p.id)));
    PRODUCTS = PRODUCTS.filter((p) => !ids.has(String(p.id)));
    persistCatalogue();
    selectedProductIds.clear();
    $("#mergeDialog").close();
    await refreshAdmin();
    if ($("#manageDialog").open) {
      renderManageList();
      updateManageBulkUI();
    }
    showToast(`${sourceProducts.length} products merged into one product with ${mergePhotos.length} photo${mergePhotos.length === 1 ? "" : "s"}`);
  } catch (err) {
    errorEl.textContent = err.message || "Something went wrong";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = original;
  }
});

/* ---------- Manage-all catalogue overview ---------- */
function renderManageList() {
  $("#manageList").innerHTML = CATEGORIES.map((c) => {
    const items = PRODUCTS.filter((p) => p.category === c.slug);
    return `
    <details class="manage-cat-group" open>
      <summary>
        <span>${c.image_url ? `<img class="manage-cat-thumb" src="${escapeHtml(c.image_url)}" alt="" />` : escapeHtml(c.emoji || "") + " "}<strong>${escapeHtml(c.name)}</strong><small>${items.length} product${items.length === 1 ? "" : "s"}</small></span>
        <span class="manage-cat-actions">
          <button class="btn-text manage-edit-category" type="button" data-id="${c.id}">Edit</button>
          <button class="btn-text manage-delete-category" type="button" data-id="${c.id}">Delete</button>
        </span>
      </summary>
      <div class="manage-products">
        ${
          items.length
            ? items
                .map(
                  (p) => `
          <div class="manage-product-row" data-id="${p.id}">
            <label class="manage-product-check-wrap"><input type="checkbox" class="manage-product-check" data-id="${p.id}" ${selectedProductIds.has(p.id) ? "checked" : ""} aria-label="Select ${escapeHtml(p.name)}" /></label>
            <img src="${escapeHtml(p.image || "")}" alt="" />
            <div class="manage-product-info"><strong>${escapeHtml(p.name)}</strong><small>${formatKES(p.price)}${productImages(p).length > 1 ? ` · ${productImages(p).length} photos` : ""}</small></div>
            <select class="manage-category-select" data-id="${p.id}">
              ${CATEGORIES.map((cc) => `<option value="${escapeHtml(cc.slug)}" ${cc.slug === p.category ? "selected" : ""}>${escapeHtml(cc.name)}</option>`).join("")}
            </select>
            <button class="btn-text manage-edit-product" type="button" data-id="${p.id}">Edit</button>
            <button class="btn-text manage-delete-product" type="button" data-id="${p.id}">Delete</button>
          </div>`
                )
                .join("")
            : `<p class="admin-help">No products in this category yet.</p>`
        }
      </div>
    </details>`;
  }).join("");
  updateManageBulkUI();
}
$("#manageDialogClose").addEventListener("click", () => $("#manageDialog").close());
$("#manageCatalogueBtn").addEventListener("click", () => { renderManageList(); $("#manageDialog").showModal(); });
$("#mergeCatalogueBtn").addEventListener("click", () => { renderManageList(); $("#manageDialog").showModal(); setTimeout(() => $("#manageMergeSelectedBtn").scrollIntoView({ behavior: "smooth", block: "center" }), 50); });
$("#manageAddCategoryBtn").addEventListener("click", () => { $("#manageDialog").close(); openCategoryDialog(); });
$("#manageAddProductBtn").addEventListener("click", () => { $("#manageDialog").close(); openProductDialog(); });
$("#manageList").addEventListener("click", (e) => {
  const editCat = e.target.closest(".manage-edit-category");
  const delCat = e.target.closest(".manage-delete-category");
  const editProd = e.target.closest(".manage-edit-product");
  const delProd = e.target.closest(".manage-delete-product");
  if (editCat) { $("#manageDialog").close(); openCategoryDialog(CATEGORIES.find((c) => String(c.id) === String(editCat.dataset.id))); }
  if (delCat) deleteCategoryQuick(delCat.dataset.id);
  if (editProd) { $("#manageDialog").close(); openProductDialog(PRODUCTS.find((p) => String(p.id) === String(editProd.dataset.id))); }
  if (delProd) deleteProductQuick(delProd.dataset.id);
});
$("#manageList").addEventListener("change", (e) => {
  const check = e.target.closest(".manage-product-check");
  if (check) {
    if (check.checked) selectedProductIds.add(check.dataset.id);
    else selectedProductIds.delete(check.dataset.id);
    updateManageBulkUI();
    return;
  }
  const sel = e.target.closest(".manage-category-select");
  if (sel) moveProductToCategory(sel.dataset.id, sel.value);
});

/* ---------- Admin toolbar + login/logout ---------- */
$("#addCategoryBtn").addEventListener("click", () => openCategoryDialog());
$("#addProductBtn").addEventListener("click", () => openProductDialog());
$("#logoutBtn").addEventListener("click", () => {
  isAdmin = false;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  applyAdminUI();
  showToast("Signed out");
});

$("#homeIcon").addEventListener("click", (event) => {
  const now = Date.now();
  const clicks = Number($("#homeIcon").dataset.secretClicks || 0);
  const started = Number($("#homeIcon").dataset.secretStarted || now);
  const next = now - started <= 30000 ? clicks + 1 : 1;
  $("#homeIcon").dataset.secretClicks = next;
  $("#homeIcon").dataset.secretStarted = next === 1 ? now : started;
  if (next >= 5) { event.preventDefault(); $("#adminDialog").showModal(); $("#loginEmail").focus(); $("#homeIcon").dataset.secretClicks = 0; }
});
$("#loginClose").addEventListener("click", () => $("#adminDialog").close());
$("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const submitBtn = event.submitter || $("#loginForm button[type=submit]");
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in…";
  const email = $("#loginEmail").value.trim();
  const password = $("#loginPassword").value;
  if (!email || !password) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
    $("#loginError").textContent = "Enter your email and password";
    return;
  }
  sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  isAdmin = true;
  applyAdminUI();
  $("#loginError").textContent = "";
  $("#adminDialog").close();
  submitBtn.disabled = false;
  submitBtn.textContent = originalLabel;
  showToast("Welcome back — admin mode is on");
  $("#products").scrollIntoView({ behavior: "smooth" });
});

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
renderFilterBar();
renderProducts();
renderCart();
loadCatalogue();
checkAdminSession();
