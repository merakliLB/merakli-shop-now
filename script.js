const productsContainer = document.getElementById('products');
const cartItems = document.getElementById('cartItems');
const sendToWhatsAppBtn = document.getElementById('sendToWhatsApp');
const clearCartBtn = document.getElementById('clearCart');
const englishBtn = document.getElementById('englishBtn');
const arabicBtn = document.getElementById('arabicBtn');
const cartCount = document.getElementById('cartCount');

// تهيئة السلة من localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// تحميل البيانات عند بدء التشغيل
document.addEventListener('DOMContentLoaded', () => {
    if (!Array.isArray(products) || products.length === 0) {
        console.error("🚨 خطأ: لم يتم تحميل المنتجات بشكل صحيح!");
        if (productsContainer) {
            productsContainer.innerHTML = "<p style='color: red;'>⚠️ لم يتم العثور على منتجات. يرجى التحقق من `data.js`.</p>";
        }
        return;
    }
    
    displayProducts();
});


function displayProducts() {
    if (productsContainer) {
        productsContainer.innerHTML = products.map(product => `
            <div class="product">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description}</p>
                    <p class="price">💰 $${product.price}</p>
                    <button onclick="addToCart(${product.id})">🛒 أضف إلى السلة</button>
                </div>
            </div>
        `).join('');
    }
}


// إضافة إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // حفظ في التخزين المحلي
    updateCart();
}


// تحديث السلة
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (sendToWhatsAppBtn) sendToWhatsAppBtn.style.display = cart.length ? 'block' : 'none';
    if (cartItems) displayCartItems();
}

// عرض عناصر السلة
function displayCartItems() {
    if (!cartItems) return;  // تأكد من أن العنصر موجود

    cart = JSON.parse(localStorage.getItem('cart')) || []; // تحميل السلة من التخزين المحلي

    if (cart.length === 0) {
        cartItems.innerHTML = "<p style='color: red;'>السلة فارغة 🛒</p>";
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <li class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>الكمية: <strong>${item.quantity}</strong></p>
                <p class="price">💰 $${item.price * item.quantity}</p>
                <button onclick="increaseQuantity(${item.id})">+</button>
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">❌ إزالة</button>
            </div>
        </li>
    `).join('');
}


// التحكم في الكميات
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) item.quantity++;
    updateCart();
}

function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    updateCart();
}

// إزالة العنصر
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// إفراغ السلة
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
    });
}

// إرسال إلى واتساب
if (sendToWhatsAppBtn) {
    sendToWhatsAppBtn.addEventListener('click', () => {
        const message = cart.map(item => 
            `${item.name} - الكمية: ${item.quantity} - الإجمالي: $${item.price * item.quantity}`
        ).join('\n');
        
        const whatsappUrl = `https://wa.me/243981753690?text=${encodeURIComponent('الطلب:\n' + message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// تغيير اللغة
if (englishBtn && arabicBtn) {
    englishBtn.addEventListener('click', () => {
        document.documentElement.lang = 'en';
        translateToEnglish();
    });

    arabicBtn.addEventListener('click', () => {
        document.documentElement.lang = 'ar';
        translateToArabic();
    });
}

// الترجمة
function translateToEnglish() {
    document.querySelector('h1').textContent = 'Product Showcase';
    if (clearCartBtn) clearCartBtn.textContent = 'Clear Cart';
    if (sendToWhatsAppBtn) sendToWhatsAppBtn.textContent = 'Send to WhatsApp';
    // ترجمة العناصر الأخرى حسب الحاجة
}

function translateToArabic() {
    document.querySelector('h1').textContent = 'عرض المنتجات';
    if (clearCartBtn) clearCartBtn.textContent = 'إفراغ السلة';
    if (sendToWhatsAppBtn) sendToWhatsAppBtn.textContent = 'إرسال إلى واتساب';
}

// الانتقال إلى السلة
function goToCart() {
    window.location.href = 'cart.html';
}
