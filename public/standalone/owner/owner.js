/**
 * GLOWBOOK SALON OWNER PORTAL — VANILLA JS
 * Interactive management for appointments, capacity usage meter, and HNB bank transfer upgrades.
 */

// 1. DATA: Salons and Mock Appointments
const OWNER_SALONS = {
  'costume': {
    id: 'salon-1',
    name: 'Salon Costume (Colombo 07)',
    billingCode: 'SALONCOSTUME-4821',
    isPro: true,
    bookingsUsed: 84,
    monthlyCap: Infinity,
    rating: 4.9,
    monthlyRevenue: 284000,
    appointments: [
      { id: 'b-1', client: 'Dilani Samarasinghe', service: 'Signature Haircut & Balayage', slot: '10:00 AM', amount: 16500, status: 'confirmed' },
      { id: 'b-2', client: 'Kavindu Senanayake', service: 'Executive Haircut & Scalp Treatment', slot: '11:30 AM', amount: 4500, status: 'confirmed' },
      { id: 'b-3', client: 'Nadeesha Jayawardena', service: 'Bridal Trial Consultation', slot: '02:00 PM', amount: 8500, status: 'pending' },
      { id: 'b-4', client: 'Sachith Weerasinghe', service: 'Beard Sculpting & Wash', slot: '04:00 PM', amount: 2500, status: 'confirmed' }
    ]
  },
  'luxe': {
    id: 'salon-3',
    name: 'Luxe Hair & Nail Lounge (Nugegoda)',
    billingCode: 'LUXELOOKS-9104',
    isPro: false,
    bookingsUsed: 27,
    monthlyCap: 30, // 27 of 30 bookings used
    rating: 4.6,
    monthlyRevenue: 86500,
    appointments: [
      { id: 'b-5', client: 'Shenali Perera', service: 'Gel Polish & Russian Manicure', slot: '10:30 AM', amount: 3800, status: 'confirmed' },
      { id: 'b-6', client: 'Anushka Wickrama', service: 'Acrylic Nail Extensions', slot: '01:00 PM', amount: 6500, status: 'pending' },
      { id: 'b-7', client: 'Heshani Fonseka', service: 'Foot Reflexology Spa', slot: '03:30 PM', amount: 3200, status: 'confirmed' }
    ]
  }
};

let activeSalonKey = 'costume';

// 2. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  renderPortal();
  setupListeners();
});

// 3. LISTENERS
function setupListeners() {
  const selector = document.getElementById('salon-switcher');
  if (selector) {
    selector.addEventListener('change', (e) => {
      activeSalonKey = e.target.value;
      renderPortal();
    });
  }

  // Duration selection in upgrade modal
  const durationBtns = document.querySelectorAll('.plan-btn');
  durationBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      durationBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      const amount = btn.dataset.amount;
      document.getElementById('transfer-amount-display').innerText = `LKR ${Number(amount).toLocaleString()}`;
    });
  });
}

// 4. RENDER PORTAL
function renderPortal() {
  const salon = OWNER_SALONS[activeSalonKey];

  // Header & Badges
  document.getElementById('portal-salon-name').innerText = salon.name;
  const badgeContainer = document.getElementById('portal-plan-badge');
  badgeContainer.innerHTML = salon.isPro
    ? `<span class="badge-pro">★ Verified Pro Plan</span>`
    : `<span class="badge-free">Free Tier</span>`;

  // Warning Banner for Free Cap
  const warningBanner = document.getElementById('warning-banner');
  if (!salon.isPro && salon.bookingsUsed >= 25) {
    warningBanner.style.display = 'flex';
    document.getElementById('cap-warning-text').innerText =
      `Your salon has used ${salon.bookingsUsed} of ${salon.monthlyCap} monthly online bookings (90% capacity). Upgrade to Pro for unlimited appointments.`;
  } else {
    warningBanner.style.display = 'none';
  }

  // KPIs
  document.getElementById('kpi-today-count').innerText = salon.appointments.length;
  document.getElementById('kpi-usage').innerText = salon.isPro
    ? 'Unlimited'
    : `${salon.bookingsUsed} / ${salon.monthlyCap}`;
  document.getElementById('kpi-revenue').innerText = `LKR ${salon.monthlyRevenue.toLocaleString()}`;
  document.getElementById('kpi-rating').innerText = `★ ${salon.rating.toFixed(1)}`;

  // Table
  renderAppointmentsTable(salon.appointments);
}

function renderAppointmentsTable(appointments) {
  const tbody = document.getElementById('appointments-tbody');
  if (!tbody) return;

  if (appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--muted); padding: 32px;">No appointments today.</td></tr>`;
    return;
  }

  tbody.innerHTML = appointments
    .map((app) => {
      let statusClass = 'status-confirmed';
      if (app.status === 'pending') statusClass = 'status-pending';
      if (app.status === 'completed') statusClass = 'status-completed';
      if (app.status === 'cancelled') statusClass = 'status-cancelled';

      return `
        <tr>
          <td>
            <strong>${app.client}</strong>
            <span style="display: block; font-size: 11px; color: var(--muted);">${app.id.toUpperCase()}</span>
          </td>
          <td>${app.service}</td>
          <td><strong>${app.slot}</strong></td>
          <td><strong>LKR ${app.amount.toLocaleString()}</strong></td>
          <td>
            <span class="status-pill ${statusClass}">${app.status.toUpperCase()}</span>
          </td>
          <td style="text-align: right;">
            ${
              app.status === 'pending'
                ? `<button class="btn btn-success" style="padding: 4px 10px; font-size: 11px;" onclick="updateStatus('${app.id}', 'confirmed')">Confirm</button>`
                : ''
            }
            ${
              app.status === 'confirmed'
                ? `<button class="btn btn-primary" style="padding: 4px 10px; font-size: 11px;" onclick="updateStatus('${app.id}', 'completed')">Complete</button>`
                : ''
            }
            ${
              app.status !== 'completed' && app.status !== 'cancelled'
                ? `<button class="btn btn-danger" style="padding: 4px 10px; font-size: 11px; margin-left: 4px;" onclick="updateStatus('${app.id}', 'cancelled')">Cancel</button>`
                : ''
            }
          </td>
        </tr>
      `;
    })
    .join('');
}

// 5. STATUS UPDATES
window.updateStatus = function (id, newStatus) {
  const salon = OWNER_SALONS[activeSalonKey];
  const app = salon.appointments.find((a) => a.id === id);
  if (app) {
    app.status = newStatus;
    if (newStatus === 'completed') {
      salon.monthlyRevenue += app.amount;
    }
    renderPortal();
    alert(`Appointment ${id.toUpperCase()} status updated to ${newStatus.toUpperCase()}`);
  }
};

// 6. UPGRADE TO PRO MODAL (HNB BANK TRANSFER)
window.openUpgradeModal = function () {
  const salon = OWNER_SALONS[activeSalonKey];
  document.getElementById('billing-code-text').innerText = salon.billingCode;
  document.getElementById('upgrade-modal').classList.add('open');
};

window.closeUpgradeModal = function () {
  document.getElementById('upgrade-modal').classList.remove('open');
};

window.copyText = function (text) {
  navigator.clipboard.writeText(text);
  alert(`Copied to clipboard: "${text}"`);
};

window.copyBillingCode = function () {
  const salon = OWNER_SALONS[activeSalonKey];
  navigator.clipboard.writeText(salon.billingCode);
  alert(`Copied Bank Transfer Reference: ${salon.billingCode}`);
};

window.submitOfflinePayment = function (e) {
  e.preventDefault();
  const bankRef = document.getElementById('hnb-ref-input').value.trim();
  const payerName = document.getElementById('payer-name-input').value.trim();

  if (!bankRef || !payerName) {
    alert('Please enter your HNB Transaction Reference number and Depositor Name.');
    return;
  }

  closeUpgradeModal();

  alert(
    `✅ Payment Proof Submitted Successfully!\n\n` +
    `Reference: ${bankRef}\n` +
    `Payer: ${payerName}\n\n` +
    `Our billing team checks deposits in the Hatton National Bank account within 24 hours. Your Verified Pro perks will unlock immediately upon verification.`
  );
};
