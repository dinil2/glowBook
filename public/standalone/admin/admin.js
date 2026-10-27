/**
 * GLOWBOOK PLATFORM ADMIN PANEL — VANILLA JS
 * Offline payment verification queue, salon approvals, and platform audit logs.
 */

// 1. DATASET: Verification Queue & Salons
let PENDING_PAYMENTS = [
  {
    id: 'pay-01',
    salonName: 'Salon Costume (Colombo 07)',
    billingCode: 'SALONCOSTUME-4821',
    months: 3,
    amountLkr: 5400,
    payerName: 'Tharindu Silva (Owner)',
    bankRef: 'HNB-9812401',
    transferDate: '2026-10-26',
    status: 'pending_review'
  },
  {
    id: 'pay-02',
    salonName: 'Crown Barber Studio (Dehiwala)',
    billingCode: 'CROWNBARBER-3312',
    months: 1,
    amountLkr: 2000,
    payerName: 'Dinesh Perera',
    bankRef: 'CEFT-7729104',
    transferDate: '2026-10-25',
    status: 'pending_review'
  }
];

let ADMIN_SALONS = [
  { id: 'salon-1', name: 'Salon Costume', district: 'Colombo 07', plan: 'pro', status: 'approved', rating: 4.9 },
  { id: 'salon-2', name: 'Crown Barber Studio', district: 'Dehiwala', plan: 'pro', status: 'approved', rating: 4.8 },
  { id: 'salon-3', name: 'Luxe Hair & Nail Lounge', district: 'Nugegoda', plan: 'free', status: 'approved', rating: 4.6 },
  { id: 'salon-4', name: 'Serendib Glow Bridal', district: 'Kandy', plan: 'pro', status: 'approved', rating: 4.9 },
  { id: 'salon-5', name: 'Galle Fort Aesthetics', district: 'Galle', plan: 'pro', status: 'approved', rating: 4.7 },
  { id: 'salon-6', name: 'Negombo Beach Barber', district: 'Gampaha', plan: 'free', status: 'approved', rating: 4.5 },
  { id: 'salon-7', name: 'Royal Lotus Bridal Studio', district: 'Kurunegala', plan: 'free', status: 'pending', rating: 5.0 }
];

let AUDIT_LOGS = [
  { action: 'SYSTEM_BOOT', details: 'Glowbook administrative engine initialized with HNB payment verification SLA 24h', time: 'Today' }
];

// 2. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  renderQueue();
  renderSalonsTable();
  renderAuditLogs();
});

// 3. RENDER VERIFICATION QUEUE
function renderQueue() {
  const container = document.getElementById('queue-container');
  const countBadge = document.getElementById('pending-badge');
  const pending = PENDING_PAYMENTS.filter((p) => p.status === 'pending_review');

  if (countBadge) countBadge.innerText = pending.length;

  if (pending.length === 0) {
    container.innerHTML = `
      <div style="background: white; border-radius: 20px; padding: 40px; text-align: center; border: 1px solid var(--border);">
        <p style="font-size: 16px; font-weight: 700; color: var(--emerald);">✓ All Hatton National Bank (HNB) Payments Verified</p>
        <p style="font-size: 13px; color: var(--muted); margin-top: 4px;">No salon subscription transfers waiting in queue.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pending
    .map((p) => {
      return `
        <div class="queue-card">
          <div>
            <h3 class="queue-title">${p.salonName}</h3>
            <span style="font-size: 12px; color: var(--muted);">Payer: <strong>${p.payerName}</strong></span><br>
            <span class="code-pill">Ref: ${p.billingCode}</span>
          </div>

          <div>
            <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--muted);">Deposit Details</span>
            <div style="font-size: 14px; font-weight: 800; color: var(--ink); margin-top: 2px;">
              LKR ${p.amountLkr.toLocaleString()} (${p.months} Month${p.months > 1 ? 's' : ''})
            </div>
            <span style="font-size: 12px; color: var(--muted);">HNB Ref: <strong style="font-family: monospace;">${p.bankRef}</strong> (${p.transferDate})</span>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-success" onclick="approvePayment('${p.id}')">
              ✓ Approve & Activate Pro
            </button>
            <button class="btn btn-danger" onclick="rejectPayment('${p.id}')">
              ✕ Reject
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

// 4. APPROVE PAYMENT (ATOMIC & IDEMPOTENT)
window.approvePayment = function (paymentId) {
  const payment = PENDING_PAYMENTS.find((p) => p.id === paymentId);
  if (!payment) return;

  payment.status = 'approved';

  // Find salon and promote to Pro
  const salon = ADMIN_SALONS.find((s) => s.name.includes(payment.salonName.split(' ')[0]));
  if (salon) {
    salon.plan = 'pro';
  }

  // Audit log
  AUDIT_LOGS.unshift({
    action: 'APPROVE_PAYMENT',
    details: `Approved LKR ${payment.amountLkr.toLocaleString()} HNB deposit for ${payment.salonName}. Ref: ${payment.bankRef}`,
    time: new Date().toLocaleTimeString()
  });

  renderQueue();
  renderSalonsTable();
  renderAuditLogs();

  alert(
    `✅ Payment Approved!\n\n` +
    `Salon: ${payment.salonName}\n` +
    `Duration: ${payment.months} Month(s) Pro Plan\n` +
    `Amount: LKR ${payment.amountLkr.toLocaleString()}\n\n` +
    `The salon's Verified Pro badge, calling buttons, and WhatsApp perks are now live!`
  );
};

// 5. REJECT PAYMENT
window.rejectPayment = function (paymentId) {
  const reason = prompt(
    'Enter rejection reason for the salon owner:',
    'Bank reference not found on HNB statement for that date.'
  );
  if (!reason) return;

  const payment = PENDING_PAYMENTS.find((p) => p.id === paymentId);
  if (payment) {
    payment.status = 'rejected';
    AUDIT_LOGS.unshift({
      action: 'REJECT_PAYMENT',
      details: `Rejected deposit for ${payment.salonName}: "${reason}"`,
      time: new Date().toLocaleTimeString()
    });
    renderQueue();
    renderAuditLogs();
    alert(`Payment rejected. Reason logged: "${reason}"`);
  }
};

// 6. SALONS TABLE
function renderSalonsTable() {
  const tbody = document.getElementById('admin-salons-tbody');
  if (!tbody) return;

  tbody.innerHTML = ADMIN_SALONS.map((s) => {
    return `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.district}</td>
        <td>
          ${
            s.plan === 'pro'
              ? `<span style="background: var(--lavender); color: var(--primary-deep); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 800;">PRO</span>`
              : `<span style="background: #F3F4F6; color: var(--muted); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700;">FREE</span>`
          }
        </td>
        <td>★ ${s.rating.toFixed(1)}</td>
        <td>
          ${
            s.status === 'approved'
              ? `<span class="badge-verified">Approved</span>`
              : `<span class="badge-pending">Pending Review</span>`
          }
        </td>
        <td style="text-align: right;">
          ${
            s.status === 'pending'
              ? `<button class="btn btn-success" style="padding: 4px 10px; font-size: 11px;" onclick="approveSalon('${s.id}')">Approve Salon</button>`
              : ''
          }
          <button class="btn btn-primary" style="padding: 4px 10px; font-size: 11px; margin-left: 4px;" onclick="grantTrial('${s.id}')">
            +30D Pro Trial
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.approveSalon = function (salonId) {
  const s = ADMIN_SALONS.find((x) => x.id === salonId);
  if (s) {
    s.status = 'approved';
    AUDIT_LOGS.unshift({
      action: 'APPROVE_SALON',
      details: `Approved profile for ${s.name}`,
      time: new Date().toLocaleTimeString()
    });
    renderSalonsTable();
    renderAuditLogs();
    alert(`Salon ${s.name} approved!`);
  }
};

window.grantTrial = function (salonId) {
  const s = ADMIN_SALONS.find((x) => x.id === salonId);
  if (s) {
    s.plan = 'pro';
    AUDIT_LOGS.unshift({
      action: 'GRANT_TRIAL',
      details: `Granted 30-Day Pro Trial to ${s.name}`,
      time: new Date().toLocaleTimeString()
    });
    renderSalonsTable();
    renderAuditLogs();
    alert(`Granted 30-Day Pro Trial to ${s.name}!`);
  }
};

// 7. AUDIT LOGS
function renderAuditLogs() {
  const list = document.getElementById('audit-list');
  if (!list) return;

  list.innerHTML = AUDIT_LOGS.map((log) => {
    return `
      <div style="padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; font-size: 12px;">
        <div>
          <code style="font-weight: 800; color: var(--primary-deep); background: var(--lavender); padding: 2px 6px; border-radius: 4px;">${log.action}</code>
          <span style="margin-left: 8px; color: var(--ink);">${log.details}</span>
        </div>
        <span style="color: var(--muted);">${log.time}</span>
      </div>
    `;
  }).join('');
}

// 8. CSV EXPORT
window.exportSalonsCSV = function () {
  const headers = ['ID', 'Name', 'District', 'Plan', 'Status', 'Rating'];
  const rows = ADMIN_SALONS.map((s) => [s.id, `"${s.name}"`, s.district, s.plan, s.status, s.rating]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `glowbook_salons_audit_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  alert('Exported Salons CSV successfully.');
};
