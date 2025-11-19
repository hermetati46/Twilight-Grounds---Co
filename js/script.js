document.addEventListener('DOMContentLoaded', () => {

    /* Interactive Accordion (About Page) */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;
            
            header.classList.toggle('active');

            if (accordionContent.style.maxHeight) {
                accordionContent.style.maxHeight = null;
                accordionContent.style.padding = '0 1.5rem';
            } else {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                accordionContent.style.padding = '0 1.5rem';
            } 
        });
    });

    /* Gallery Lightbox (Index Page) */
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        const modalImg = document.getElementById('lightbox-image');
        const modalCaption = document.getElementById('lightbox-caption');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const closeBtn = document.querySelector('.lightbox-close');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                modal.style.display = 'block';
                modalImg.src = img.dataset.full;
                modalCaption.textContent = img.dataset.caption;
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    /* Interactive Map (Contact Page) */
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const mapCoords = [-33.931754, 18.423214];
        
        const map = L.map('map').setView(mapCoords, 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(mapCoords).addTo(map)
            .bindPopup('<b>Twilight Grounds & Co.</b><br>123 Coffee Lane')
            .openPopup();
    }

    /* Dynamic Menu & Filtering (Menu Page) */
    const menuGrid = document.getElementById('menu-grid');
    if (menuGrid) {
        // Menu Data
        const menuItems = [
            { id: 1, name: 'Espresso', description: 'A rich and aromatic shot of our signature house blend.', price: 25, category: 'Coffee' },
            { id: 2, name: 'Cappuccino', description: 'Espresso with steamed milk and a deep layer of foam.', price: 32, category: 'Coffee' },
            { id: 3, name: 'Latte', description: 'Rich espresso with steamed milk and a light layer of foam.', price: 35, category: 'Coffee' },
            { id: 4, name: 'Rooibos Tea', description: 'A classic South African herbal tea, naturally caffeine-free.', price: 22, category: 'Tea & Other' },
            { id: 5, name: 'Chai Latte', description: 'Sweetly spiced tea with steamed milk for a creamy treat.', price: 38, category: 'Tea & Other' },
            { id: 6, name: 'Hot Chocolate', description: 'Rich, decadent chocolate blended with steamed milk.', price: 35, category: 'Tea & Other' },
            { id: 7, name: 'Butter Croissant', description: 'Flaky, buttery, and baked fresh every morning.', price: 28, category: 'Pastries & Bakes' },
            { id: 8, name: 'Cinnamon Roll', description: 'Soft, gooey, and topped with a cream cheese frosting.', price: 38, category: 'Pastries & Bakes' },
            { id: 9, name: 'Chocolate Chip Cookie', description: 'A classic, made with brown butter and dark chocolate chunks.', price: 22, category: 'Pastries & Bakes' },
            { id: 10, name: 'Chicken Mayo', description: 'Creamy chicken mayonnaise on your choice of bread.', price: 55, category: 'Sandwiches' },
            { id: 11, name: 'Caprese', description: 'Mozzarella, tomato, and basil pesto on ciabatta.', price: 60, category: 'Sandwiches' },
            { id: 12, name: 'Toasted Cheese', description: 'A classic toasted cheese sandwich, simple and delicious.', price: 40, category: 'Sandwiches' }
        ];

        // Render Function
        function renderMenu(itemsToRender) {
            const categories = {};
            itemsToRender.forEach(item => {
                if (!categories[item.category]) {
                    categories[item.category] = [];
                }
                categories[item.category].push(item);
            });

            menuGrid.innerHTML = '';

            // If no items, show message
            if (Object.keys(categories).length === 0) {
                menuGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No menu items match your search.</p>';
                return;
            }

            // Create HTML for each category
            for (const category in categories) {
                const categoryEl = document.createElement('div');
                categoryEl.className = 'menu-category';

                let itemsHtml = categories[category].map(item => `
                    <li class="menu-item">
                        <div class="menu-item-details">
                            <strong>${item.name}</strong>
                            <p>${item.description}</p>
                        </div>
                        <span class="menu-item-price">R${item.price}</span>
                    </li>
                `).join('');

                categoryEl.innerHTML = `
                    <h3>${category}</h3>
                    <ul>${itemsHtml}</ul>
                `;
                menuGrid.appendChild(categoryEl);
            }
        }

        // Filter/Search Function
        function filterAndRender() {
            const searchTerm = document.getElementById('search-bar').value.toLowerCase();
            const categoryFilter = document.getElementById('category-filter').value;

            const filteredItems = menuItems.filter(item => {
                const matchesSearch = item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm);
                const matchesCategory = (categoryFilter === 'all') || (item.category === categoryFilter);
                return matchesSearch && matchesCategory;
            });

            renderMenu(filteredItems);
        }

        // Event Listeners
        document.getElementById('search-bar').addEventListener('input', filterAndRender);
        document.getElementById('category-filter').addEventListener('change', filterAndRender);

        // Initial Render
        renderMenu(menuItems);
    }

    /* Contact Form Validation & Submission (Contact Page) */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default page reload
            
            // Get elements
            const name = document.getElementById('contact-name');
            const email = document.getElementById('contact-email');
            const message = document.getElementById('contact-message');
            const statusEl = document.getElementById('contact-form-status');

            // Reset errors
            resetError(name);
            resetError(email);
            resetError(message);
            statusEl.style.display = 'none';

            let isValid = true;

            // Validate Name
            if (name.value.trim().length < 2) {
                setError(name, 'Name must be at least 2 characters long.');
                isValid = false;
            }

            // Validate Email
            if (!isValidEmail(email.value)) {
                setError(email, 'Please enter a valid email address.');
                isValid = false;
            }

            // Validate Message
            if (message.value.trim().length < 10) {
                setError(message, 'Message must be at least 10 characters long.');
                isValid = false;
            }

            // Process if valid
            if (isValid) {
                // AJAX simulation
                const subject = "Contact Form Enquiry from " + name.value;
                const body = `Name: ${name.value}\nEmail: ${email.value}\n\nMessage:\n${message.value}`;
                
                // Trigger mailto link
                window.location.href = `mailto:hello@twilightgrounds.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                // Show success message
                statusEl.textContent = 'Thank you! Your message has been prepared. Please send it using your email app.';
                statusEl.className = 'form-status success';
                statusEl.style.display = 'block';

                contactForm.reset();
            } else {
                // Show failure message
                statusEl.textContent = 'Please correct the errors in the form.';
                statusEl.className = 'form-status error';
                statusEl.style.display = 'block';
            }
        });
    }

    /* Feature 6: Pre-Order Form Validation & Summary (Pre-Order Page) */
    const orderForm = document.getElementById('pre-order-form');
    if (orderForm) {
        const summaryItemsEl = document.getElementById('summary-items');
        const summaryTotalEl = document.getElementById('summary-total');
        const allItemCheckboxes = orderForm.querySelectorAll('input[name="item"]');

        allItemCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateOrderSummary);
        });

        function updateOrderSummary() {
            let total = 0;
            let itemsHtml = '';

            allItemCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const price = parseFloat(checkbox.dataset.price);
                    const name = checkbox.value;
                    total += price;
                    itemsHtml += `<p><strong>${name}</strong> - R${price.toFixed(2)}</p>`;
                }
            });

            if (total === 0) {
                summaryItemsEl.innerHTML = '<p>Your items will appear here once selected.</p>';
            } else {
                summaryItemsEl.innerHTML = itemsHtml;
            }
            summaryTotalEl.textContent = `Total: R${total.toFixed(2)}`;
        }

        // Form submission
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default page reload (AJAX)

            // Get elements
            const name = document.getElementById('order-name');
            const phone = document.getElementById('order-phone');
            const time = document.getElementById('pickup-time');
            const statusEl = document.getElementById('order-form-status');
            const itemsErrorEl = document.getElementById('order-items-error');
            
            // Reset errors
            resetError(name, 'order-name-error');
            resetError(phone, 'order-phone-error');
            resetError(time, 'order-time-error');
            itemsErrorEl.style.display = 'none';
            statusEl.style.display = 'none';

            let isValid = true;

            // Validate Name
            if (name.value.trim().length < 2) {
                setError(name, 'Name must be at least 2 characters long.', 'order-name-error');
                isValid = false;
            }

            // Validate Phone
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone.value)) {
                setError(phone, 'Please enter a valid 10-digit phone number.', 'order-phone-error');
                isValid = false;
            }

            // Validate Time
            if (time.value === '') {
                setError(time, 'Please select a pickup time.', 'order-time-error');
                isValid = false;
            }

            // Validate Items
            const selectedItems = Array.from(allItemCheckboxes).filter(i => i.checked);
            if (selectedItems.length === 0) {
                itemsErrorEl.textContent = 'Please select at least one item.';
                itemsErrorEl.style.display = 'block';
                isValid = false;
            }

            // Process if valid
            if (isValid) {
                // a real AJAX (fetch)
                console.log('Simulating AJAX submission...');
                console.log({
                    name: name.value,
                    phone: phone.value,
                    time: time.value,
                    items: selectedItems.map(i => i.value),
                    total: summaryTotalEl.textContent
                });

                // Show success message
                statusEl.innerHTML = `<strong>Thank you, ${name.value}!</strong><br>Your order has been placed for pickup at ${time.value}. Your total is ${summaryTotalEl.textContent}.`;
                statusEl.className = 'form-status success';
                statusEl.style.display = 'block';
                
                orderForm.reset();
                updateOrderSummary();
            } else {
                // Show failure message
                statusEl.textContent = 'Please correct the errors in the form to place your order.';
                statusEl.className = 'form-status error';
                statusEl.style.display = 'block';
            }
        });
    }

    /* Helper Functions for Form Validation */
    function setError(inputElement, message, errorId = null) {
        const errorEl = errorId ? document.getElementById(errorId) : inputElement.nextElementSibling;
        if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
        inputElement.classList.add('invalid');
    }

    function resetError(inputElement, errorId = null) {
        const errorEl = errorId ? document.getElementById(errorId) : inputElement.nextElementSibling;
        if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
        inputElement.classList.remove('invalid');
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(String(email).toLowerCase());
    }

});
