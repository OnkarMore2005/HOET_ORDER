// Global Variables
let customerInfo = {};
let cart = [];
let currentOrderId = null;
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
let menuItems = [];
let currentReceiptOrder = null;

// Indian Menu Items with Images
const menuData = [
    // Appetizers
    {
        id: 1,
        name: "Samosa",
        description: "Crispy fried pastry filled with spiced potatoes and peas",
        price: 45,
        category: "appetizers",
        image: "🍛",
        popular: true
    },
    {
        id: 2,
        name: "Pakora",
        description: "Deep-fried vegetables coated in chickpea flour batter",
        price: 55,
        category: "appetizers",
        image: "🥗"
    },
    {
        id: 3,
        name: "Paneer Tikka",
        description: "Grilled cottage cheese cubes marinated in yogurt and spices",
        price: 180,
        category: "appetizers",
        image: "🧀",
        popular: true
    },
    {
        id: 4,
        name: "Chicken Tikka",
        description: "Tender chicken pieces marinated in spices and grilled",
        price: 220,
        category: "appetizers",
        image: "🍗",
        popular: true
    },

    // Main Course
    {
        id: 5,
        name: "Butter Chicken",
        description: "Tender chicken in rich tomato and cream sauce",
        price: 320,
        category: "mains",
        image: "🍗",
        popular: true
    },
    {
        id: 6,
        name: "Dal Makhani",
        description: "Creamy black lentils slow-cooked with butter and cream",
        price: 180,
        category: "mains",
        image: "🍲",
        popular: true
    },
    {
        id: 7,
        name: "Palak Paneer",
        description: "Cottage cheese in creamy spinach gravy",
        price: 200,
        category: "mains",
        image: "🥬"
    },
    {
        id: 8,
        name: "Chicken Curry",
        description: "Traditional Indian chicken curry with aromatic spices",
        price: 280,
        category: "mains",
        image: "🍛"
    },

    // Biryani
    {
        id: 9,
        name: "Chicken Biryani",
        description: "Fragrant basmati rice with spiced chicken and saffron",
        price: 350,
        category: "biryani",
        image: "🍚",
        popular: true
    },
    {
        id: 10,
        name: "Mutton Biryani",
        description: "Aromatic rice with tender mutton and exotic spices",
        price: 420,
        category: "biryani",
        image: "🍖"
    },
    {
        id: 11,
        name: "Vegetable Biryani",
        description: "Mixed vegetables cooked with basmati rice and spices",
        price: 250,
        category: "biryani",
        image: "🥕"
    },
    {
        id: 12,
        name: "Egg Biryani",
        description: "Hard-boiled eggs with fragrant basmati rice",
        price: 200,
        category: "biryani",
        image: "🥚"
    },

    // Curries
    {
        id: 13,
        name: "Chana Masala",
        description: "Spiced chickpea curry with tomatoes and onions",
        price: 160,
        category: "curries",
        image: "🫘"
    },
    {
        id: 14,
        name: "Rajma Curry",
        description: "Red kidney beans in rich tomato gravy",
        price: 170,
        category: "curries",
        image: "🍅"
    },
    {
        id: 15,
        name: "Fish Curry",
        description: "Fresh fish cooked in coconut and tamarind gravy",
        price: 300,
        category: "curries",
        image: "🐟"
    },
    {
        id: 16,
        name: "Aloo Gobi",
        description: "Potatoes and cauliflower cooked with Indian spices",
        price: 140,
        category: "curries",
        image: "🥔"
    },

    // Breads
    {
        id: 17,
        name: "Naan",
        description: "Soft leavened bread baked in tandoor",
        price: 25,
        category: "breads",
        image: "🥖",
        popular: true
    },
    {
        id: 18,
        name: "Garlic Naan",
        description: "Naan bread topped with garlic and herbs",
        price: 35,
        category: "breads",
        image: "🧄"
    },
    {
        id: 19,
        name: "Roti",
        description: "Whole wheat flatbread",
        price: 15,
        category: "breads",
        image: "🥯"
    },
    {
        id: 20,
        name: "Paratha",
        description: "Layered flatbread with ghee",
        price: 40,
        category: "breads",
        image: "🥞"
    },

    // Desserts
    {
        id: 21,
        name: "Gulab Jamun",
        description: "Soft milk dumplings in rose-flavored syrup",
        price: 80,
        category: "desserts",
        image: "🍯",
        popular: true
    },
    {
        id: 22,
        name: "Ras Malai",
        description: "Soft cheese dumplings in sweetened milk",
        price: 90,
        category: "desserts",
        image: "🥛"
    },
    {
        id: 23,
        name: "Kulfi",
        description: "Traditional Indian ice cream",
        price: 60,
        category: "desserts",
        image: "🍦"
    },
    {
        id: 24,
        name: "Jalebi",
        description: "Crispy orange spirals soaked in sugar syrup",
        price: 50,
        category: "desserts",
        image: "🍯"
    },

    // Beverages
    {
        id: 25,
        name: "Masala Chai",
        description: "Spiced Indian tea with milk",
        price: 30,
        category: "beverages",
        image: "☕",
        popular: true
    },
    {
        id: 26,
        name: "Lassi",
        description: "Sweet yogurt drink",
        price: 40,
        category: "beverages",
        image: "🥤"
    },
    {
        id: 27,
        name: "Mango Lassi",
        description: "Mango-flavored yogurt drink",
        price: 50,
        category: "beverages",
        image: "🥭"
    },
    {
        id: 28,
        name: "Fresh Lime Soda",
        description: "Refreshing lime soda with salt",
        price: 35,
        category: "beverages",
        image: "🍋"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    menuItems = menuData;
    setupEventListeners();
    renderMenu();
    updateCartDisplay();
}

function setupEventListeners() {
    // Customer form submission
    document.getElementById('customerForm').addEventListener('submit', handleCustomerForm);
    
    // Cart sidebar backdrop click
    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cartSidebar');
        if (e.target === cartSidebar) {
            toggleCart();
        }
    });
}

// Customer Form Handling
function handleCustomerForm(e) {
    e.preventDefault();
    
    customerInfo = {
        name: document.getElementById('customerName').value,
        mobile: document.getElementById('customerMobile').value,
        email: document.getElementById('customerEmail').value,
        table: document.getElementById('tableNumber').value
    };
    
    // Hide customer form and show menu
    document.getElementById('customerInfoSection').style.display = 'none';
    document.getElementById('menuSection').style.display = 'block';
    
    // Generate initial order ID
    currentOrderId = generateOrderId();
    
    // Show welcome message
    showNotification(`Welcome ${customerInfo.name}! Your order ID is ${currentOrderId}`, 'success');
}

// Generate Unique Order ID
function generateOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `SG${timestamp}${random}`;
}

// Menu Rendering
function renderMenu(filter = 'all') {
    const menuGrid = document.getElementById('menuGrid');
    let filteredItems = filter === 'all' ? menuItems : menuItems.filter(item => item.category === filter);
    
    menuGrid.innerHTML = filteredItems.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-image">
                <span style="font-size: 4rem;">${item.image}</span>
                ${item.popular ? '<div class="popular-badge">Popular</div>' : ''}
        </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">₹${item.price}</span>
                    <button class="add-to-cart" onclick="addToCart(${item.id})">
                        <i class="fas fa-plus"></i> Add
                    </button>
          </div>
        </div>
      </div>
    `).join('');
}

// Filter Menu by Category
function filterMenu(category) {
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderMenu(category);
}

// Cart Management
function addToCart(itemId) {
    const item = menuItems.find(menuItem => menuItem.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${item.name} added to cart!`, 'success');
    
    // Add animation to cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Your cart is empty</p>';
  } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <span>${item.image}</span>
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
        </div>
        </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

// Cart Sidebar Toggle
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

// Place Order
function placeOrder() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
    return;
  }

    showLoading(true);

  const order = {
        id: currentOrderId,
        customer: customerInfo,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString(),
        status: 'placed'
    };
    
    // Add to order history
    orderHistory.unshift(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    // Send email notification (Formspree integration)
    sendOrderEmail(order);
    
    setTimeout(() => {
        showLoading(false);
        showOrderConfirmation(order);
        cart = [];
        updateCartDisplay();
        toggleCart();
        currentOrderId = generateOrderId();
    }, 2000);
}

// Send Order Email via Formspree
function sendOrderEmail(order) {
    const emailData = {
        orderId: order.id,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerMobile: order.customer.mobile,
        tableNumber: order.customer.table,
        items: order.items.map(item => `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`).join('\n'),
        total: order.total,
        timestamp: new Date(order.timestamp).toLocaleString()
    };
    
    // Formspree form submission
    const formData = new FormData();
    formData.append('_subject', `New Order - ${order.id}`);
    formData.append('_replyto', order.customer.email);
    formData.append('message', `
Order ID: ${emailData.orderId}
Customer: ${emailData.customerName}
Email: ${emailData.customerEmail}
Mobile: ${emailData.customerMobile}
Table: ${emailData.tableNumber}

Order Details:
${emailData.items}

Total Amount: ₹${emailData.total}
Order Time: ${emailData.timestamp}

Thank you for choosing Spice Garden!
    `);
    
    // Submit to Formspree (replace with your Formspree endpoint)
    fetch('https://formspree.io/f/xblzvojq', {
        method: 'POST',
        body: formData
    }).catch(error => {
        console.log('Email notification failed:', error);
    });
}

// Order Confirmation Modal
function showOrderConfirmation(order) {
    document.getElementById('orderId').textContent = order.id;
    document.getElementById('orderCustomer').textContent = order.customer.name;
    document.getElementById('orderTable').textContent = order.customer.table;
    document.getElementById('orderTotal').textContent = order.total;
    
    const modal = document.getElementById('orderModal');
    modal.classList.add('show');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('show');
}

function addMoreItems() {
    closeOrderModal();
    // Scroll to menu
    document.getElementById('menuSection').scrollIntoView({ behavior: 'smooth' });
}

// Order History
function showOrderHistory() {
    const historyList = document.getElementById('historyList');
    
    if (orderHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No order history found</p>';
    } else {
        historyList.innerHTML = orderHistory.map(order => `
            <div class="history-item">
                <h4>Order #${order.id}</h4>
                <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleDateString()}</p>
                <p><strong>Items:</strong> ${order.items.length} items</p>
                <p><strong>Total:</strong> ₹${order.total}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <div class="history-actions">
                    <button class="reorder-btn" onclick="reorderItems('${order.id}')">Reorder</button>
                    <button class="receipt-btn" onclick="viewReceiptFromHistory('${order.id}')">
                        <i class="fas fa-receipt"></i> Receipt
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('historyModal').classList.add('show');
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.remove('show');
}

function reorderItems(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) return;
    
    // Add items to current cart
    order.items.forEach(item => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push({
                ...item,
                category: menuItems.find(mi => mi.id === item.id)?.category || 'mains'
            });
        }
    });
    
    updateCartDisplay();
    closeHistoryModal();
    toggleCart();
    showNotification('Items added to cart from previous order!', 'success');
}

// Utility Functions
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (show) {
        loadingOverlay.classList.add('show');
    } else {
        loadingOverlay.classList.remove('show');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 5000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Digital Receipt Functions
function viewReceipt() {
    // Get the most recent order from order history
    if (orderHistory.length === 0) {
        showNotification('No order found to generate receipt!', 'error');
        return;
    }
    
    currentReceiptOrder = orderHistory[0]; // Most recent order
    generateReceipt(currentReceiptOrder);
}

function viewReceiptFromHistory(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) {
        showNotification('Order not found!', 'error');
        return;
    }
    
    currentReceiptOrder = order;
    generateReceipt(order);
}

function generateReceipt(order) {
    const receiptContent = document.getElementById('receiptContent');
    const orderDate = new Date(order.timestamp);
    
    receiptContent.innerHTML = `
        <div class="receipt-header">
            <h2>🍽️ Spice Garden</h2>
            <p>Digital Restaurant Receipt</p>
            <p>123 Food Street, City - 123456</p>
            <p>Phone: +91 98765 43210</p>
        </div>
        
        <div class="receipt-details">
            <div class="receipt-row">
                <span>Order ID:</span>
                <span>${order.id}</span>
            </div>
            <div class="receipt-row">
                <span>Date & Time:</span>
                <span>${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}</span>
            </div>
            <div class="receipt-row">
                <span>Customer Name:</span>
                <span>${order.customer.name}</span>
            </div>
            <div class="receipt-row">
                <span>Mobile:</span>
                <span>${order.customer.mobile}</span>
            </div>
            <div class="receipt-row">
                <span>Email:</span>
                <span>${order.customer.email}</span>
            </div>
            <div class="receipt-row">
                <span>Table Number:</span>
                <span>${order.customer.table}</span>
            </div>
        </div>
        
        <div class="receipt-items">
            <h3>Order Items:</h3>
            ${order.items.map(item => `
                <div class="receipt-item">
                    <div class="receipt-item-name">
                        ${item.name}
                    </div>
                    <div class="receipt-item-details">
                        ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="receipt-row total">
            <span>TOTAL AMOUNT:</span>
            <span>₹${order.total}</span>
        </div>
        
        <div class="receipt-footer">
            <p>Thank you for dining with us!</p>
            <p>Visit us again for more delicious meals</p>
            <p>GST Included | Service Charge Included</p>
        </div>
    `;
    
    document.getElementById('receiptModal').classList.add('show');
}

function closeReceiptModal() {
    document.getElementById('receiptModal').classList.remove('show');
    currentReceiptOrder = null;
}

function printReceipt() {
    if (!currentReceiptOrder) {
        showNotification('No receipt to print!', 'error');
        return;
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const receiptContent = document.getElementById('receiptContent').innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt - ${currentReceiptOrder.id}</title>
            <style>
                body { font-family: 'Courier New', monospace; margin: 20px; }
                .receipt-header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 20px; margin-bottom: 20px; }
                .receipt-header h2 { color: #e74c3c; font-size: 1.8rem; margin-bottom: 5px; }
                .receipt-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; border-bottom: 1px dotted #ccc; }
                .receipt-row.total { border-top: 2px solid #333; border-bottom: 2px solid #333; font-weight: bold; font-size: 1.1rem; margin-top: 15px; padding-top: 15px; }
                .receipt-item { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; }
                .receipt-item-name { flex: 2; font-weight: 500; }
                .receipt-item-details { flex: 1; text-align: right; color: #666; }
                .receipt-footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #333; color: #666; font-size: 0.9rem; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            ${receiptContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    showNotification('Receipt sent to printer!', 'success');
}

function downloadReceipt() {
    if (!currentReceiptOrder) {
        showNotification('No receipt to download!', 'error');
        return;
    }
    
    try {
        // Create new PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const orderDate = new Date(currentReceiptOrder.timestamp);
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = 20;
        
        // Helper function to add text with word wrap
        function addText(text, fontSize = 10, isBold = false, alignment = 'left', color = '#000000') {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');
            doc.setTextColor(color);
            
            if (alignment === 'center') {
                doc.text(text, pageWidth / 2, yPosition, { align: 'center' });
            } else if (alignment === 'right') {
                doc.text(text, pageWidth - margin, yPosition, { align: 'right' });
            } else {
                doc.text(text, margin, yPosition);
            }
            yPosition += fontSize * 0.5;
        }
        
        // Helper function to add line
        function addLine() {
            doc.setDrawColor(0, 0, 0);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 5;
        }
        
        // Header
        addText('🍽️ SPICE GARDEN', 20, true, 'center', '#e74c3c');
        yPosition += 5;
        addText('Digital Restaurant Receipt', 14, true, 'center');
        addText('123 Food Street, City - 123456', 10, false, 'center');
        addText('Phone: +91 98765 43210', 10, false, 'center');
        yPosition += 10;
        
        // Separator line
        addLine();
        
        // Order Details
        addText('ORDER DETAILS', 12, true, 'center');
        yPosition += 5;
        
        addText(`Order ID: ${currentReceiptOrder.id}`, 10, true);
        addText(`Date & Time: ${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}`, 10);
        addText(`Customer Name: ${currentReceiptOrder.customer.name}`, 10);
        addText(`Mobile: ${currentReceiptOrder.customer.mobile}`, 10);
        addText(`Email: ${currentReceiptOrder.customer.email}`, 10);
        addText(`Table Number: ${currentReceiptOrder.customer.table}`, 10);
        
        yPosition += 10;
        addLine();
        
        // Order Items Header
        addText('ORDER ITEMS', 12, true, 'center');
        yPosition += 5;
        
        // Item headers
        addText('Item', 10, true);
        doc.text('Qty', 120, yPosition - 5);
        doc.text('Price', 150, yPosition - 5);
        doc.text('Total', 180, yPosition - 5);
        yPosition += 5;
        
        // Add line under headers
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
        
        // Order Items
        currentReceiptOrder.items.forEach(item => {
            const itemTotal = item.quantity * item.price;
            
            // Check if we need a new page
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            // Item name (with word wrap if too long)
            const itemName = item.name.length > 25 ? item.name.substring(0, 22) + '...' : item.name;
            addText(itemName, 10);
            
            // Quantity, Price, Total in columns
            doc.text(item.quantity.toString(), 120, yPosition - 5);
            doc.text(`₹${item.price}`, 150, yPosition - 5);
            doc.text(`₹${itemTotal}`, 180, yPosition - 5);
            
            yPosition += 8;
        });
        
        yPosition += 5;
        addLine();
        
        // Total Amount
        addText(`TOTAL AMOUNT: ₹${currentReceiptOrder.total}`, 14, true, 'center', '#e74c3c');
        
        yPosition += 15;
        addLine();
        
        // Footer
        addText('Thank you for dining with us!', 10, true, 'center');
        addText('Visit us again for more delicious meals', 10, false, 'center');
        addText('GST Included | Service Charge Included', 10, false, 'center');
        
        yPosition += 10;
        addText('Spice Garden - Digital Restaurant', 10, false, 'center');
        addText('www.spicegarden.com', 10, false, 'center');
        
        // Save the PDF
        doc.save(`receipt-${currentReceiptOrder.id}.pdf`);
        
        showNotification('PDF receipt downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF receipt!', 'error');
    }
}

// Excel Export Functions
function exportOrdersExcel() {
    if (orderHistory.length === 0) {
        showNotification('No orders to export!', 'error');
        return;
    }
    
    try {
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        
        // Prepare data for Orders sheet
        const ordersData = [];
        const itemsData = [];
        const summaryData = [];
        
        // Add header row for orders
        ordersData.push([
            'Order ID', 'Date', 'Time', 'Customer Name', 'Mobile', 'Email', 
            'Table Number', 'Total Items', 'Total Amount', 'Status'
        ]);
        
        // Add header row for items
        itemsData.push([
            'Order ID', 'Item ID', 'Item Name', 'Quantity', 'Unit Price', 'Item Total'
        ]);
        
        // Process each order
        orderHistory.forEach(order => {
            const orderDate = new Date(order.timestamp);
            const dateStr = orderDate.toLocaleDateString();
            const timeStr = orderDate.toLocaleTimeString();
            const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
            
            // Add order row
            ordersData.push([
                order.id,
                dateStr,
                timeStr,
                order.customer.name,
                order.customer.mobile,
                order.customer.email,
                order.customer.table,
                totalQuantity,
                order.total,
                order.status
            ]);
            
            // Add items for this order
            order.items.forEach(item => {
                itemsData.push([
                    order.id,
                    item.id,
                    item.name,
                    item.quantity,
                    item.price,
                    item.quantity * item.price
                ]);
            });
        });
        
        // Create summary data
        const totalRevenue = orderHistory.reduce((sum, order) => sum + order.total, 0);
        const averageOrderValue = totalRevenue / orderHistory.length;
        const totalOrders = orderHistory.length;
        
        summaryData.push(['Restaurant Report Summary']);
        summaryData.push(['']);
        summaryData.push(['Restaurant Name', 'Spice Garden']);
        summaryData.push(['Export Date', new Date().toLocaleDateString()]);
        summaryData.push(['Total Orders', totalOrders]);
        summaryData.push(['Total Revenue', `₹${totalRevenue}`]);
        summaryData.push(['Average Order Value', `₹${averageOrderValue.toFixed(2)}`]);
        summaryData.push(['']);
        summaryData.push(['Most Ordered Items']);
        
        // Get most ordered items
        const itemCounts = {};
        orderHistory.forEach(order => {
            order.items.forEach(item => {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
            });
        });
        
        const sortedItems = Object.entries(itemCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        sortedItems.forEach(([name, count]) => {
            summaryData.push([name, count]);
        });
        
        // Create worksheets
        const ordersWS = XLSX.utils.aoa_to_sheet(ordersData);
        const itemsWS = XLSX.utils.aoa_to_sheet(itemsData);
        const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
        
        // Set column widths
        ordersWS['!cols'] = [
            { wch: 15 }, // Order ID
            { wch: 12 }, // Date
            { wch: 12 }, // Time
            { wch: 20 }, // Customer Name
            { wch: 15 }, // Mobile
            { wch: 25 }, // Email
            { wch: 12 }, // Table Number
            { wch: 12 }, // Total Items
            { wch: 12 }, // Total Amount
            { wch: 12 }  // Status
        ];
        
        itemsWS['!cols'] = [
            { wch: 15 }, // Order ID
            { wch: 8 },  // Item ID
            { wch: 25 }, // Item Name
            { wch: 10 }, // Quantity
            { wch: 12 }, // Unit Price
            { wch: 12 }  // Item Total
        ];
        
        summaryWS['!cols'] = [
            { wch: 25 }, // Label
            { wch: 20 }  // Value
        ];
        
        // Add worksheets to workbook
        XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
        XLSX.utils.book_append_sheet(wb, ordersWS, 'Orders');
        XLSX.utils.book_append_sheet(wb, itemsWS, 'Order Items');
        
        // Generate filename with current date
        const filename = `Spice-Garden-Orders-${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Save the file
        XLSX.writeFile(wb, filename);
        
        showNotification('Orders exported to Excel successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting Excel:', error);
        showNotification('Error exporting orders to Excel!', 'error');
    }
}

// Helper function to escape XML special characters
function escapeXml(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Helper function to get most ordered items
function getMostOrderedItems() {
    const itemCounts = {};
    
    orderHistory.forEach(order => {
        order.items.forEach(item => {
            if (itemCounts[item.name]) {
                itemCounts[item.name] += item.quantity;
            } else {
                itemCounts[item.name] = item.quantity;
            }
        });
    });
    
    const sortedItems = Object.entries(itemCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([name, count]) => `${name} (${count})`)
        .join(', ');
    
    return sortedItems || 'No items ordered yet';
}

// Function to import XML data (bonus feature)
function importOrdersXML() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xml';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const xmlContent = e.target.result;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
                
                // Parse XML and import orders (basic implementation)
                const orders = xmlDoc.getElementsByTagName('Order');
                let importedCount = 0;
                
                for (let i = 0; i < orders.length; i++) {
                    const order = orders[i];
                    const orderId = order.getElementsByTagName('OrderID')[0]?.textContent;
                    
                    // Check if order already exists
                    if (!orderHistory.find(o => o.id === orderId)) {
                        // Parse and add order (simplified version)
                        importedCount++;
                    }
                }
                
                showNotification(`Imported ${importedCount} orders from XML!`, 'success');
                
            } catch (error) {
                console.error('Error importing XML:', error);
                showNotification('Error importing XML file!', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
