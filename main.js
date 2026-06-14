document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. FLOATING ROSE PETALS ANIMATION
    // ==========================================
    const petalsContainer = document.getElementById('petals-container');
    const maxPetals = 25;
    let petalCount = 0;

    function createPetal() {
        if (petalCount >= maxPetals) return;
        
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Randomize size, rotation, speed, delay, and position
        const size = Math.random() * 12 + 8; // 8px to 20px
        const left = Math.random() * 100; // 0% to 100%
        const delay = Math.random() * 5; // 0s to 5s
        const duration = Math.random() * 8 + 8; // 8s to 16s
        const rotation = Math.random() * 360;
        
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${left}%`;
        petal.style.top = `-20px`;
        petal.style.transform = `rotate(${rotation}deg)`;
        petal.style.animationDelay = `${delay}s`;
        petal.style.animationDuration = `${duration}s`;
        
        // Randomize shape variations for natural look
        const borderRadiusOption = [
            '50% 0 50% 50%',
            '0 50% 50% 50%',
            '50% 50% 0 50%',
            '50% 50% 50% 0'
        ];
        petal.style.borderRadius = borderRadiusOption[Math.floor(Math.random() * borderRadiusOption.length)];

        petalsContainer.appendChild(petal);
        petalCount++;

        // Remove petal when its animation finishes
        petal.addEventListener('animationend', () => {
            petal.remove();
            petalCount--;
        });
    }

    // Generate initial petals
    for (let i = 0; i < 12; i++) {
        createPetal();
    }
    
    // Continuously generate petals
    setInterval(createPetal, 700);


    // ==========================================
    // 2. STICKY HEADER & NAV CONTROLS
    // ==========================================
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Navigation Toggle
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    
    navToggleBtn.addEventListener('click', () => {
        navToggleBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on clicking navigation links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggleBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // ==========================================
    // 3. INTERACTIVE HOTSPOTS FOR KOOL ROSE BOTTLE
    // ==========================================
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
        const btn = hotspot.querySelector('.hotspot-btn');
        
        // Toggle active status for touch screens
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // If already active, close it
            if (hotspot.classList.contains('active')) {
                hotspot.classList.remove('active');
            } else {
                // Remove active class from all other hotspots first
                hotspots.forEach(hs => hs.classList.remove('active'));
                hotspot.classList.add('active');
            }
        });
    });

    // Close tooltips on clicking elsewhere
    document.addEventListener('click', () => {
        hotspots.forEach(hotspot => hotspot.classList.remove('active'));
    });


    // ==========================================
    // 4. NUTRITION FACTS MODAL
    // ==========================================
    const openNutritionBtn = document.getElementById('open-nutrition');
    const closeNutritionBtn = document.getElementById('close-nutrition');
    const nutritionCard = document.getElementById('nutrition-card');
    const nutritionBackdrop = document.getElementById('nutrition-backdrop');

    function toggleNutrition(show) {
        if (show) {
            nutritionCard.classList.add('active');
            nutritionBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scroll
        } else {
            nutritionCard.classList.remove('active');
            nutritionBackdrop.classList.remove('active');
            document.body.style.overflow = 'auto'; // Resume scroll
        }
    }

    openNutritionBtn.addEventListener('click', () => toggleNutrition(true));
    closeNutritionBtn.addEventListener('click', () => toggleNutrition(false));
    nutritionBackdrop.addEventListener('click', () => toggleNutrition(false));


    // ==========================================
    // 5. INTERACTIVE ORDER ESTIMATOR CALCULATIONS
    // ==========================================
    const itemRows = document.querySelectorAll('.item-row');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryDelivery = document.getElementById('summary-delivery');
    const summaryTotal = document.getElementById('summary-total');

    const orderData = {
        'kool-rose': { name: 'Amul Kool Rose (200ml)', price: 30, qty: 0 },
        'paneer': { name: 'Amul Fresh Paneer (200g)', price: 90, qty: 0 },
        'butter': { name: 'Amul Butter (100g)', price: 60, qty: 0 },
        'bread': { name: 'Swiss Bakery Bread', price: 40, qty: 0 },
        'peas': { name: 'Kavendar Green Peas (1kg)', price: 120, qty: 0 }
    };

    const DELIVERY_CHARGE = 20;

    itemRows.forEach(row => {
        const itemId = row.getAttribute('data-id');
        const price = parseInt(row.getAttribute('data-price'));
        const minusBtn = row.querySelector('.minus-btn');
        const plusBtn = row.querySelector('.plus-btn');
        const qtyVal = row.querySelector('.qty-val');
        const itemTotal = row.querySelector('.item-total-price');

        // Initial update
        orderData[itemId].price = price;

        plusBtn.addEventListener('click', () => {
            orderData[itemId].qty++;
            updateRowAndSummary();
        });

        minusBtn.addEventListener('click', () => {
            if (orderData[itemId].qty > 0) {
                orderData[itemId].qty--;
                updateRowAndSummary();
            }
        });

        function updateRowAndSummary() {
            qtyVal.textContent = orderData[itemId].qty;
            const rowTotal = orderData[itemId].qty * price;
            itemTotal.textContent = `₹${rowTotal}`;
            calculateTotals();
        }
    });

    function calculateTotals() {
        let subtotal = 0;
        let activeItems = 0;

        for (const key in orderData) {
            const item = orderData[key];
            subtotal += item.qty * item.price;
            if (item.qty > 0) activeItems++;
        }

        summarySubtotal.textContent = `₹${subtotal.toFixed(2)}`;

        // If no items, delivery fee is 0
        const deliveryFee = subtotal > 0 ? DELIVERY_CHARGE : 0;
        summaryDelivery.textContent = `₹${deliveryFee.toFixed(2)}`;

        const total = subtotal + deliveryFee;
        summaryTotal.textContent = `₹${total.toFixed(2)}`;
    }

    // Add Kool Rose from product feature section
    window.addKoolRoseToOrder = function() {
        orderData['kool-rose'].qty++;
        
        // Find Kool Rose row and update its display
        const koolRoseRow = document.querySelector('.item-row[data-id="kool-rose"]');
        if (koolRoseRow) {
            koolRoseRow.querySelector('.qty-val').textContent = orderData['kool-rose'].qty;
            koolRoseRow.querySelector('.item-total-price').textContent = `₹${orderData['kool-rose'].qty * orderData['kool-rose'].price}`;
        }
        
        calculateTotals();
        
        // Scroll smoothly to estimator section
        document.getElementById('estimator').scrollIntoView({ behavior: 'smooth' });
    };

    // Format order message and open WhatsApp
    window.sendOrderViaWhatsApp = function() {
        let itemsList = '';
        let subtotal = 0;

        for (const key in orderData) {
            const item = orderData[key];
            if (item.qty > 0) {
                const rowCost = item.qty * item.price;
                itemsList += `• ${item.name} x ${item.qty} = Rs. ${rowCost}\n`;
                subtotal += rowCost;
            }
        }

        if (subtotal === 0) {
            alert('Please select at least 1 item to estimate your order!');
            return;
        }

        const totalCost = subtotal + DELIVERY_CHARGE;
        const shopNumber = '919596000074'; // Standard WhatsApp format

        const message = `Hello Sunrise Srinagar 74,\n\nI would like to place an order request:\n\n${itemsList}\nSubtotal: Rs. ${subtotal}\nDelivery: Rs. ${DELIVERY_CHARGE}\n*Total Estimate: Rs. ${totalCost}*\n\nPlease confirm stock availability and delivery. Thank you!`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${shopNumber}&text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };


    // ==========================================
    // 6. CONTACT FORM HANDLING
    // ==========================================
    window.handleFormSubmit = function(event) {
        event.preventDefault();
        
        const form = document.getElementById('contact-form');
        const status = document.getElementById('form-status');
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Perform mock submission
        status.className = 'form-status'; // Reset class
        
        if (!name || !phone || !message) {
            status.textContent = 'Please fill out all required fields.';
            status.classList.add('error');
            return;
        }

        // Simulating API loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const origBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnText;
            
            // Show Success Msg
            status.textContent = `Thank you ${name}! Your query regarding Srinagar distributor stock has been received. We'll contact you at ${phone} shortly.`;
            status.classList.add('success');
            
            // Reset Form
            form.reset();
        }, 1200);
    };


    // ==========================================
    // 7. ACTIVE NAVIGATION LINK ON SCROLL & FADE IN ANIMATIONS
    // ==========================================
    const sections = document.querySelectorAll('section');
    const scrollElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    // Intersection Observer for scroll animations
    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    scrollElements.forEach(el => elementObserver.observe(el));

    // Scroll active link highlight observer
    const navObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px' // Focus on the middle of the viewport
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

});
