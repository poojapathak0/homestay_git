// Main JavaScript for Cozy Homestay website
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav') && !event.target.closest('.menu-toggle')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    // Scroll header effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Add animation classes to elements when they come into view
    const animatedElements = document.querySelectorAll('.feature, .testimonial, .room-card');
    
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // Room availability system
    const availabilityData = {
        "deluxe": {
            available: true,
            roomsLeft: 3,
            status: "available" // available, limited, booked
        },
        "family": {
            available: true,
            roomsLeft: 1,
            status: "limited"
        },
        "single": {
            available: true,
            roomsLeft: 5,
            status: "available"
        },
        "garden": {
            available: false,
            roomsLeft: 0,
            status: "booked"
        }
    };
    
    // Update room availability badges
    const availabilityBadges = document.querySelectorAll('.availability-badge');
    if (availabilityBadges.length > 0) {
        availabilityBadges.forEach(badge => {
            const roomType = badge.dataset.roomType;
            if (roomType && availabilityData[roomType]) {
                const status = availabilityData[roomType].status;
                badge.classList.add(status);
                
                if (status === 'available') {
                    badge.textContent = `Available (${availabilityData[roomType].roomsLeft} rooms left)`;
                } else if (status === 'limited') {
                    badge.textContent = `Limited Availability (${availabilityData[roomType].roomsLeft} room left)`;
                } else if (status === 'booked') {
                    badge.textContent = 'Fully Booked';
                }
            }
        });
    }
    
    // Room Preview Popup
    const roomPreviewButtons = document.querySelectorAll('.room-preview-btn');
    const roomPreview = document.querySelector('.room-preview');
    
    if (roomPreviewButtons.length > 0 && roomPreview) {
        roomPreviewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const roomType = this.dataset.roomType;
                openRoomPreview(roomType);
            });
        });
        
        // Close preview
        const previewClose = roomPreview.querySelector('.preview-close');
        if (previewClose) {
            previewClose.addEventListener('click', function() {
                closeRoomPreview();
            });
        });
        
        // Close on outside click
        roomPreview.addEventListener('click', function(e) {
            if (e.target === roomPreview) {
                closeRoomPreview();
            }
        });
    }
    
    function openRoomPreview(roomType) {
        // Update preview content based on room type
        if (roomPreview) {
            // Logic to update preview content goes here
            roomPreview.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeRoomPreview() {
        if (roomPreview) {
            roomPreview.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Booking form handling
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        const roomTypeSelect = document.getElementById('room_type');
        const checkInDate = document.getElementById('check_in');
        const checkOutDate = document.getElementById('check_out');
        const guestsInput = document.getElementById('guests');
        
        // Disable booked rooms in the dropdown
        if (roomTypeSelect) {
            for (const option of roomTypeSelect.options) {
                const roomType = option.value;
                if (availabilityData[roomType] && !availabilityData[roomType].available) {
                    option.disabled = true;
                    option.textContent += ' (Fully Booked)';
                }
            }
        }
        
        // Set min date to today for date inputs
        if (checkInDate && checkOutDate) {
            const today = new Date().toISOString().split('T')[0];
            checkInDate.min = today;
            
            // Set checkout min date based on checkin
            checkInDate.addEventListener('change', function() {
                if (checkInDate.value) {
                    checkOutDate.min = checkInDate.value;
                    // If checkout date is before checkin date, reset it
                    if (checkOutDate.value && checkOutDate.value < checkInDate.value) {
                        checkOutDate.value = '';
                    }
                }
            });
        }
        
        // Form submission
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            if (!validateBookingForm()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(bookingForm);
            const bookingData = {};
            
            formData.forEach((value, key) => {
                bookingData[key] = value;
            });
            
            // Check room availability
            if (roomTypeSelect && availabilityData[bookingData.room_type]) {
                if (!availabilityData[bookingData.room_type].available) {
                    showNotification('error', 'Room Not Available', 'Sorry, this room type is fully booked for your selected dates.');
                    return;
                }
                
                // Simulate booking process
                showBookingModal(bookingData);
            }
        });
    }
    
    function validateBookingForm() {
        const requiredFields = document.querySelectorAll('#bookingForm [required]');
        let valid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                valid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        if (!valid) {
            showNotification('warning', 'Missing Information', 'Please fill in all required fields.');
        }
        
        return valid;
    }
    
    // Booking modal
    function showBookingModal(bookingData) {
        // Create modal element
        let modal = document.getElementById('bookingModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bookingModal';
            modal.className = 'modal';
            
            // Create modal content
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Confirm Your Booking</h2>
                        <span class="modal-close">&times;</span>
                    </div>
                    <div class="modal-body">
                        <h3>Booking Summary</h3>
                        <div class="booking-summary">
                            <div class="summary-section">
                                <h4><i class="fas fa-calendar-alt"></i> Stay Information</h4>
                                <div class="summary-item">
                                    <span>Room Type:</span>
                                    <span id="summary-room" class="summary-value"></span>
                                </div>
                                <div class="summary-dates">
                                    <div class="date-item">
                                        <i class="fas fa-calendar-check"></i>
                                        <div>
                                            <span class="date-label">Check-in</span>
                                            <span id="summary-checkin" class="date-value"></span>
                                        </div>
                                    </div>
                                    <div class="date-arrow">
                                        <i class="fas fa-arrow-right"></i>
                                    </div>
                                    <div class="date-item">
                                        <i class="fas fa-calendar-times"></i>
                                        <div>
                                            <span class="date-label">Check-out</span>
                                            <span id="summary-checkout" class="date-value"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="summary-item">
                                    <span><i class="fas fa-user-friends"></i> Guests:</span>
                                    <span id="summary-guests" class="summary-value"></span>
                                </div>
                            </div>
                            
                            <div class="summary-section">
                                <h4><i class="fas fa-user"></i> Guest Information</h4>
                                <div class="summary-item">
                                    <span><i class="fas fa-user-circle"></i> Name:</span>
                                    <span id="summary-name" class="summary-value"></span>
                                </div>
                                <div class="summary-item">
                                    <span><i class="fas fa-envelope"></i> Email:</span>
                                    <span id="summary-email" class="summary-value"></span>
                                </div>
                                <div class="summary-item">
                                    <span><i class="fas fa-phone"></i> Phone:</span>
                                    <span id="summary-phone" class="summary-value"></span>
                                </div>
                            </div>
                        </div>
                        <div class="total-price-card">
                            <div class="price-label">Total Price:</div>
                            <div id="summary-price" class="price-value">$0</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                        <button type="button" class="btn confirm-booking">Confirm Booking</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close button functionality
            const closeBtn = modal.querySelector('.modal-close');
            const cancelBtn = modal.querySelector('.modal-cancel');
            const confirmBtn = modal.querySelector('.confirm-booking');
            
            closeBtn.addEventListener('click', () => closeModal(modal));
            cancelBtn.addEventListener('click', () => closeModal(modal));
            
            // Confirm booking
            confirmBtn.addEventListener('click', () => {
                processBooking(bookingData);
                closeModal(modal);
            });
            
            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
        
        // Update booking summary
        updateBookingSummary(modal, bookingData);
        
        // Show the modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    function updateBookingSummary(modal, data) {
        // Get room display name
        let roomTypeDisplay = data.room_type;
        const roomSelect = document.getElementById('room_type');
        if (roomSelect) {
            const selectedOption = roomSelect.options[roomSelect.selectedIndex];
            roomTypeDisplay = selectedOption.textContent;
        }
        
        // Calculate total price
        let pricePerNight = 0;
        switch(data.room_type) {
            case 'deluxe': pricePerNight = 75; break;
            case 'family': pricePerNight = 120; break;
            case 'single': pricePerNight = 45; break;
            case 'garden': pricePerNight = 85; break;
        }
        
        const checkIn = new Date(data.check_in);
        const checkOut = new Date(data.check_out);
        const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * pricePerNight;
        
        // Format dates
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const checkInFormatted = checkIn.toLocaleDateString('en-US', options);
        const checkOutFormatted = checkOut.toLocaleDateString('en-US', options);
        
        // Update summary fields
        modal.querySelector('#summary-room').textContent = roomTypeDisplay;
        modal.querySelector('#summary-checkin').textContent = checkInFormatted;
        modal.querySelector('#summary-checkout').textContent = checkOutFormatted;
        modal.querySelector('#summary-guests').textContent = data.guests;
        modal.querySelector('#summary-name').textContent = data.name;
        modal.querySelector('#summary-email').textContent = data.email;
        modal.querySelector('#summary-phone').textContent = data.phone || 'Not provided';
        modal.querySelector('#summary-price').textContent = `$${totalPrice} (${nights} night${nights > 1 ? 's' : ''} × $${pricePerNight})`;
    }
    
    function processBooking(bookingData) {
        // This function would normally send data to a server
        // For demo purposes, we'll just show a success notification
        
        // Update local availability (simulating a server update)
        if (availabilityData[bookingData.room_type]) {
            availabilityData[bookingData.room_type].roomsLeft--;
            
            if (availabilityData[bookingData.room_type].roomsLeft <= 0) {
                availabilityData[bookingData.room_type].available = false;
                availabilityData[bookingData.room_type].status = 'booked';
            } else if (availabilityData[bookingData.room_type].roomsLeft <= 2) {
                availabilityData[bookingData.room_type].status = 'limited';
            }
            
            // If we have availability badges, update them
            updateAvailabilityBadges();
        }
        
        // Clear form
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.reset();
        }
        
        // Show success notification
        showNotification('success', 'Booking Confirmed!', 'Your booking has been successfully confirmed. Check your email for details.');
        
        // Save booking to localStorage (simulating a database)
        saveBooking(bookingData);
    }
    
    function updateAvailabilityBadges() {
        const badges = document.querySelectorAll('.availability-badge');
        if (badges.length > 0) {
            badges.forEach(badge => {
                const roomType = badge.dataset.roomType;
                if (roomType && availabilityData[roomType]) {
                    // Remove old status classes
                    badge.classList.remove('available', 'limited', 'booked');
                    
                    // Add new status class
                    const status = availabilityData[roomType].status;
                    badge.classList.add(status);
                    
                    // Update text
                    if (status === 'available') {
                        badge.textContent = `Available (${availabilityData[roomType].roomsLeft} rooms left)`;
                    } else if (status === 'limited') {
                        badge.textContent = `Limited Availability (${availabilityData[roomType].roomsLeft} room left)`;
                    } else if (status === 'booked') {
                        badge.textContent = 'Fully Booked';
                    }
                }
            });
        }
        
        // Also update the room selector in the booking form if it exists
        const roomSelect = document.getElementById('room_type');
        if (roomSelect) {
            for (const option of roomSelect.options) {
                const roomType = option.value;
                if (availabilityData[roomType]) {
                    if (availabilityData[roomType].available) {
                        option.disabled = false;
                        option.textContent = option.textContent.replace(' (Fully Booked)', '');
                    } else {
                        option.disabled = true;
                        if (!option.textContent.includes('Fully Booked')) {
                            option.textContent += ' (Fully Booked)';
                        }
                    }
                }
            }
        }
    }
    
    function saveBooking(bookingData) {
        // Add a timestamp and unique ID
        bookingData.id = 'booking_' + Date.now();
        bookingData.timestamp = new Date().toISOString();
        bookingData.status = 'confirmed'; // Default status
        
        // Get existing bookings from localStorage
        let bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
        
        // Add the new booking
        bookings.push(bookingData);
        
        // Save back to localStorage
        localStorage.setItem('homestayBookings', JSON.stringify(bookings));
    }
    
    // Notification system
    function showNotification(type, title, message) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Icon based on type
        let icon = '';
        switch(type) {
            case 'success': icon = 'check-circle'; break;
            case 'error': icon = 'times-circle'; break;
            case 'warning': icon = 'exclamation-triangle'; break;
            case 'info': icon = 'info-circle'; break;
            default: icon = 'bell';
        }
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <div class="notification-close">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        // Add to the document
        document.body.appendChild(notification);
        
        // Show notification with slight delay for animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Close notification on click
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-close after 5 seconds for success and info notifications
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }
    }
    
    // Admin panel functionality
    const adminToggle = document.querySelector('.admin-toggle');
    if (adminToggle) {
        const adminMenu = document.querySelector('.admin-menu');
        
        adminToggle.addEventListener('click', function() {
            adminMenu.classList.toggle('show');
        });
        
        // Close on outside click
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.admin-menu') && !event.target.closest('.admin-toggle')) {
                adminMenu.classList.remove('show');
            }
        });
    }
    
    // Admin dashboard - load bookings
    function loadAdminDashboard() {
        const bookingsList = document.querySelector('.admin-bookings-list');
        if (!bookingsList) return;
        
        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p>No bookings found.</p>';
            return;
        }
        
        // Sort bookings by date (newest first)
        bookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Create bookings list
        let html = '';
        bookings.forEach(booking => {
            const checkIn = new Date(booking.check_in);
            const checkOut = new Date(booking.check_out);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            
            let statusClass = '';
            switch(booking.status) {
                case 'confirmed': statusClass = 'status-confirmed'; break;
                case 'checked-in': statusClass = 'status-active'; break;
                case 'completed': statusClass = 'status-completed'; break;
                case 'cancelled': statusClass = 'status-cancelled'; break;
            }
            
            html += `
                <div class="booking-item" data-id="${booking.id}">
                    <div class="booking-details">
                        <h3>${booking.name}</h3>
                        <p><i class="fas fa-envelope"></i> ${booking.email}</p>
                        <p><i class="fas fa-phone"></i> ${booking.phone || 'Not provided'}</p>
                        <div class="booking-dates">
                            <span><i class="fas fa-calendar-check"></i> ${checkIn.toLocaleDateString('en-US', options)}</span>
                            <span><i class="fas fa-arrow-right"></i></span>
                            <span><i class="fas fa-calendar-times"></i> ${checkOut.toLocaleDateString('en-US', options)}</span>
                        </div>
                        <div class="booking-room">
                            <span><i class="fas fa-bed"></i> ${booking.room_type.charAt(0).toUpperCase() + booking.room_type.slice(1)} Room</span>
                            <span><i class="fas fa-user-friends"></i> ${booking.guests} guest${booking.guests > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div class="booking-actions">
                        <span class="booking-status ${statusClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                        <div class="booking-buttons">
                            <button class="btn-edit" data-id="${booking.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete" data-id="${booking.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        bookingsList.innerHTML = html;
        
        // Add event listeners for edit and delete buttons
        const editButtons = bookingsList.querySelectorAll('.btn-edit');
        const deleteButtons = bookingsList.querySelectorAll('.btn-delete');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookingId = this.dataset.id;
                editBooking(bookingId);
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookingId = this.dataset.id;
                deleteBooking(bookingId);
            });
        });
    }
    
    // Edit booking - admin function
    function editBooking(bookingId) {
        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
        const booking = bookings.find(b => b.id === bookingId);
        
        if (!booking) return;
        
        // Create modal for editing
        let modal = document.getElementById('editBookingModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'editBookingModal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Edit Booking</h2>
                        <span class="modal-close">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="editBookingForm">
                            <input type="hidden" id="edit-id">
                            <div class="form-group">
                                <label for="edit-status">Status</label>
                                <select id="edit-status" name="status">
                                    <option value="confirmed">Confirmed</option>
                                    <option value="checked-in">Checked In</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edit-name">Guest Name</label>
                                <input type="text" id="edit-name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-email">Email</label>
                                <input type="email" id="edit-email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-phone">Phone</label>
                                <input type="tel" id="edit-phone" name="phone">
                            </div>
                            <div class="form-group">
                                <label for="edit-room">Room Type</label>
                                <select id="edit-room" name="room_type">
                                    <option value="deluxe">Deluxe Room</option>
                                    <option value="family">Family Suite</option>
                                    <option value="single">Cozy Single</option>
                                    <option value="garden">Garden View Room</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edit-checkin">Check-in Date</label>
                                <input type="date" id="edit-checkin" name="check_in" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-checkout">Check-out Date</label>
                                <input type="date" id="edit-checkout" name="check_out" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-guests">Number of Guests</label>
                                <input type="number" id="edit-guests" name="guests" min="1" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                        <button type="button" class="btn save-booking">Save Changes</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close button functionality
            const closeBtn = modal.querySelector('.modal-close');
            const cancelBtn = modal.querySelector('.modal-cancel');
            const saveBtn = modal.querySelector('.save-booking');
            
            closeBtn.addEventListener('click', () => closeModal(modal));
            cancelBtn.addEventListener('click', () => closeModal(modal));
            
            // Save changes
            saveBtn.addEventListener('click', () => {
                saveBookingChanges();
                closeModal(modal);
            });
            
            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
        
        // Fill form with booking data
        document.getElementById('edit-id').value = booking.id;
        document.getElementById('edit-status').value = booking.status;
        document.getElementById('edit-name').value = booking.name;
        document.getElementById('edit-email').value = booking.email;
        document.getElementById('edit-phone').value = booking.phone || '';
        document.getElementById('edit-room').value = booking.room_type;
        document.getElementById('edit-checkin').value = booking.check_in;
        document.getElementById('edit-checkout').value = booking.check_out;
        document.getElementById('edit-guests').value = booking.guests;
        
        // Show the modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // Save booking changes - admin function
    function saveBookingChanges() {
        const form = document.getElementById('editBookingForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const bookingId = document.getElementById('edit-id').value;
        
        // Get bookings from localStorage
        let bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
        
        // Find the booking to edit
        const index = bookings.findIndex(b => b.id === bookingId);
        if (index === -1) return;
        
        // Update booking data
        const updatedBooking = bookings[index];
        
        formData.forEach((value, key) => {
            updatedBooking[key] = value;
        });
        
        // Save back to localStorage
        bookings[index] = updatedBooking;
        localStorage.setItem('homestayBookings', JSON.stringify(bookings));
        
        // Refresh the bookings list
        loadAdminDashboard();
        
        // Show success notification
        showNotification('success', 'Booking Updated', 'The booking has been successfully updated.');
    }
    
    // Delete booking - admin function
    function deleteBooking(bookingId) {
        if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            return;
        }
        
        // Get bookings from localStorage
        let bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
        
        // Filter out the booking to delete
        bookings = bookings.filter(b => b.id !== bookingId);
        
        // Save back to localStorage
        localStorage.setItem('homestayBookings', JSON.stringify(bookings));
        
        // Refresh the bookings list
        loadAdminDashboard();
        
        // Show success notification
        showNotification('success', 'Booking Deleted', 'The booking has been successfully deleted.');
    }
    
    // Run admin dashboard if on admin page
    if (document.querySelector('.admin-bookings-list')) {
        loadAdminDashboard();
    }
    
    // FAQ accordion functionality 
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');
        });
    });
    
    // Enhanced Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // If using FormSubmit for email forwarding, this JS validation is secondary
        // as the form now posts directly to FormSubmit's endpoint
        contactForm.addEventListener('submit', function(e) {
            // We'll still do client-side validation
            // The actual form submission now goes to FormSubmit
            
            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                e.preventDefault(); // Prevent submission
                showNotification('warning', 'Missing Information', 'Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault(); // Prevent submission
                showNotification('warning', 'Invalid Email', 'Please enter a valid email address.');
                return;
            }
            
            // If we get here, the form will submit to FormSubmit
            // No need to prevent default
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll to booking section from hero CTA
    const bookNowCTA = document.querySelector('.hero-cta-button');
    if (bookNowCTA) {
        bookNowCTA.addEventListener('click', function(e) {
            e.preventDefault();
            const bookingSection = document.querySelector('.booking-widget');
            if (bookingSection) {
                window.scrollTo({
                    top: bookingSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Image lazy loading
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // My Bookings page functionality
    function displayMyBookings() {
        const bookingsContainer = document.getElementById('myBookingsContainer');
        if (!bookingsContainer) return;
        
        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
        
        // Clear any search query
        const searchInput = document.getElementById('bookingSearchInput');
        let searchTerm = '';
        if (searchInput) {
            searchTerm = searchInput.value.toLowerCase();
        }
        
        // Filter bookings by email if search term is provided
        let filteredBookings = bookings;
        if (searchTerm) {
            filteredBookings = bookings.filter(booking => 
                booking.email.toLowerCase().includes(searchTerm) ||
                booking.id.toLowerCase().includes(searchTerm));
        }
        
        if (filteredBookings.length === 0) {
            bookingsContainer.innerHTML = `
                <div class="no-bookings">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No bookings found</h3>
                    <p>${searchTerm ? 'Try a different search term or booking ID.' : 'You have no bookings yet.'}</p>
                    <a href="rooms.html" class="btn">Book a Room Now</a>
                </div>
            `;
            return;
        }
        
        // Sort bookings by check-in date (upcoming first)
        filteredBookings.sort((a, b) => new Date(a.check_in) - new Date(b.check_in));
        
        // Create bookings list
        let html = '';
        filteredBookings.forEach(booking => {
            const checkIn = new Date(booking.check_in);
            const checkOut = new Date(booking.check_out);
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            const today = new Date();
            
            // Determine if the booking is upcoming, current, or past
            let timeStatus = '';
            if (checkIn > today) {
                timeStatus = 'upcoming';
            } else if (checkOut < today) {
                timeStatus = 'past';
            } else {
                timeStatus = 'current';
            }
            
            let statusClass = '';
            switch(booking.status) {
                case 'confirmed': statusClass = 'status-confirmed'; break;
                case 'checked-in': statusClass = 'status-active'; break;
                case 'completed': statusClass = 'status-completed'; break;
                case 'cancelled': statusClass = 'status-cancelled'; break;
            }
            
            // Calculate price
            let pricePerNight = 0;
            switch(booking.room_type) {
                case 'deluxe': pricePerNight = 75; break;
                case 'family': pricePerNight = 120; break;
                case 'single': pricePerNight = 45; break;
                case 'garden': pricePerNight = 85; break;
            }
            
            const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            const totalPrice = nights * pricePerNight;
            
            html += `
                <div class="booking-card ${timeStatus}-booking">
                    <div class="booking-header">
                        <h3>${booking.room_type.charAt(0).toUpperCase() + booking.room_type.slice(1)} Room</h3>
                        <span class="booking-status ${statusClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                    </div>
                    <div class="booking-dates">
                        <div class="date-item">
                            <i class="fas fa-calendar-check"></i>
                            <div class="date-details">
                                <span class="date-label">Check-in</span>
                                <span class="date-value">${checkIn.toLocaleDateString('en-US', options)}</span>
                            </div>
                        </div>
                        <div class="date-divider">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                        <div class="date-item">
                            <i class="fas fa-calendar-times"></i>
                            <div class="date-details">
                                <span class="date-label">Check-out</span>
                                <span class="date-value">${checkOut.toLocaleDateString('en-US', options)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="booking-details">
                        <div class="detail-item">
                            <i class="fas fa-user-friends"></i>
                            <span>${booking.guests} guest${booking.guests > 1 ? 's' : ''}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>$${totalPrice} (${nights} night${nights > 1 ? 's' : ''})</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-id-card"></i>
                            <span>Booking ID: ${booking.id.substring(8)}</span>
                        </div>
                    </div>
                    <div class="booking-actions">
                        <button class="btn-details" data-id="${booking.id}">View Details</button>
                        ${timeStatus === 'upcoming' ? `<button class="btn-cancel" data-id="${booking.id}">Cancel Booking</button>` : ''}
                    </div>
                </div>
            `;
        });
        
        bookingsContainer.innerHTML = html;
        
        // Add event listeners for buttons
        const detailButtons = bookingsContainer.querySelectorAll('.btn-details');
        const cancelButtons = bookingsContainer.querySelectorAll('.btn-cancel');
        
        detailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookingId = this.dataset.id;
                showBookingDetails(bookingId);
            });
        });
        
        cancelButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookingId = this.dataset.id;
                cancelBooking(bookingId);
            });
        });
    }
    
    // Show booking details
    function showBookingDetails(bookingId) {
        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
        const booking = bookings.find(b => b.id === bookingId);
        
        if (!booking) {
            showNotification('error', 'Booking Not Found', 'The requested booking could not be found.');
            return;
        }
        
        // Create modal for details
        let modal = document.getElementById('bookingDetailsModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bookingDetailsModal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Booking Details</h2>
                        <span class="modal-close">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div id="bookingDetailsContent"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn modal-close-btn">Close</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close button functionality
            const closeBtn = modal.querySelector('.modal-close');
            const closeButtonFooter = modal.querySelector('.modal-close-btn');
            
            closeBtn.addEventListener('click', () => closeModal(modal));
            closeButtonFooter.addEventListener('click', () => closeModal(modal));
            
            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
        
        // Update details content
        const detailsContent = modal.querySelector('#bookingDetailsContent');
        
        // Calculate price
        let pricePerNight = 0;
        switch(booking.room_type) {
            case 'deluxe': pricePerNight = 75; break;
            case 'family': pricePerNight = 120; break;
            case 'single': pricePerNight = 45; break;
            case 'garden': pricePerNight = 85; break;
        }
        
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * pricePerNight;
        
        // Format dates
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        const checkInFormatted = checkIn.toLocaleDateString('en-US', options);
        const checkOutFormatted = checkOut.toLocaleDateString('en-US', options);
        
        // Format status
        let statusClass = '';
        switch(booking.status) {
            case 'confirmed': statusClass = 'status-confirmed'; break;
            case 'checked-in': statusClass = 'status-active'; break;
            case 'completed': statusClass = 'status-completed'; break;
            case 'cancelled': statusClass = 'status-cancelled'; break;
        }
        
        // Determine if the booking is upcoming, current, or past
        const today = new Date();
        let timeStatus = '';
        if (checkIn > today) {
            timeStatus = 'Upcoming';
        } else if (checkOut < today) {
            timeStatus = 'Past';
        } else {
            timeStatus = 'Current Stay';
        }
        
        detailsContent.innerHTML = `
            <div class="booking-detail-header">
                <div class="booking-detail-status">
                    <span class="booking-time-status">${timeStatus}</span>
                    <span class="booking-status ${statusClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                </div>
                <div class="booking-id">
                    <span>Booking ID: ${booking.id}</span>
                    <span>Booked on: ${new Date(booking.timestamp).toLocaleDateString('en-US')}</span>
                </div>
            </div>
            
            <div class="booking-detail-section">
                <h3><i class="fas fa-bed"></i> Room Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Room Type</span>
                        <span class="detail-value">${booking.room_type.charAt(0).toUpperCase() + booking.room_type.slice(1)} Room</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Guests</span>
                        <span class="detail-value">${booking.guests} person${booking.guests > 1 ? 's' : ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Price per Night</span>
                        <span class="detail-value">$${pricePerNight}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Number of Nights</span>
                        <span class="detail-value">${nights}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total Price</span>
                        <span class="detail-value">$${totalPrice}</span>
                    </div>
                </div>
            </div>
            
            <div class="booking-detail-section">
                <h3><i class="fas fa-calendar-alt"></i> Stay Dates</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Check-in</span>
                        <span class="detail-value">${checkInFormatted}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Check-out</span>
                        <span class="detail-value">${checkOutFormatted}</span>
                    </div>
                </div>
            </div>
            
            <div class="booking-detail-section">
                <h3><i class="fas fa-user"></i> Guest Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Name</span>
                        <span class="detail-value">${booking.name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${booking.email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${booking.phone || 'Not provided'}</span>
                    </div>
                </div>
            </div>
            
            ${timeStatus === 'Upcoming' ? `
            <div class="booking-detail-section">
                <h3><i class="fas fa-info-circle"></i> Need to Make Changes?</h3>
                <p>If you need to modify or cancel your booking, please contact our support team at support@cozyhomestay.com or call us at +1-234-567-8900.</p>
                <button class="btn btn-cancel-booking" data-id="${booking.id}">Cancel This Booking</button>
            </div>
            ` : ''}
        `;
        
        // Add event listener for cancel button if present
        const cancelBtn = detailsContent.querySelector('.btn-cancel-booking');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                const bookingId = this.dataset.id;
                closeModal(modal);
                cancelBooking(bookingId);
            });
        }
        
        // Show the modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // Cancel booking
    function cancelBooking(bookingId) {
        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        
        if (bookingIndex === -1) {
            showNotification('error', 'Booking Not Found', 'The requested booking could not be found.');
            return;
        }
        
        // Confirm cancellation
        const confirmModal = document.createElement('div');
        confirmModal.className = 'modal';
        confirmModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Confirm Cancellation</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary modal-cancel">No, Keep My Booking</button>
                    <button type="button" class="btn btn-danger confirm-cancel">Yes, Cancel Booking</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmModal);
        
        // Close button functionality
        const closeBtn = confirmModal.querySelector('.modal-close');
        const cancelBtn = confirmModal.querySelector('.modal-cancel');
        const confirmBtn = confirmModal.querySelector('.confirm-cancel');
        
        const closeConfirmModal = () => {
            confirmModal.remove();
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeConfirmModal);
        cancelBtn.addEventListener('click', closeConfirmModal);
        
        // Confirm cancellation
        confirmBtn.addEventListener('click', () => {
            // Update booking status
            bookings[bookingIndex].status = 'cancelled';
            
            // Save back to localStorage
            localStorage.setItem('homestayBookings', JSON.stringify(bookings));
            
            // Close modal
            closeConfirmModal();
            
            // Show success notification
            showNotification('success', 'Booking Cancelled', 'Your booking has been successfully cancelled.');
            
            // Refresh bookings display
            displayMyBookings();
        });
        
        // Show the modal
        confirmModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Initialize My Bookings page
    if (document.getElementById('myBookingsContainer')) {
        displayMyBookings();
        
        // Add search functionality
        const searchForm = document.getElementById('bookingSearchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                displayMyBookings();
            });
        }
    }

    // My Bookings page functionality
    function initMyBookingsPage() {
        const myBookingsForm = document.getElementById('findBookingsForm');
        const bookingsContainer = document.getElementById('userBookings');
        
        if (!myBookingsForm || !bookingsContainer) return;
        
        myBookingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('booking_email').value.trim();
            
            if (!email) {
                showNotification('warning', 'Email Required', 'Please enter the email you used for your booking.');
                return;
            }
            
            // Find bookings in localStorage
            const bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
            const userBookings = bookings.filter(booking => booking.email.toLowerCase() === email.toLowerCase() && booking.status !== 'cancelled');
            
            if (userBookings.length === 0) {
                bookingsContainer.innerHTML = `
                    <div class="no-bookings">
                        <i class="fas fa-calendar-times"></i>
                        <h3>No Bookings Found</h3>
                        <p>We couldn't find any active bookings with the email address: ${email}</p>
                        <p>If you just made a booking, please check your email for confirmation.</p>
                        <a href="rooms.html" class="btn">Browse Rooms</a>
                    </div>
                `;
                return;
            }
            
            // Sort bookings by check-in date (upcoming first)
            userBookings.sort((a, b) => new Date(a.check_in) - new Date(b.check_in));
            
            // Display bookings
            let html = `
                <h2>Your Bookings</h2>
                <p>We found ${userBookings.length} booking(s) for ${email}</p>
                <div class="user-bookings-list">
            `;
            
            userBookings.forEach(booking => {
                const checkIn = new Date(booking.check_in);
                const checkOut = new Date(booking.check_out);
                const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
                
                // Calculate nights and total price
                const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                let pricePerNight = 0;
                switch(booking.room_type) {
                    case 'deluxe': pricePerNight = 75; break;
                    case 'family': pricePerNight = 120; break;
                    case 'single': pricePerNight = 45; break;
                    case 'garden': pricePerNight = 85; break;
                }
                const totalPrice = nights * pricePerNight;
                
                // Check if booking is upcoming, active, or past
                const today = new Date();
                let bookingStatus = '';
                let statusIcon = '';
                
                if (today < checkIn) {
                    bookingStatus = 'upcoming';
                    statusIcon = 'calendar-alt';
                } else if (today >= checkIn && today <= checkOut) {
                    bookingStatus = 'active';
                    statusIcon = 'calendar-check';
                } else {
                    bookingStatus = 'past';
                    statusIcon = 'calendar-times';
                }
                
                // Format room type
                const roomTypeFormatted = booking.room_type.charAt(0).toUpperCase() + booking.room_type.slice(1);
                
                html += `
                    <div class="user-booking-item ${bookingStatus}-booking">
                        <div class="booking-status-icon">
                            <i class="fas fa-${statusIcon}"></i>
                        </div>
                        <div class="booking-details">
                            <div class="booking-header">
                                <h3>${roomTypeFormatted} Room</h3>
                                <span class="booking-dates">${checkIn.toLocaleDateString('en-US', options)} - ${checkOut.toLocaleDateString('en-US', options)}</span>
                            </div>
                            <div class="booking-info">
                                <p><strong>Guests:</strong> ${booking.guests}</p>
                                <p><strong>Total:</strong> $${totalPrice} (${nights} night${nights > 1 ? 's' : ''})</p>
                                <p><strong>Status:</strong> ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
                            </div>
                            <div class="booking-actions">
                                ${bookingStatus === 'upcoming' ? 
                                    `<button class="btn btn-cancel" data-id="${booking.id}">Cancel Booking</button>` : ''}
                                <button class="btn btn-details" data-id="${booking.id}">View Details</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
            bookingsContainer.innerHTML = html;
            
            // Add event listeners for cancel buttons
            const cancelButtons = bookingsContainer.querySelectorAll('.btn-cancel');
            cancelButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const bookingId = this.dataset.id;
                    cancelUserBooking(bookingId, email);
                });
            });
            
            // Add event listeners for details buttons
            const detailButtons = bookingsContainer.querySelectorAll('.btn-details');
            detailButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const bookingId = this.dataset.id;
                    showBookingDetails(bookingId);
                });
            });
        });
    }
    
    // Function to cancel a user booking
    function cancelUserBooking(bookingId, userEmail) {
        // Create confirmation modal
        let modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Cancel Booking</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close-btn">No, Keep My Booking</button>
                    <button class="btn btn-danger confirm-cancel">Yes, Cancel Booking</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Close functionality
        const closeBtns = modal.querySelectorAll('.modal-close, .modal-close-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                }, 300);
            });
        });
        
        // Confirm cancellation
        const confirmBtn = modal.querySelector('.confirm-cancel');
        confirmBtn.addEventListener('click', () => {
            // Get bookings
            let bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
            const bookingIndex = bookings.findIndex(b => b.id === bookingId);
            
            if (bookingIndex !== -1) {
                // Update booking status
                bookings[bookingIndex].status = 'cancelled';
                localStorage.setItem('homestayBookings', JSON.stringify(bookings));
                
                // Update room availability
                const roomType = bookings[bookingIndex].room_type;
                if (availabilityData[roomType]) {
                    availabilityData[roomType].roomsLeft++;
                    
                    if (!availabilityData[roomType].available) {
                        availabilityData[roomType].available = true;
                    }
                    
                    if (availabilityData[roomType].roomsLeft > 2) {
                        availabilityData[roomType].status = 'available';
                    } else {
                        availabilityData[roomType].status = 'limited';
                    }
                    
                    updateAvailabilityBadges();
                }
                
                // Close modal
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                    
                    // Show success notification
                    showNotification('success', 'Booking Cancelled', 'Your booking has been successfully cancelled.');
                    
                    // Refresh bookings display
                    const findForm = document.getElementById('findBookingsForm');
                    if (findForm) {
                        findForm.dispatchEvent(new Event('submit'));
                    }
                }, 300);
            }
        });
    }
    
    // Function to show booking details
    function showBookingDetails(bookingId) {
        // Get booking from localStorage
        const bookings = JSON.parse(localStorage.getItem('homestayBookings')) || [];
        const booking = bookings.find(b => b.id === bookingId);
        
        if (!booking) return;
        
        // Calculate nights and total price
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        let pricePerNight = 0;
        switch(booking.room_type) {
            case 'deluxe': pricePerNight = 75; break;
            case 'family': pricePerNight = 120; break;
            case 'single': pricePerNight = 45; break;
            case 'garden': pricePerNight = 85; break;
        }
        const totalPrice = nights * pricePerNight;
        
        // Format dates
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const checkInFormatted = checkIn.toLocaleDateString('en-US', options);
        const checkOutFormatted = checkOut.toLocaleDateString('en-US', options);
        
        // Create modal
        let modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content booking-details-modal">
                <div class="modal-header">
                    <h2>Booking Details</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="booking-id">
                        <small>Booking ID: ${booking.id}</small>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Stay Information</h3>
                        <div class="detail-item">
                            <span>Room Type:</span>
                            <span>${booking.room_type.charAt(0).toUpperCase() + booking.room_type.slice(1)} Room</span>
                        </div>
                        <div class="detail-item">
                            <span>Check-in:</span>
                            <span>${checkInFormatted}</span>
                        </div>
                        <div class="detail-item">
                            <span>Check-out:</span>
                            <span>${checkOutFormatted}</span>
                        </div>
                        <div class="detail-item">
                            <span>Guests:</span>
                            <span>${booking.guests}</span>
                        </div>
                        <div class="detail-item">
                            <span>Duration:</span>
                            <span>${nights} night${nights > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Guest Information</h3>
                        <div class="detail-item">
                            <span>Name:</span>
                            <span>${booking.name}</span>
                        </div>
                        <div class="detail-item">
                            <span>Email:</span>
                            <span>${booking.email}</span>
                        </div>
                        <div class="detail-item">
                            <span>Phone:</span>
                            <span>${booking.phone || 'Not provided'}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Payment Information</h3>
                        <div class="detail-item">
                            <span>Price per night:</span>
                            <span>$${pricePerNight}</span>
                        </div>
                        <div class="detail-item total-price">
                            <span>Total Price:</span>
                            <span>$${totalPrice}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Status</h3>
                        <div class="detail-item">
                            <span>Booking Status:</span>
                            <span class="status-${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn modal-close-btn">Close</button>
                    ${booking.status === 'confirmed' && new Date() < checkIn ? 
                        `<button class="btn btn-danger cancel-from-details" data-id="${booking.id}">Cancel Booking</button>` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Close functionality
        const closeBtns = modal.querySelectorAll('.modal-close, .modal-close-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                }, 300);
            });
        });
        
        // Add cancel button functionality
        const cancelBtn = modal.querySelector('.cancel-from-details');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                    
                    // Call cancel function
                    cancelUserBooking(this.dataset.id, booking.email);
                }, 300);
            });
        }
    }

    // Contact form submission to messaging system
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            if (!validateContactForm()) {
                return;
            }
            
            // Gather form data
            const formData = {
                id: 'msg_' + Date.now(),
                subject: document.getElementById('subject').value,
                from: document.getElementById('email').value,
                fromName: document.getElementById('name').value,
                phone: document.getElementById('phone').value || 'Not provided',
                check_in: document.getElementById('check_in').value || 'Not specified',
                check_out: document.getElementById('check_out').value || 'Not specified',
                guests: document.getElementById('guests').value || 'Not specified',
                room_type: document.getElementById('room_type').value || 'Not specified',
                message: document.getElementById('message').value,
                date: new Date().toISOString(),
                responses: [],
                read: false,
                replied: false
            };
            
            // Save the message to localStorage
            saveMessageToSystem(formData);
            
            // Show success message
            showFormStatusMessage('success', 'Your message has been sent successfully! We will get back to you soon.');
            
            // Reset the form
            contactForm.reset();
            
            // Redirect to thank you page after 2 seconds
            setTimeout(function() {
                window.location.href = 'thank-you.html';
            }, 2000);
        });
    }
    
    function validateContactForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        // Remove all existing error styles
        contactForm.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            }
        });
        
        // Email validation
        const emailField = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField.value && !emailPattern.test(emailField.value)) {
            emailField.classList.add('error');
            isValid = false;
        }
        
        // Check privacy consent
        const privacyConsent = document.getElementById('privacy_consent');
        if (!privacyConsent.checked) {
            privacyConsent.classList.add('error');
            isValid = false;
        }
        
        // Show error message if any validation fails
        if (!isValid) {
            showFormStatusMessage('error', 'Please correct the errors in the form.');
        }
        
        return isValid;
    }
    
    function showFormStatusMessage(type, message) {
        const statusDiv = contactForm.querySelector('.form-status-message');
        statusDiv.textContent = message;
        statusDiv.className = 'form-status-message ' + type;
        
        // Hide message after 5 seconds
        setTimeout(function() {
            statusDiv.className = 'form-status-message';
            statusDiv.textContent = '';
        }, 5000);
    }
    
    function saveMessageToSystem(messageData) {
        // Get existing messages
        let messages = localStorage.getItem('homestayMessages');
        messages = messages ? JSON.parse(messages) : [];
        
        // Add new message
        messages.push(messageData);
        
        // Save back to localStorage
        localStorage.setItem('homestayMessages', JSON.stringify(messages));
        
        // Optional: Update message count in the UI if we're on the messages page
        if (window.messageSystem && typeof window.messageSystem.updateMessageCounts === 'function') {
            window.messageSystem.updateMessageCounts();
        }
    }
});