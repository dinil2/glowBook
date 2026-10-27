/**
 * GLOWBOOK CUSTOMER EXPERIENCE — VANILLA JS SCRIPT
 * Standalone, clean, fully commented script for browsing salons and booking appointments in Sri Lanka.
 */

// 1. DATASET: Sri Lankan Salons
const SALONS_DATA = [
  {
    id: 'salon-1',
    name: 'Salon Costume',
    district: 'Colombo',
    city: 'Colombo 07',
    category: 'Hair',
    tagline: 'Haute coiffure, bespoke balayage & luxury bridal couture in Colombo 07',
    rating: 4.9,
    reviews: 142,
    startingPrice: 2800,
    isPro: true,
    phone: '+94 11 268 9120',
    whatsapp: '+94 77 482 1902',
    banner: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    services: [
      { name: 'Signature Haircut & Blowdry', price: 3500, duration: 45 },
      { name: 'Balayage & Gloss Finish', price: 16500, duration: 120 },
      { name: 'Keratin Botanical Therapy', price: 12000, duration: 90 },
      { name: 'Luxury Bridal Hair Trial', price: 8500, duration: 60 }
    ],
    staff: ['Tharindu Silva (Master)', 'Nethmi Fernando', 'Any Available Stylist']
  },
  {
    id: 'salon-2',
    name: 'Crown Barber Studio',
    district: 'Colombo',
    city: 'Dehiwala',
    category: 'Barber',
    tagline: 'Premium classic fades, hot towel beard sculpting & executive grooming',
    rating: 4.8,
    reviews: 98,
    startingPrice: 1500,
    isPro: true,
    phone: '+94 11 271 4455',
    whatsapp: '+94 71 890 2233',
    banner: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    services: [
      { name: 'Executive Fade & Style', price: 1800, duration: 30 },
      { name: 'Hot Towel Beard Sculpting', price: 1500, duration: 25 },
      { name: 'Charcoal Deep Facial', price: 3200, duration: 40 }
    ],
    staff: ['Dinesh Perera', 'Kasun Mendis', 'Any Available Stylist']
  },
  {
    id: 'salon-3',
    name: 'Luxe Hair & Nail Lounge',
    district: 'Colombo',
    city: 'Nugegoda',
    category: 'Nails',
    tagline: 'Trendy nail extensions, gel art, and organic foot spa treatments',
    rating: 4.6,
    reviews: 43,
    startingPrice: 2200,
    isPro: false, // Free salon: phone and whatsapp are strictly hidden!
    phone: null,
    whatsapp: null,
    banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    services: [
      { name: 'Gel Polish & Russian Manicure', price: 3800, duration: 50 },
      { name: 'Acrylic Nail Extensions', price: 6500, duration: 75 },
      { name: 'Foot Reflexology Spa', price: 3200, duration: 45 }
    ],
    staff: ['Salon Stylist (Auto-assigned)']
  },
  {
    id: 'salon-4',
    name: 'Serendib Glow Bridal & Spa',
    district: 'Kandy',
    city: 'Kandy City',
    category: 'Bridal',
    tagline: 'Kandyan & Western bridal dressing, herbal facials, and ayurvedic head oil baths',
    rating: 4.9,
    reviews: 76,
    startingPrice: 3500,
    isPro: true,
    phone: '+94 81 223 9900',
    whatsapp: '+94 77 123 4567',
    banner: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    services: [
      { name: 'Kandyan Bridal Dressing Consultation', price: 5000, duration: 60 },
      { name: 'Ayurvedic Golden Glow Facial', price: 4500, duration: 60 },
      { name: 'Herbal Hair Conditioning Therapy', price: 3500, duration: 45 }
    ],
    staff: ['Sunethra Alahakoon', 'Chamari Wickramasinghe', 'Any Available Stylist']
  },
  {
    id: 'salon-5',
    name: 'Galle Fort Aesthetics',
    district: 'Galle',
    city: 'Galle Fort',
    category: 'Facial',
    tagline: 'Oceanfront wellness studio for hydra facials, skin peels & soothing massages',
    rating: 4.7,
    reviews: 52,
    startingPrice: 3000,
    isPro: true,
    phone: '+94 91 224 8877',
    whatsapp: '+94 76 555 4321',
    banner: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    services: [
      { name: 'Hydra-Infusion Facial', price: 7500, duration: 60 },
      { name: 'Vitamin C Brightening Peel', price: 6000, duration: 45 },
      { name: 'Relaxing Neck & Shoulder Relief', price: 3000, duration: 30 }
    ],
    staff: ['Niluka Jayasuriya', 'Any Available Stylist']
  },
  {
    id: 'salon-6',
    name: 'Negombo Beach Barber',
    district: 'Gampaha',
    city: 'Negombo',
    category: 'Barber',
    tagline: 'Casual coastal haircutting, beard trims & refreshing hair spas',
    rating: 4.5,
    reviews: 29,
    startingPrice: 1200,
    isPro: false, // Free salon
    phone: null,
    whatsapp: null,
    banner: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=800&q=80',
    services: [
      { name: 'Standard Haircut', price: 1200, duration: 25 },
      { name: 'Beard Trim & Clean Shave', price: 1000, duration: 20 }
    ],
    staff: ['Salon Stylist (Auto-assigned)']
  }
];

// 2. STATE
let currentCategory = 'all';
let currentDistrict = 'all';
let searchQuery = '';
let activeBookingSalon = null;
let selectedServiceIndices = [0];
let selectedTimeSlot = '10:00 AM';

// 3. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  renderSalons();
  setupEventListeners();
});

// 4. EVENT LISTENERS
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderSalons();
    });
  }

  // District select
  const districtSelect = document.getElementById('district-select');
  if (districtSelect) {
    districtSelect.addEventListener('change', (e) => {
      currentDistrict = e.target.value;
      renderSalons();
    });
  }

  // Category chips
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.dataset.category;
      renderSalons();
    });
  });

  // Modal close
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Form submit
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }
}

// 5. RENDER SALONS
function renderSalons() {
  const grid = document.getElementById('salons-grid');
  if (!grid) return;

  const filtered = SALONS_DATA.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery) ||
      s.city.toLowerCase().includes(searchQuery) ||
      s.tagline.toLowerCase().includes(searchQuery);

    const matchesDistrict =
      currentDistrict === 'all' || s.district.toLowerCase() === currentDistrict.toLowerCase();

    const matchesCategory =
      currentCategory === 'all' || s.category.toLowerCase() === currentCategory.toLowerCase();

    return matchesSearch && matchesDistrict && matchesCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: white; border-radius: 24px; border: 1px solid var(--border);">
        <p style="font-size: 18px; font-weight: 700; color: var(--ink);">No salons found</p>
        <p style="font-size: 14px; color: var(--muted); margin-top: 6px;">Try clearing filters or searching another district in Sri Lanka.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered
    .map((salon) => {
      return `
        <div class="salon-card">
          <div class="card-banner" style="background-image: url('${salon.banner}');">
            ${
              salon.isPro
                ? `<span class="badge-pro">★ Verified Pro</span>`
                : `<span class="badge-free">Free Listing</span>`
            }
          </div>
          <div class="card-content">
            <div class="card-header-row">
              <h3 class="card-title">${salon.name}</h3>
              <div class="rating-badge">
                <span class="star-icon">★</span>
                <span>${salon.rating.toFixed(1)}</span>
                <span style="font-size: 11px; color: var(--muted);">(${salon.reviews})</span>
              </div>
            </div>
            <p class="card-location">📍 ${salon.city}, ${salon.district} District</p>
            <p class="card-tagline">${salon.tagline}</p>
            
            <div class="card-footer">
              <div class="price-hint">
                From
                <strong>LKR ${salon.startingPrice.toLocaleString()}</strong>
              </div>
              <div class="card-actions">
                ${
                  salon.isPro && salon.whatsapp
                    ? `<a href="https://wa.me/${salon.whatsapp.replace(/\D/g, '')}" target="_blank" class="btn btn-whatsapp" title="WhatsApp Chat">💬</a>`
                    : ''
                }
                ${
                  salon.isPro && salon.phone
                    ? `<a href="tel:${salon.phone}" class="btn btn-secondary" title="Call Salon">📞</a>`
                    : ''
                }
                <button class="btn btn-primary" onclick="openBookingModal('${salon.id}')">
                  Book Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

// 6. BOOKING MODAL
window.openBookingModal = function (salonId) {
  activeBookingSalon = SALONS_DATA.find((s) => s.id === salonId);
  if (!activeBookingSalon) return;

  selectedServiceIndices = [0]; // default select first
  selectedTimeSlot = '10:00 AM';

  document.getElementById('modal-salon-name').innerText = activeBookingSalon.name;
  document.getElementById('modal-salon-city').innerText = `${activeBookingSalon.city}, ${activeBookingSalon.district}`;

  // Render services
  const servicesContainer = document.getElementById('services-list');
  servicesContainer.innerHTML = activeBookingSalon.services
    .map((srv, index) => {
      return `
        <label style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 8px; cursor: pointer; background: var(--bg-color);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" name="service" value="${index}" ${index === 0 ? 'checked' : ''} onchange="toggleServiceSelection(${index})" />
            <div>
              <strong style="font-size: 13px; color: var(--ink); display: block;">${srv.name}</strong>
              <span style="font-size: 11px; color: var(--muted);">${srv.duration} mins</span>
            </div>
          </div>
          <strong style="font-size: 13px; color: var(--primary-deep);">LKR ${srv.price.toLocaleString()}</strong>
        </label>
      `;
    })
    .join('');

  // Render staff
  const staffSelect = document.getElementById('staff-select');
  staffSelect.innerHTML = activeBookingSalon.staff
    .map((st) => `<option value="${st}">${st}</option>`)
    .join('');

  // Render time slots
  renderSlots();
  updateSummary();

  // Show modal
  document.getElementById('booking-modal').classList.add('open');
};

window.toggleServiceSelection = function (index) {
  if (selectedServiceIndices.includes(index)) {
    if (selectedServiceIndices.length > 1) {
      selectedServiceIndices = selectedServiceIndices.filter((i) => i !== index);
    }
  } else {
    selectedServiceIndices.push(index);
  }
  updateSummary();
};

function renderSlots() {
  const slots = ['09:30 AM', '10:00 AM', '10:45 AM', '11:30 AM', '02:00 PM', '03:15 PM', '04:30 PM', '05:45 PM'];
  const grid = document.getElementById('slots-container');
  grid.innerHTML = slots
    .map((slot) => {
      const isSelected = slot === selectedTimeSlot;
      return `
        <button type="button" class="slot-btn ${isSelected ? 'selected' : ''}" onclick="selectSlot('${slot}')">
          ${slot}
        </button>
      `;
    })
    .join('');
}

window.selectSlot = function (slot) {
  selectedTimeSlot = slot;
  renderSlots();
  updateSummary();
};

function updateSummary() {
  if (!activeBookingSalon) return;
  const selectedServices = selectedServiceIndices.map((i) => activeBookingSalon.services[i]);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);

  document.getElementById('summary-services-count').innerText = `${selectedServices.length} service(s) selected`;
  document.getElementById('summary-duration').innerText = `${totalDuration} mins`;
  document.getElementById('summary-slot').innerText = selectedTimeSlot;
  document.getElementById('summary-total-price').innerText = `LKR ${totalPrice.toLocaleString()}`;
}

function closeModal() {
  document.getElementById('booking-modal').classList.remove('open');
}

// 7. FORM SUBMIT & BOOKING GENERATION
function handleBookingSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('client-name').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const email = document.getElementById('client-email').value.trim();

  if (!name || !phone) {
    showToast('Please enter your name and phone number.');
    return;
  }

  // Format booking reference: e.g. GB-7K3Q9X
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  const reference = `GB-${randomChars}`;

  const selectedServices = selectedServiceIndices.map((i) => activeBookingSalon.services[i]);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  // Save to localStorage
  const newBooking = {
    reference,
    salonName: activeBookingSalon.name,
    customerName: name,
    customerPhone: phone,
    customerEmail: email,
    slot: selectedTimeSlot,
    services: selectedServices.map((s) => s.name),
    totalPrice,
    createdAt: new Date().toISOString()
  };

  const existing = JSON.parse(localStorage.getItem('glowbook_guest_bookings') || '[]');
  existing.unshift(newBooking);
  localStorage.setItem('glowbook_guest_bookings', JSON.stringify(existing));

  closeModal();

  // Show confirmation alert
  alert(
    `🎉 Booking Confirmed!\n\n` +
    `Reference: ${reference}\n` +
    `Salon: ${activeBookingSalon.name}\n` +
    `Appointment: Today at ${selectedTimeSlot}\n` +
    `Total: LKR ${totalPrice.toLocaleString()} (Pay at salon)\n\n` +
    `A confirmation SMS/WhatsApp notice has been drafted to ${phone}.`
  );

  showToast(`Booking ${reference} confirmed!`);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
