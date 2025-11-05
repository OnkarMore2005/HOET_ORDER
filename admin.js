// Admin Panel JavaScript
// Global Variables
let adminAuthenticated = false;
let orderHistory = [];
let currentAdmin = null;

// Admin Credentials (In production, this should be server-side)
const ADMIN_CREDENTIALS = {
    admin: 'admin123',
    manager: 'manager123'
};

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    setupEventListeners();
    loadOrderData();
    checkAuthentication();
}

function setupEventListeners() {
    // Admin login form
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    
    // Navigation clicks
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Menu item forms
    document.getElementById('addMenuItemForm').addEventListener('submit', handleAddMenuItem);
    document.getElementById('editMenuItemForm').addEventListener('submit', handleEditMenuItem);
}

function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        adminAuthenticated = true;
        showAdminDashboard();
    } else {
        showLoginSection();
    }
}

// Authentication Functions
function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (ADMIN_CREDENTIALS[username] && ADMIN_CREDENTIALS[username] === password) {
        adminAuthenticated = true;
        currentAdmin = username;
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUser', username);
        showAdminDashboard();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

function logout() {
    adminAuthenticated = false;
    currentAdmin = null;
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    showLoginSection();
    showNotification('Logged out successfully!', 'success');
}

function showLoginSection() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showAdminDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadOrderData();
    updateDashboard();
}

// Data Management Functions
function loadOrderData() {
    // Load order data from localStorage (same as customer app)
    const savedOrders = localStorage.getItem('orderHistory');
    orderHistory = savedOrders ? JSON.parse(savedOrders) : [];
    
    // If no orders in localStorage, create some sample data for demo
    if (orderHistory.length === 0) {
        createSampleData();
    }
}

function createSampleData() {
    // Create sample orders for demonstration
    const sampleOrders = [
        {
            id: 'SG001234ABCD',
            customer: {
                name: 'John Doe',
                mobile: '9876543210',
                email: 'john@example.com',
                table: '5'
            },
            items: [
                { id: 5, name: 'Butter Chicken', price: 320, quantity: 2, image: '🍗' },
                { id: 17, name: 'Naan', price: 25, quantity: 4, image: '🥖' }
            ],
            total: 740,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        },
        {
            id: 'SG001235EFGH',
            customer: {
                name: 'Jane Smith',
                mobile: '9876543211',
                email: 'jane@example.com',
                table: '3'
            },
            items: [
                { id: 9, name: 'Chicken Biryani', price: 350, quantity: 1, image: '🍚' },
                { id: 25, name: 'Masala Chai', price: 30, quantity: 2, image: '☕' }
            ],
            total: 410,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            status: 'preparing'
        },
        {
            id: 'SG001236IJKL',
            customer: {
                name: 'Mike Johnson',
                mobile: '9876543212',
                email: 'mike@example.com',
                table: '8'
            },
            items: [
                { id: 1, name: 'Samosa', price: 45, quantity: 3, image: '🍛' },
                { id: 21, name: 'Gulab Jamun', price: 80, quantity: 2, image: '🍯' }
            ],
            total: 295,
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            status: 'placed'
        }
    ];
    
    orderHistory = sampleOrders;
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
}

// Navigation Functions
function showSection(sectionName) {
    // Hide all content sections
    document.querySelectorAll('.admin-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + 'Content').style.display = 'block';
    
    // Add active class to clicked nav item
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'customers':
            loadCustomersTable();
            break;
        case 'menu':
            loadMenuItems();
            break;
    }
}

// Dashboard Functions
function updateDashboard() {
    updateStats();
    loadRecentOrders();
    loadTopItems();
}

function updateStats() {
    const totalOrders = orderHistory.length;
    const totalRevenue = orderHistory.reduce((sum, order) => sum + order.total, 0);
    const uniqueCustomers = new Set(orderHistory.map(order => order.customer.email)).size;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue}`;
    document.getElementById('totalCustomers').textContent = uniqueCustomers;
    document.getElementById('avgOrderValue').textContent = `₹${avgOrderValue.toFixed(2)}`;
}

function loadRecentOrders() {
    const recentOrders = orderHistory.slice(0, 5);
    const recentOrdersContainer = document.getElementById('recentOrders');
    
    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = '<p style="text-align: center; color: #666;">No recent orders</p>';
        return;
    }
    
    recentOrdersContainer.innerHTML = recentOrders.map(order => `
        <div class="recent-order-item">
            <div class="order-info">
                <h4>${order.id}</h4>
                <p>${order.customer.name} - Table ${order.customer.table}</p>
                <p>₹${order.total} - ${order.status}</p>
            </div>
            <div class="order-time">
                ${new Date(order.timestamp).toLocaleTimeString()}
            </div>
        </div>
    `).join('');
}

function loadTopItems() {
    const itemCounts = {};
    
    orderHistory.forEach(order => {
        order.items.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
    });
    
    const topItems = Object.entries(itemCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const topItemsContainer = document.getElementById('topItems');
    
    if (topItems.length === 0) {
        topItemsContainer.innerHTML = '<p style="text-align: center; color: #666;">No items ordered yet</p>';
        return;
    }
    
    topItemsContainer.innerHTML = topItems.map(([name, count]) => `
        <div class="top-item">
            <span class="item-name">${name}</span>
            <span class="item-count">${count}</span>
        </div>
    `).join('');
}

// Orders Management Functions
function loadOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    
    if (orderHistory.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No orders found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = orderHistory.map(order => {
        const orderDate = new Date(order.timestamp);
        const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        return `
            <tr>
                <td>${order.id}</td>
                <td>${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}</td>
                <td>${order.customer.name}</td>
                <td>${order.customer.table}</td>
                <td>${totalQuantity} items</td>
                <td>₹${order.total}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="generateOrderReceipt('${order.id}')">
                        <i class="fas fa-receipt"></i> Receipt
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewOrderDetails(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) return;
    
    const orderDate = new Date(order.timestamp);
    
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    orderDetailsContent.innerHTML = `
        <div class="order-details-section">
            <h4>Order Information</h4>
            <div class="detail-row">
                <span><strong>Order ID:</strong></span>
                <span>${order.id}</span>
            </div>
            <div class="detail-row">
                <span><strong>Date & Time:</strong></span>
                <span>${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}</span>
            </div>
            <div class="detail-row">
                <span><strong>Status:</strong></span>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
        </div>
        
        <div class="order-details-section">
            <h4>Customer Information</h4>
            <div class="detail-row">
                <span><strong>Name:</strong></span>
                <span>${order.customer.name}</span>
            </div>
            <div class="detail-row">
                <span><strong>Mobile:</strong></span>
                <span>${order.customer.mobile}</span>
            </div>
            <div class="detail-row">
                <span><strong>Email:</strong></span>
                <span>${order.customer.email}</span>
            </div>
            <div class="detail-row">
                <span><strong>Table:</strong></span>
                <span>${order.customer.table}</span>
            </div>
        </div>
        
        <div class="order-details-section">
            <h4>Order Items</h4>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>₹${item.price}</td>
                            <td>₹${item.quantity * item.price}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="order-details-section">
            <h4>Order Summary</h4>
            <div class="detail-row total-row">
                <span><strong>Total Amount:</strong></span>
                <span><strong>₹${order.total}</strong></span>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailsModal').classList.add('show');
}

function closeOrderDetailsModal() {
    document.getElementById('orderDetailsModal').classList.remove('show');
}

function updateOrderStatus(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) return;
    
    const statuses = ['placed', 'preparing', 'ready', 'completed'];
    const currentIndex = statuses.indexOf(order.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    
    order.status = statuses[nextIndex];
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    loadOrdersTable();
    showNotification(`Order status updated to ${order.status}`, 'success');
}

// Analytics Functions
function loadAnalytics() {
    loadRevenueChart();
    loadPopularItems();
    loadCustomerAnalytics();
}

function loadRevenueChart() {
    const revenueChart = document.getElementById('revenueChart');
    
    // Group orders by date
    const dailyRevenue = {};
    orderHistory.forEach(order => {
        const date = new Date(order.timestamp).toLocaleDateString();
        dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
    });
    
    const chartData = Object.entries(dailyRevenue)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .slice(-7); // Last 7 days
    
    if (chartData.length === 0) {
        revenueChart.innerHTML = '<p style="text-align: center; color: #666;">No revenue data available</p>';
        return;
    }
    
    revenueChart.innerHTML = chartData.map(([date, revenue]) => `
        <div class="revenue-item">
            <span class="revenue-date">${date}</span>
            <div class="revenue-bar">
                <div class="revenue-fill" style="width: ${(revenue / Math.max(...chartData.map(([,r]) => r))) * 100}%"></div>
            </div>
            <span class="revenue-amount">₹${revenue}</span>
        </div>
    `).join('');
}

function loadPopularItems() {
    const itemCounts = {};
    
    orderHistory.forEach(order => {
        order.items.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
    });
    
    const popularItems = Object.entries(itemCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    const popularItemsContainer = document.getElementById('popularItems');
    
    if (popularItems.length === 0) {
        popularItemsContainer.innerHTML = '<p style="text-align: center; color: #666;">No items ordered yet</p>';
        return;
    }
    
    popularItemsContainer.innerHTML = popularItems.map(([name, count], index) => `
        <div class="popular-item">
            <span class="item-rank">#${index + 1}</span>
            <span class="item-name">${name}</span>
            <span class="item-count">${count} orders</span>
        </div>
    `).join('');
}

function loadCustomerAnalytics() {
    const customerAnalytics = document.getElementById('customerAnalytics');
    
    const customerStats = {
        totalCustomers: new Set(orderHistory.map(order => order.customer.email)).size,
        repeatCustomers: 0,
        averageOrdersPerCustomer: 0
    };
    
    // Calculate repeat customers
    const customerOrderCounts = {};
    orderHistory.forEach(order => {
        customerOrderCounts[order.customer.email] = (customerOrderCounts[order.customer.email] || 0) + 1;
    });
    
    customerStats.repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
    customerStats.averageOrdersPerCustomer = orderHistory.length / customerStats.totalCustomers;
    
    customerAnalytics.innerHTML = `
        <div class="analytics-stat">
            <span class="stat-label">Total Customers</span>
            <span class="stat-value">${customerStats.totalCustomers}</span>
        </div>
        <div class="analytics-stat">
            <span class="stat-label">Repeat Customers</span>
            <span class="stat-value">${customerStats.repeatCustomers}</span>
        </div>
        <div class="analytics-stat">
            <span class="stat-label">Avg Orders per Customer</span>
            <span class="stat-value">${customerStats.averageOrdersPerCustomer.toFixed(1)}</span>
        </div>
    `;
}

// Customers Management Functions
function loadCustomersTable() {
    const customersData = {};
    
    orderHistory.forEach(order => {
        const email = order.customer.email;
        if (!customersData[email]) {
            customersData[email] = {
                name: order.customer.name,
                mobile: order.customer.mobile,
                email: email,
                orders: 0,
                totalSpent: 0,
                lastOrder: order.timestamp
            };
        }
        customersData[email].orders++;
        customersData[email].totalSpent += order.total;
        if (new Date(order.timestamp) > new Date(customersData[email].lastOrder)) {
            customersData[email].lastOrder = order.timestamp;
        }
    });
    
    const customers = Object.values(customersData);
    const tableBody = document.getElementById('customersTableBody');
    
    if (customers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No customers found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.mobile}</td>
            <td>${customer.email}</td>
            <td>${customer.orders}</td>
            <td>₹${customer.totalSpent}</td>
            <td>${new Date(customer.lastOrder).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="generateCustomerReceipt('${customer.email}')">
                    <i class="fas fa-receipt"></i> Receipt
                </button>
            </td>
        </tr>
    `).join('');
}

function viewCustomerOrders(customerEmail) {
    const customerOrders = orderHistory.filter(order => order.customer.email === customerEmail);
    
    if (customerOrders.length === 0) {
        showNotification('No orders found for this customer', 'info');
        return;
    }
    
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    orderDetailsContent.innerHTML = `
        <div class="order-details-section">
            <h4>Customer Orders - ${customerOrders[0].customer.name}</h4>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${customerOrders.map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>${new Date(order.timestamp).toLocaleDateString()}</td>
                            <td>${order.items.length} items</td>
                            <td>₹${order.total}</td>
                            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('orderDetailsModal').classList.add('show');
}

// Menu Management Functions
function loadMenuItems() {
    // Sample menu items (same as customer app)
    const menuItems = [
        { id: 1, name: 'Samosa', price: 45, category: 'appetizers', image: '🍛' },
        { id: 2, name: 'Pakora', price: 55, category: 'appetizers', image: '🥗' },
        { id: 5, name: 'Butter Chicken', price: 320, category: 'mains', image: '🍗' },
        { id: 9, name: 'Chicken Biryani', price: 350, category: 'biryani', image: '🍚' },
        { id: 17, name: 'Naan', price: 25, category: 'breads', image: '🥖' },
        { id: 21, name: 'Gulab Jamun', price: 80, category: 'desserts', image: '🍯' }
    ];
    
    const menuItemsGrid = document.getElementById('menuItemsGrid');
    menuItemsGrid.innerHTML = menuItems.map(item => `
        <div class="menu-item-card">
            <div class="menu-item-image">
                <span style="font-size: 3rem;">${item.image}</span>
            </div>
            <div class="menu-item-content">
                <h4>${item.name}</h4>
                <p>Category: ${item.category}</p>
                <div class="menu-item-footer">
                    <span class="price">₹${item.price}</span>
                    <button class="btn btn-warning btn-sm" onclick="editMenuItem(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Receipt Generation Functions
function generateOrderReceipt(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) return;
    
    const orderDate = new Date(order.timestamp);
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    
    orderDetailsContent.innerHTML = `
        <div class="receipt-content">
            <div class="receipt-header">
                <h2>🍽️ SPICE GARDEN</h2>
                <p>Digital Restaurant Receipt</p>
                <p>123 Food Street, City - 123456</p>
                <p>Phone: +91 98765 43210</p>
            </div>
            
            <div class="receipt-details">
                <div class="detail-row">
                    <span><strong>Order ID:</strong></span>
                    <span>${order.id}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Date & Time:</strong></span>
                    <span>${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Customer Name:</strong></span>
                    <span>${order.customer.name}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Mobile:</strong></span>
                    <span>${order.customer.mobile}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Email:</strong></span>
                    <span>${order.customer.email}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Table Number:</strong></span>
                    <span>${order.customer.table}</span>
                </div>
            </div>
            
            <div class="receipt-items">
                <h3>Order Items:</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>₹${item.price}</td>
                                <td>₹${item.quantity * item.price}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="detail-row total-row">
                <span><strong>TOTAL AMOUNT:</strong></span>
                <span><strong>₹${order.total}</strong></span>
            </div>
            
            <div class="receipt-footer">
                <p>Thank you for dining with us!</p>
                <p>Visit us again for more delicious meals</p>
                <p>GST Included | Service Charge Included</p>
            </div>
            
            <div class="receipt-actions" style="margin-top: 20px; text-align: center;">
                <button class="btn btn-info" onclick="printReceipt()">
                    <i class="fas fa-print"></i> Print Receipt
                </button>
                <button class="btn btn-success" onclick="downloadReceiptPDF()">
                    <i class="fas fa-download"></i> Download PDF
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailsModal').classList.add('show');
}

function generateCustomerReceipt(customerEmail) {
    const customerOrders = orderHistory.filter(order => order.customer.email === customerEmail);
    
    if (customerOrders.length === 0) {
        showNotification('No orders found for this customer', 'info');
        return;
    }
    
    const customer = customerOrders[0].customer;
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
    
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    orderDetailsContent.innerHTML = `
        <div class="receipt-content">
            <div class="receipt-header">
                <h2>🍽️ SPICE GARDEN</h2>
                <p>Customer Summary Receipt</p>
                <p>123 Food Street, City - 123456</p>
                <p>Phone: +91 98765 43210</p>
            </div>
            
            <div class="receipt-details">
                <div class="detail-row">
                    <span><strong>Customer Name:</strong></span>
                    <span>${customer.name}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Mobile:</strong></span>
                    <span>${customer.mobile}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Email:</strong></span>
                    <span>${customer.email}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Total Orders:</strong></span>
                    <span>${customerOrders.length}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Total Spent:</strong></span>
                    <span><strong>₹${totalSpent}</strong></span>
                </div>
            </div>
            
            <div class="receipt-items">
                <h3>Order History:</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${customerOrders.map(order => `
                            <tr>
                                <td>${order.id}</td>
                                <td>${new Date(order.timestamp).toLocaleDateString()}</td>
                                <td>${order.items.length} items</td>
                                <td>₹${order.total}</td>
                                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="receipt-footer">
                <p>Thank you for being a valued customer!</p>
                <p>We appreciate your business</p>
            </div>
            
            <div class="receipt-actions" style="margin-top: 20px; text-align: center;">
                <button class="btn btn-info" onclick="printReceipt()">
                    <i class="fas fa-print"></i> Print Receipt
                </button>
                <button class="btn btn-success" onclick="downloadReceiptPDF()">
                    <i class="fas fa-download"></i> Download PDF
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailsModal').classList.add('show');
}

function printReceipt() {
    const receiptContent = document.querySelector('.receipt-content').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt</title>
            <style>
                body { font-family: 'Courier New', monospace; margin: 20px; }
                .receipt-header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 20px; margin-bottom: 20px; }
                .receipt-header h2 { color: #e74c3c; font-size: 1.8rem; margin-bottom: 5px; }
                .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; border-bottom: 1px dotted #ccc; }
                .detail-row.total-row { border-top: 2px solid #333; border-bottom: 2px solid #333; font-weight: bold; font-size: 1.1rem; margin-top: 15px; padding-top: 15px; }
                .items-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                .items-table th, .items-table td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; }
                .items-table th { background: #f8f9fa; font-weight: 600; }
                .receipt-footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #333; color: #666; font-size: 0.9rem; }
                .receipt-actions { display: none; }
            </style>
        </head>
        <body>${receiptContent}</body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

function downloadReceiptPDF() {
    showNotification('PDF download feature coming soon!', 'info');
}

// Menu Management Functions
let menuItems = [
    { id: 1, name: 'Samosa', price: 45, category: 'appetizers', description: 'Crispy fried pastry filled with spiced potatoes and peas', image: '🍛' },
    { id: 2, name: 'Pakora', price: 55, category: 'appetizers', description: 'Deep-fried vegetables coated in chickpea flour batter', image: '🥗' },
    { id: 5, name: 'Butter Chicken', price: 320, category: 'mains', description: 'Tender chicken in rich tomato and cream sauce', image: '🍗' },
    { id: 9, name: 'Chicken Biryani', price: 350, category: 'biryani', description: 'Fragrant basmati rice with spiced chicken and saffron', image: '🍚' },
    { id: 17, name: 'Naan', price: 25, category: 'breads', description: 'Soft leavened bread baked in tandoor', image: '🥖' },
    { id: 21, name: 'Gulab Jamun', price: 80, category: 'desserts', description: 'Soft milk dumplings in rose-flavored syrup', image: '🍯' }
];

function showAddMenuItemModal() {
    document.getElementById('addMenuItemModal').classList.add('show');
}

function closeAddMenuItemModal() {
    document.getElementById('addMenuItemModal').classList.remove('show');
    document.getElementById('addMenuItemForm').reset();
}

function handleAddMenuItem(e) {
    e.preventDefault();
    
    const newItem = {
        id: Math.max(...menuItems.map(item => item.id)) + 1,
        name: document.getElementById('itemName').value,
        price: parseInt(document.getElementById('itemPrice').value),
        category: document.getElementById('itemCategory').value,
        description: document.getElementById('itemDescription').value,
        image: document.getElementById('itemEmoji').value || '🍽️'
    };
    
    menuItems.push(newItem);
    loadMenuItems();
    closeAddMenuItemModal();
    showNotification('Menu item added successfully!', 'success');
}

function editMenuItem(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemPrice').value = item.price;
    document.getElementById('editItemCategory').value = item.category;
    document.getElementById('editItemDescription').value = item.description;
    document.getElementById('editItemEmoji').value = item.image;
    
    document.getElementById('editMenuItemModal').classList.add('show');
}

function closeEditMenuItemModal() {
    document.getElementById('editMenuItemModal').classList.remove('show');
    document.getElementById('editMenuItemForm').reset();
}

function handleEditMenuItem(e) {
    e.preventDefault();
    
    const itemId = parseInt(document.getElementById('editItemId').value);
    const item = menuItems.find(i => i.id === itemId);
    
    if (item) {
        item.name = document.getElementById('editItemName').value;
        item.price = parseInt(document.getElementById('editItemPrice').value);
        item.category = document.getElementById('editItemCategory').value;
        item.description = document.getElementById('editItemDescription').value;
        item.image = document.getElementById('editItemEmoji').value || '🍽️';
        
        loadMenuItems();
        closeEditMenuItemModal();
        showNotification('Menu item updated successfully!', 'success');
    }
}

function deleteMenuItem() {
    const itemId = parseInt(document.getElementById('editItemId').value);
    const itemIndex = menuItems.findIndex(i => i.id === itemId);
    
    if (itemIndex > -1) {
        menuItems.splice(itemIndex, 1);
        loadMenuItems();
        closeEditMenuItemModal();
        showNotification('Menu item deleted successfully!', 'success');
    }
}

// Report Generation Functions
function generateReport() {
    const reportData = {
        totalOrders: orderHistory.length,
        totalRevenue: orderHistory.reduce((sum, order) => sum + order.total, 0),
        totalCustomers: new Set(orderHistory.map(order => order.customer.email)).size,
        averageOrderValue: orderHistory.reduce((sum, order) => sum + order.total, 0) / orderHistory.length,
        topItems: getTopItemsForReport(),
        revenueByDay: getRevenueByDay()
    };
    
    const reportContent = `
        <h2>Restaurant Performance Report</h2>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Generated by:</strong> ${currentAdmin}</p>
        
        <h3>Summary Statistics</h3>
        <ul>
            <li>Total Orders: ${reportData.totalOrders}</li>
            <li>Total Revenue: ₹${reportData.totalRevenue}</li>
            <li>Total Customers: ${reportData.totalCustomers}</li>
            <li>Average Order Value: ₹${reportData.averageOrderValue.toFixed(2)}</li>
        </ul>
        
        <h3>Top Items</h3>
        <ol>
            ${reportData.topItems.map(item => `<li>${item.name}: ${item.count} orders</li>`).join('')}
        </ol>
        
        <h3>Revenue by Day (Last 7 days)</h3>
        <ul>
            ${reportData.revenueByDay.map(day => `<li>${day.date}: ₹${day.revenue}</li>`).join('')}
        </ul>
    `;
    
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    orderDetailsContent.innerHTML = reportContent;
    
    document.getElementById('orderDetailsModal').classList.add('show');
    showNotification('Report generated successfully!', 'success');
}

function getTopItemsForReport() {
    const itemCounts = {};
    
    orderHistory.forEach(order => {
        order.items.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
    });
    
    return Object.entries(itemCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
}

function getRevenueByDay() {
    const dailyRevenue = {};
    
    orderHistory.forEach(order => {
        const date = new Date(order.timestamp).toLocaleDateString();
        dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
    });
    
    return Object.entries(dailyRevenue)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .slice(-7)
        .map(([date, revenue]) => ({ date, revenue }));
}

function exportAnalytics() {
    try {
        const wb = XLSX.utils.book_new();
        
        // Analytics Summary
        const analyticsData = [];
        analyticsData.push(['Analytics Report', new Date().toLocaleDateString()]);
        analyticsData.push(['Generated By', currentAdmin]);
        analyticsData.push(['']);
        analyticsData.push(['Metric', 'Value']);
        analyticsData.push(['Total Orders', orderHistory.length]);
        analyticsData.push(['Total Revenue', orderHistory.reduce((sum, order) => sum + order.total, 0)]);
        analyticsData.push(['Total Customers', new Set(orderHistory.map(order => order.customer.email)).size]);
        analyticsData.push(['Average Order Value', orderHistory.reduce((sum, order) => sum + order.total, 0) / orderHistory.length]);
        
        // Popular Items
        analyticsData.push(['']);
        analyticsData.push(['Popular Items']);
        const itemCounts = {};
        orderHistory.forEach(order => {
            order.items.forEach(item => {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
            });
        });
        
        const popularItems = Object.entries(itemCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        popularItems.forEach(([name, count]) => {
            analyticsData.push([name, count]);
        });
        
        const analyticsWS = XLSX.utils.aoa_to_sheet(analyticsData);
        XLSX.utils.book_append_sheet(wb, analyticsWS, 'Analytics');
        
        const filename = `Analytics-Report-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        showNotification('Analytics exported successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting analytics:', error);
        showNotification('Error exporting analytics!', 'error');
    }
}

function exportRevenueReport() {
    try {
        const wb = XLSX.utils.book_new();
        
        // Revenue by Day
        const dailyRevenue = {};
        orderHistory.forEach(order => {
            const date = new Date(order.timestamp).toLocaleDateString();
            dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
        });
        
        const revenueData = [];
        revenueData.push(['Date', 'Revenue']);
        Object.entries(dailyRevenue)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .forEach(([date, revenue]) => {
                revenueData.push([date, revenue]);
            });
        
        const revenueWS = XLSX.utils.aoa_to_sheet(revenueData);
        XLSX.utils.book_append_sheet(wb, revenueWS, 'Revenue Report');
        
        const filename = `Revenue-Report-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        showNotification('Revenue report exported successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting revenue report:', error);
        showNotification('Error exporting revenue report!', 'error');
    }
}

function exportMenuReport() {
    try {
        const wb = XLSX.utils.book_new();
        
        const menuData = [];
        menuData.push(['Menu Items Report']);
        menuData.push(['Generated By', currentAdmin]);
        menuData.push(['Generated On', new Date().toLocaleDateString()]);
        menuData.push(['']);
        menuData.push(['Item ID', 'Name', 'Price', 'Category', 'Description']);
        
        menuItems.forEach(item => {
            menuData.push([
                item.id,
                item.name,
                item.price,
                item.category,
                item.description
            ]);
        });
        
        const menuWS = XLSX.utils.aoa_to_sheet(menuData);
        XLSX.utils.book_append_sheet(wb, menuWS, 'Menu Items');
        
        const filename = `Menu-Report-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        showNotification('Menu report exported successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting menu report:', error);
        showNotification('Error exporting menu report!', 'error');
    }
}

function addMenuItem() {
    showNotification('Add menu item feature coming soon!', 'info');
}

// Search and Filter Functions
function searchOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#ordersTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('#ordersTableBody tr');
    
    rows.forEach(row => {
        if (statusFilter === 'all') {
            row.style.display = '';
        } else {
            const statusCell = row.querySelector('.status-badge');
            const status = statusCell ? statusCell.textContent.trim() : '';
            row.style.display = status === statusFilter ? '' : 'none';
        }
    });
}

function searchCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#customersTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Export Functions
function exportAllData() {
    if (orderHistory.length === 0) {
        showNotification('No data to export!', 'error');
        return;
    }
    
    try {
        const wb = XLSX.utils.book_new();
        
        // Orders sheet
        const ordersData = [];
        ordersData.push([
            'Order ID', 'Date', 'Time', 'Customer Name', 'Mobile', 'Email', 
            'Table Number', 'Total Items', 'Total Amount', 'Status'
        ]);
        
        orderHistory.forEach(order => {
            const orderDate = new Date(order.timestamp);
            const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
            
            ordersData.push([
                order.id,
                orderDate.toLocaleDateString(),
                orderDate.toLocaleTimeString(),
                order.customer.name,
                order.customer.mobile,
                order.customer.email,
                order.customer.table,
                totalQuantity,
                order.total,
                order.status
            ]);
        });
        
        // Items sheet
        const itemsData = [];
        itemsData.push([
            'Order ID', 'Item ID', 'Item Name', 'Quantity', 'Unit Price', 'Item Total'
        ]);
        
        orderHistory.forEach(order => {
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
        
        // Summary sheet
        const summaryData = [];
        const totalRevenue = orderHistory.reduce((sum, order) => sum + order.total, 0);
        const avgOrderValue = totalRevenue / orderHistory.length;
        const uniqueCustomers = new Set(orderHistory.map(order => order.customer.email)).size;
        
        summaryData.push(['Admin Export Summary']);
        summaryData.push(['']);
        summaryData.push(['Export Date', new Date().toLocaleDateString()]);
        summaryData.push(['Exported By', currentAdmin]);
        summaryData.push(['Total Orders', orderHistory.length]);
        summaryData.push(['Total Revenue', `₹${totalRevenue}`]);
        summaryData.push(['Average Order Value', `₹${avgOrderValue.toFixed(2)}`]);
        summaryData.push(['Total Customers', uniqueCustomers]);
        
        const ordersWS = XLSX.utils.aoa_to_sheet(ordersData);
        const itemsWS = XLSX.utils.aoa_to_sheet(itemsData);
        const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
        
        XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
        XLSX.utils.book_append_sheet(wb, ordersWS, 'Orders');
        XLSX.utils.book_append_sheet(wb, itemsWS, 'Order Items');
        
        const filename = `Spice-Garden-Admin-Export-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        showNotification('Data exported successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Error exporting data!', 'error');
    }
}

function generateReport() {
    showNotification('Report generation feature coming soon!', 'info');
}

function exportAnalytics() {
    showNotification('Analytics export feature coming soon!', 'info');
}

function refreshData() {
    loadOrderData();
    updateDashboard();
    showNotification('Data refreshed successfully!', 'success');
}

// Utility Functions
function showNotification(message, type = 'info') {
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for additional styling
const additionalStyles = `
    <style>
        .status-badge {
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 500;
            text-transform: capitalize;
        }
        
        .status-placed { background: #f39c12; color: white; }
        .status-preparing { background: #3498db; color: white; }
        .status-ready { background: #2ecc71; color: white; }
        .status-completed { background: #27ae60; color: white; }
        
        .recent-order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .recent-order-item:last-child {
            border-bottom: none;
        }
        
        .order-info h4 {
            font-size: 1rem;
            margin-bottom: 5px;
            color: #2c3e50;
        }
        
        .order-info p {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin: 2px 0;
        }
        
        .order-time {
            font-size: 0.9rem;
            color: #7f8c8d;
        }
        
        .top-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .top-item:last-child {
            border-bottom: none;
        }
        
        .item-name {
            font-weight: 500;
            color: #2c3e50;
        }
        
        .item-count {
            background: #e74c3c;
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 0.8rem;
        }
        
        .order-details-section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .order-details-section:last-child {
            border-bottom: none;
        }
        
        .order-details-section h4 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
        }
        
        .detail-row.total-row {
            font-size: 1.1rem;
            border-top: 2px solid #e74c3c;
            padding-top: 15px;
            margin-top: 15px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        .items-table th,
        .items-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        .items-table th {
            background: #f8f9fa;
            font-weight: 600;
        }
        
        .revenue-item {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .revenue-date {
            width: 80px;
            font-size: 0.9rem;
            color: #7f8c8d;
        }
        
        .revenue-bar {
            flex: 1;
            height: 20px;
            background: #ecf0f1;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .revenue-fill {
            height: 100%;
            background: linear-gradient(45deg, #e74c3c, #f39c12);
            transition: width 0.3s ease;
        }
        
        .revenue-amount {
            width: 80px;
            text-align: right;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .popular-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .popular-item:last-child {
            border-bottom: none;
        }
        
        .item-rank {
            width: 30px;
            height: 30px;
            background: #e74c3c;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .analytics-stat {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }
        
        .analytics-stat:last-child {
            border-bottom: none;
        }
        
        .stat-label {
            font-weight: 500;
            color: #7f8c8d;
        }
        
        .stat-value {
            font-weight: 600;
            font-size: 1.1rem;
            color: #2c3e50;
        }
        
        .btn-sm {
            padding: 5px 10px;
            font-size: 0.8rem;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
