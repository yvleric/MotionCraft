// ========================================================
// MOTIONCRAFT - INTERACTIVE EDITORIAL SCRIPT
// ========================================================

let locoScroll;

// 1. LOCOMOTIVE SCROLL & SCROLLTRIGGER INTEGRATION
function locomotiveAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
        smartphone: {
            smooth: true
        },
        tablet: {
            smooth: true
        }
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length
                ? locoScroll.scrollTo(value, 0, 0)
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        pinType: document.querySelector("#main").style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    window.addEventListener("load", () => {
        if (locoScroll) locoScroll.update();
        ScrollTrigger.refresh();
    });
}
locomotiveAnimation();

// 2. NAVBAR SCROLL ANIMATION
function navbarAnimation() {
    gsap.to("#nav-part1 svg", {
        transform: "translateY(-100%)",
        scrollTrigger: {
            trigger: "#page1",
            scroller: "#main",
            start: "top 0",
            end: "top -5%",
            scrub: true,
        },
    });

    gsap.to("#nav-part2 #links", {
        transform: "translateY(-100%)",
        opacity: 0,
        scrollTrigger: {
            trigger: "#page1",
            scroller: "#main",
            start: "top 0",
            end: "top -5%",
            scrub: true,
        },
    });
}
navbarAnimation();

// 3. INTRO HERO LOADING ANIMATION
function loadingAnimation() {
    gsap.from("#page1 h1", {
        y: 100,
        opacity: 0,
        delay: 0.3,
        duration: 0.9,
        stagger: 0.25,
        ease: "power3.out"
    });

    gsap.from("#page1 #video-container", {
        scale: 0.92,
        opacity: 0,
        delay: 0.9,
        duration: 0.8,
        ease: "power2.out"
    });
}
loadingAnimation();

// 4. VIDEO CONTAINER & PLAY/PAUSE INTERACTION
function videoAnimation() {
    const videoCon = document.querySelector("#video-container");
    const playBtn = document.querySelector("#play");
    const video = videoCon.querySelector("video");
    const soundToggle = document.querySelector("#video-sound-toggle");

    if (!videoCon || !playBtn || !video) return;

    videoCon.addEventListener("mouseenter", function () {
        gsap.to(playBtn, {
            scale: 1,
            opacity: 1,
            duration: 0.3
        });
    });

    videoCon.addEventListener("mouseleave", function () {
        gsap.to(playBtn, {
            scale: 0,
            opacity: 0,
            duration: 0.3
        });
    });

    document.addEventListener("mousemove", function (dets) {
        gsap.to(playBtn, {
            left: dets.clientX - 55,
            top: dets.clientY - 55,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // Toggle Play/Pause on click
    videoCon.addEventListener("click", function (e) {
        if (e.target.closest("#video-sound-toggle")) return;

        if (video.paused) {
            video.play();
            playBtn.textContent = "PAUSE";
            showToast("Video Playing");
        } else {
            video.pause();
            playBtn.textContent = "PLAY";
            showToast("Video Paused");
        }
    });

    // Sound Toggle
    if (soundToggle) {
        soundToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            video.muted = !video.muted;
            if (video.muted) {
                soundToggle.innerHTML = '<i class="ri-volume-mute-line"></i><span>Unmute</span>';
                showToast("Sound Muted");
            } else {
                soundToggle.innerHTML = '<i class="ri-volume-up-line"></i><span>Mute</span>';
                showToast("Sound Unmuted");
            }
        });
    }
}
videoAnimation();

// 5. CUSTOM CURSOR WITH DYNAMIC LABELS
function cursorAnimation() {
    const cursor = document.querySelector("#cursor");
    const cursorText = document.querySelector("#cursor-text");

    if (!cursor) return;

    window.addEventListener("mousemove", function (e) {
        gsap.to(cursor, {
            left: e.clientX,
            top: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    // Product cards hover
    document.querySelectorAll(".child").forEach(function (elem) {
        elem.addEventListener("mouseenter", function () {
            cursorText.textContent = "EXPLORE";
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: "rgba(229, 156, 186, 0.9)",
                duration: 0.25
            });
        });
        elem.addEventListener("mouseleave", function () {
            cursorText.textContent = "";
            gsap.to(cursor, {
                scale: 0,
                duration: 0.25
            });
        });
    });

    // Page 2 Editorial pillars hover
    document.querySelectorAll("#page2 .elem").forEach(function (elem) {
        elem.addEventListener("mouseenter", function () {
            cursorText.textContent = "STORY";
            gsap.to(cursor, {
                scale: 0.85,
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                duration: 0.25
            });
        });
        elem.addEventListener("mouseleave", function () {
            cursorText.textContent = "";
            gsap.to(cursor, {
                scale: 0,
                duration: 0.25
            });
        });
    });
}
cursorAnimation();

// 6. TOAST NOTIFICATION UTILITY
let toastTimer;
function showToast(message, isSuccess = true) {
    const toast = document.querySelector("#toast");
    const toastMsg = document.querySelector("#toast-message");
    const toastIcon = toast.querySelector(".toast-icon");

    if (!toast || !toastMsg) return;

    clearTimeout(toastTimer);
    toastMsg.textContent = message;
    if (toastIcon) {
        toastIcon.className = isSuccess ? "ri-check-line toast-icon" : "ri-information-line toast-icon";
    }

    toast.classList.add("show");
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

// 7. SMOOTH SCROLLING ANCHOR HANDLERS (LOCOMOTIVE SCROLL AWARE)
function initSmoothAnchors() {
    const anchors = document.querySelectorAll('a[href^="#"], .menu-link, #back-to-top, .footer-link');
    anchors.forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href") || (this.id === "back-to-top" ? "#main" : null);
            if (!href || href === "#") return;

            e.preventDefault();

            // Close any open modals
            closeAllModals();

            const target = document.querySelector(href === "#" ? "#main" : href);
            if (target && locoScroll) {
                locoScroll.scrollTo(target, {
                    offset: 0,
                    duration: 1.2
                });
            } else if (href === "#main" && locoScroll) {
                locoScroll.scrollTo(0, { duration: 1.2 });
            }
        });
    });
}
initSmoothAnchors();

// 8. SEARCH SYSTEM WITH INSTANT FILTERING & LIVE RESULTS
const catalogData = [
    {
        id: "p1",
        title: "MESSINA X TWO GOOD INSIDE SCOOP CRACKER",
        price: 16.00,
        category: "gifts",
        catLabel: "Holiday Edition",
        desc: "Limited edition festive Christmas cracker filled with Messina treats, vouchers and holiday joy.",
        img: "https://cdn.sanity.io/images/w8f1ak3c/production/66d053ffcc85dc1f7883f68c54fb9c8b89cc157c-5000x5000.png/4.png?w=1024&h=1024&auto=format"
    },
    {
        id: "p2",
        title: "SONOMA X TWO GOOD CLASSIC PANETTONE",
        price: 65.00,
        category: "bakery",
        catLabel: "Artisan Bakery",
        desc: "Naturally fermented slow sourdough panettone crafted with Australian wild honey and candied orange.",
        img: "https://cdn.sanity.io/images/w8f1ak3c/production/2148887a131b99321f6b64f1d4ad4fd21d708e62-2880x1920.png/Sonoma-Classic-Panettone-Gifts-For-Good-2026-A7R07656-DexterKim.png?rect=214,247,2370,1673&fp-x=0.48386739921304256&fp-y=0.6311392212079228&w=1024&h=723&fit=crop&crop=focalpoint&auto=format"
    },
    {
        id: "p3",
        title: "GOOD FEELS BAUBLE",
        price: 12.00,
        category: "gifts",
        catLabel: "Holiday Gift",
        desc: "Good Feels decorative ceramic bauble with empowering thank-you card and botanical body treat.",
        img: "https://cdn.sanity.io/images/w8f1ak3c/production/6be73be625095d1b5600317bcb313e563dc775be-5000x5000.png/Good-Feels-Bauble-Gifts-For-Good-2026-A7R07722-DexterKim.png?w=1024&h=1024&auto=format"
    },
    {
        id: "p4",
        title: "MESSINA GINGERBREAD COOKIE PIE",
        price: 42.00,
        category: "bakery",
        catLabel: "Collaboration",
        desc: "Bake-at-home Messina deep dish ginger cookie pie kit with rich molten caramel centre.",
        img: "https://cdn.sanity.io/images/w8f1ak3c/production/16a66201cadb52292ce1a413471fdd8ab3d06804-2880x1920.png/Messina-Gingerbread-Cookie-Pie-Kit-Gifts-For-Good-2026-A7R07686-DexterKim.png?rect=43,0,2747,1920&fp-x=0.49194224267734876&fp-y=0.4547022058823529&w=1024&h=716&fit=crop&crop=focalpoint&auto=format"
    },
    {
        id: "p5",
        title: "Two Good Stories & Recipes Book",
        price: 60.00,
        category: "books",
        catLabel: "Books & Lifestyle",
        desc: "Inspiring collection of heartfelt stories and recipes from top Australian chefs.",
        img: "https://cdn.sanity.io/images/w8f1ak3c/production/ee1c2e8894a4c47c4f4ce71b8973589f8a5045b2-902x1500.png/Rectangle%203.png?rect=1,0,900,1500&w=640&h=1067&fit=min&auto=format"
    },
    {
        id: "p6",
        title: "Heirloom Canvas Chef Apron",
        price: 65.00,
        category: "books",
        catLabel: "Books & Lifestyle",
        desc: "Heavyweight 100% organic cotton apron built for a lifetime in the kitchen.",
        img: "https://cdn.sanity.io/images/w8f1ak3c/production/bb84b7106e978c37f5aa92c8d5781751b2e9d9f2-900x1500.png/Rectangle%202.png?w=640&h=1067&auto=format"
    }
];

function initSearchSystem() {
    const searchModal = document.querySelector("#search-modal");
    const searchBtn = document.querySelector("#search-btn");
    const searchCloseBtn = document.querySelector("#search-close-btn");
    const searchBackdrop = document.querySelector("#search-backdrop");
    const searchInput = document.querySelector("#search-input");
    const searchClear = document.querySelector("#search-clear");
    const resultsGrid = document.querySelector("#search-results-grid");
    const resultsCount = document.querySelector("#results-count");
    const catPills = document.querySelectorAll(".cat-pill");

    let currentCategory = "all";

    function openSearch() {
        closeAllModals();
        searchModal.classList.add("active");
        searchModal.setAttribute("aria-hidden", "false");
        setTimeout(() => searchInput.focus(), 100);
        renderSearchResults(searchInput.value.trim(), currentCategory);
    }

    function closeSearch() {
        searchModal.classList.remove("active");
        searchModal.setAttribute("aria-hidden", "true");
        searchInput.value = "";
        searchClear.style.display = "none";
    }

    if (searchBtn) searchBtn.addEventListener("click", openSearch);
    if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearch);
    if (searchBackdrop) searchBackdrop.addEventListener("click", closeSearch);

    // Keyboard shortcuts: Ctrl + K or '/' opens search, ESC closes
    document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            searchModal.classList.contains("active") ? closeSearch() : openSearch();
        } else if (e.key === "Escape") {
            closeAllModals();
        }
    });

    // Clear input button
    if (searchClear) {
        searchClear.addEventListener("click", () => {
            searchInput.value = "";
            searchClear.style.display = "none";
            renderSearchResults("", currentCategory);
            searchInput.focus();
        });
    }

    // Input live filter
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = this.value.trim();
            searchClear.style.display = query.length > 0 ? "flex" : "none";
            renderSearchResults(query, currentCategory);
        });
    }

    // Category pills filter
    catPills.forEach(pill => {
        pill.addEventListener("click", function () {
            catPills.forEach(p => p.classList.remove("active"));
            this.classList.add("active");
            currentCategory = this.dataset.category;
            renderSearchResults(searchInput.value.trim(), currentCategory);
        });
    });

    function renderSearchResults(query, cat) {
        const queryLower = query.toLowerCase();
        const filtered = catalogData.filter(item => {
            const matchesCat = (cat === "all") || (item.category === cat);
            const matchesQuery = queryLower === "" ||
                item.title.toLowerCase().includes(queryLower) ||
                item.desc.toLowerCase().includes(queryLower) ||
                item.catLabel.toLowerCase().includes(queryLower);
            return matchesCat && matchesQuery;
        });

        resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'} found`;

        if (filtered.length === 0) {
            resultsGrid.innerHTML = `
                <div class="search-empty">
                    <i class="ri-search-2-line" style="font-size: 32px; display: block; margin-bottom: 8px;"></i>
                    <p>No matches for "${query}". Try searching for "cracker", "panettone", or "bauble".</p>
                </div>
            `;
            return;
        }

        resultsGrid.innerHTML = filtered.map(item => `
            <div class="search-item-card">
                <img src="${item.img}" alt="${item.title}" class="search-item-img">
                <div class="search-item-details">
                    <div class="search-item-title">${item.title}</div>
                    <div class="search-item-meta">
                        <span class="search-item-price">$${item.price.toFixed(2)}</span>
                        <span class="search-item-cat">${item.catLabel}</span>
                    </div>
                </div>
                <button class="search-quick-add" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}" data-img="${item.img}">
                    + Add
                </button>
            </div>
        `).join("");

        // Bind quick add buttons
        resultsGrid.querySelectorAll(".search-quick-add").forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                const product = {
                    id: this.dataset.id,
                    title: this.dataset.title,
                    price: parseFloat(this.dataset.price),
                    img: this.dataset.img
                };
                addToCart(product);
            });
        });
    }
}
initSearchSystem();

// 9. SHOPPING BAG / CART DRAWER SYSTEM
let cart = [
    {
        id: "p1",
        title: "MESSINA X TWO GOOD INSIDE SCOOP CRACKER",
        price: 16.00,
        qty: 1,
        img: "https://cdn.sanity.io/images/w8f1ak3c/production/66d053ffcc85dc1f7883f68c54fb9c8b89cc157c-5000x5000.png/4.png?w=1024&h=1024&auto=format"
    },
    {
        id: "p2",
        title: "SONOMA X TWO GOOD CLASSIC PANETTONE",
        price: 65.00,
        qty: 1,
        img: "https://cdn.sanity.io/images/w8f1ak3c/production/2148887a131b99321f6b64f1d4ad4fd21d708e62-2880x1920.png/Sonoma-Classic-Panettone-Gifts-For-Good-2026-A7R07656-DexterKim.png?rect=214,247,2370,1673&fp-x=0.48386739921304256&fp-y=0.6311392212079228&w=1024&h=723&fit=crop&crop=focalpoint&auto=format"
    }
];

function initCartSystem() {
    const cartOverlay = document.querySelector("#cart-drawer-overlay");
    const cartBtn = document.querySelector("#cart-btn");
    const cartCloseBtn = document.querySelector("#cart-close-btn");
    const cartBackdrop = document.querySelector("#cart-backdrop");
    const continueShopping = document.querySelector("#continue-shopping");
    const checkoutBtn = document.querySelector("#checkout-btn");

    function openCart() {
        closeAllModals();
        cartOverlay.classList.add("active");
        cartOverlay.setAttribute("aria-hidden", "false");
        renderCart();
    }

    function closeCart() {
        cartOverlay.classList.remove("active");
        cartOverlay.setAttribute("aria-hidden", "true");
    }

    if (cartBtn) cartBtn.addEventListener("click", openCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);
    if (continueShopping) continueShopping.addEventListener("click", closeCart);

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                showToast("Your bag is currently empty", false);
                return;
            }
            showToast("Redirecting to Secure Social-Impact Checkout...", true);
            setTimeout(() => {
                closeCart();
            }, 1000);
        });
    }

    renderCart();
}

// 10. QUICK VIEW / CHECK MODAL SYSTEM
let currentQuickViewProduct = null;
let currentQuickViewQty = 1;

function initQuickViewSystem() {
    const qvModal = document.querySelector("#quickview-modal");
    const qvCloseBtn = document.querySelector("#quickview-close-btn");
    const qvBackdrop = document.querySelector("#quickview-backdrop");
    const qvImg = document.querySelector("#qv-img");
    const qvTitle = document.querySelector("#qv-title");
    const qvPrice = document.querySelector("#qv-price");
    const qvDesc = document.querySelector("#qv-desc");
    const qvBadge = document.querySelector("#qv-badge");
    const qvQtyVal = document.querySelector("#qv-qty-val");
    const qvQtyMinus = document.querySelector("#qv-qty-minus");
    const qvQtyPlus = document.querySelector("#qv-qty-plus");
    const qvAddBtn = document.querySelector("#qv-add-btn");

    function openQuickView(product) {
        currentQuickViewProduct = product;
        currentQuickViewQty = 1;
        if (qvQtyVal) qvQtyVal.textContent = "1";

        if (qvImg) qvImg.src = product.img;
        if (qvTitle) qvTitle.textContent = product.title;
        if (qvPrice) qvPrice.textContent = `$${product.price.toFixed(2)}`;
        if (qvDesc) qvDesc.textContent = product.desc || "Artisan crafted with social enterprise purpose. 100% of proceeds fund emergency meals.";
        if (qvBadge) qvBadge.textContent = product.badge || "Featured";

        closeAllModals();
        if (qvModal) {
            qvModal.classList.add("active");
            qvModal.setAttribute("aria-hidden", "false");
        }
    }

    function closeQuickView() {
        if (qvModal) {
            qvModal.classList.remove("active");
            qvModal.setAttribute("aria-hidden", "true");
        }
    }

    if (qvCloseBtn) qvCloseBtn.addEventListener("click", closeQuickView);
    if (qvBackdrop) qvBackdrop.addEventListener("click", closeQuickView);

    if (qvQtyMinus) {
        qvQtyMinus.addEventListener("click", () => {
            if (currentQuickViewQty > 1) {
                currentQuickViewQty--;
                qvQtyVal.textContent = currentQuickViewQty;
            }
        });
    }

    if (qvQtyPlus) {
        qvQtyPlus.addEventListener("click", () => {
            currentQuickViewQty++;
            qvQtyVal.textContent = currentQuickViewQty;
        });
    }

    if (qvAddBtn) {
        qvAddBtn.addEventListener("click", () => {
            if (currentQuickViewProduct) {
                for (let i = 0; i < currentQuickViewQty; i++) {
                    addToCart(currentQuickViewProduct);
                }
                closeQuickView();
            }
        });
    }

    // Attach click to all .child items in #page3
    document.querySelectorAll("#page3 .child").forEach(child => {
        child.addEventListener("click", function (e) {
            // If they clicked the quick-add-pill, let that button handle immediate add
            if (e.target.closest(".quick-add-pill")) {
                e.stopPropagation();
                const product = {
                    id: this.dataset.id,
                    title: this.dataset.title,
                    price: parseFloat(this.dataset.price),
                    img: this.dataset.img
                };
                addToCart(product);
                return;
            }

            // Otherwise, open the Quick View modal to check details & add to bag!
            const product = {
                id: this.dataset.id,
                title: this.dataset.title,
                price: parseFloat(this.dataset.price),
                img: this.dataset.img,
                desc: this.dataset.desc,
                badge: this.dataset.badge
            };
            openQuickView(product);
        });
    });
}
initQuickViewSystem();

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    renderCart();
    showToast(`Added "${product.title}" to bag`);

    // Animate cart badge
    const badge = document.querySelector("#cart-badge");
    if (badge) {
        gsap.fromTo(badge, { scale: 1.6 }, { scale: 1, duration: 0.35, ease: "back.out(2)" });
    }
}

function updateCartQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
    showToast("Item removed from bag");
}

window.updateCartQty = updateCartQty;
window.removeFromCart = removeFromCart;

function renderCart() {
    const container = document.querySelector("#cart-items-container");
    const countLabel = document.querySelector("#cart-items-count-label");
    const badge = document.querySelector("#cart-badge");
    const subtotalEl = document.querySelector("#cart-subtotal");
    const shippingText = document.querySelector("#shipping-text");
    const shippingProgress = document.querySelector("#shipping-progress");

    if (!container) return;

    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    if (badge) badge.textContent = totalCount;
    if (countLabel) countLabel.textContent = `(${totalCount} ${totalCount === 1 ? 'item' : 'items'})`;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Free shipping threshold ($100)
    const threshold = 100;
    if (shippingProgress && shippingText) {
        const remaining = threshold - subtotal;
        if (remaining <= 0) {
            shippingText.innerHTML = '<strong>Congratulations!</strong> You qualify for Free Express Shipping!';
            shippingProgress.style.width = "100%";
        } else {
            const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
            shippingText.innerHTML = `Add <strong>$${remaining.toFixed(2)}</strong> more for Free Shipping`;
            shippingProgress.style.width = `${pct}%`;
        }
    }

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #888;">
                <i class="ri-shopping-bag-line" style="font-size: 42px; display: block; margin-bottom: 12px; color: #ccc;"></i>
                <p style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 6px;">Your bag is empty</p>
                <p style="font-size: 13px;">Explore our artisan products and support good causes.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.title}" class="cart-item-thumb">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                <div class="cart-qty-ctrl">
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>
    `).join("");
}
initCartSystem();

// 10. FULLSCREEN EDITORIAL NAVIGATION MENU
function initFullscreenMenu() {
    const menuModal = document.querySelector("#fullscreen-menu");
    const menuBtn = document.querySelector("#menu-btn");
    const menuCloseBtn = document.querySelector("#menu-close-btn");
    const menuBackdrop = document.querySelector("#menu-backdrop");
    const previewImg = document.querySelector("#menu-preview-img");
    const menuLinks = document.querySelectorAll(".menu-link");

    function openMenu() {
        closeAllModals();
        menuModal.classList.add("active");
        menuModal.setAttribute("aria-hidden", "false");

        // Stagger animation for links
        gsap.fromTo(
            menuLinks,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
        );
    }

    function closeMenu() {
        menuModal.classList.remove("active");
        menuModal.setAttribute("aria-hidden", "true");
    }

    if (menuBtn) menuBtn.addEventListener("click", openMenu);
    if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeMenu);
    if (menuBackdrop) menuBackdrop.addEventListener("click", closeMenu);

    // Hover effect dynamically changing preview image
    menuLinks.forEach(link => {
        link.addEventListener("mouseenter", function () {
            const newSrc = this.dataset.img;
            if (previewImg && newSrc) {
                gsap.to(previewImg, {
                    opacity: 0.4,
                    duration: 0.15,
                    onComplete: () => {
                        previewImg.src = newSrc;
                        gsap.to(previewImg, { opacity: 1, duration: 0.25 });
                    }
                });
            }
        });
    });
}
initFullscreenMenu();

// 11. NEWSLETTER SUBSCRIPTION FORM
function initNewsletter() {
    const form = document.querySelector("#newsletter-form");
    const input = document.querySelector("#newsletter-email");
    const status = document.querySelector("#newsletter-status");

    if (!form || !input || !status) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = input.value.trim();
        if (!email) return;

        status.style.display = "block";
        status.style.color = "#48bb78";
        status.innerHTML = `<i class="ri-checkbox-circle-line"></i> Thank you! "${email}" is now part of the movement.`;

        showToast("Welcome to MotionCraft community!");
        input.value = "";

        setTimeout(() => {
            gsap.to(status, { opacity: 0, duration: 0.5, onComplete: () => { status.style.display = "none"; status.style.opacity = 1; } });
        }, 5000);
    });
}
initNewsletter();

// Helper to close all modals together
function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    });
}