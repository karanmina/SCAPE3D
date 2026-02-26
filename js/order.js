// =============================================
// SCAPE 3D — Order Form Logic + EmailJS
// =============================================
// Sends order details to:
//   bansaldivya067@gmail.com
//   karansahariya4@gmail.com
// =============================================

let currentStep = 1;

function nextStep(step) {
  if (!validateStep(step)) return;
  const current = document.getElementById(`panel${step}`);
  const next = document.getElementById(`panel${step + 1}`);
  if (!next) return;
  current.classList.add('hidden');
  next.classList.remove('hidden');
  currentStep = step + 1;
  updateStepIndicators();
  window.scrollTo({ top: document.querySelector('.order-form-wrapper').offsetTop - 120, behavior: 'smooth' });
}

function prevStep(step) {
  const current = document.getElementById(`panel${step}`);
  const prev = document.getElementById(`panel${step - 1}`);
  if (!prev) return;
  current.classList.add('hidden');
  prev.classList.remove('hidden');
  currentStep = step - 1;
  updateStepIndicators();
  window.scrollTo({ top: document.querySelector('.order-form-wrapper').offsetTop - 120, behavior: 'smooth' });
}

function updateStepIndicators() {
  document.querySelectorAll('.form-step').forEach(step => {
    const num = parseInt(step.dataset.step);
    step.classList.remove('active', 'done');
    if (num === currentStep) step.classList.add('active');
    else if (num < currentStep) step.classList.add('done');
  });
}

function validateStep(step) {
  let valid = true;
  if (step === 1) {
    [
      { id: 'firstName', msg: 'Please enter your first name.' },
      { id: 'lastName',  msg: 'Please enter your last name.' },
      { id: 'email',     msg: 'Please enter a valid email.', email: true },
      { id: 'country',   msg: 'Please select your country.' },
    ].forEach(({ id, msg, email }) => {
      const el = document.getElementById(id);
      const errEl = el.nextElementSibling;
      const val = el.value.trim();
      let ok = val !== '';
      if (email) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!ok) {
        el.classList.add('error');
        if (errEl?.classList.contains('field-error')) errEl.textContent = msg;
        valid = false;
      } else {
        el.classList.remove('error');
        if (errEl?.classList.contains('field-error')) errEl.textContent = '';
      }
    });
  }
  if (step === 2) {
    const serviceSelected = document.querySelector('input[name="service"]:checked');
    const serviceErr = document.getElementById('serviceError');
    if (!serviceSelected) { if (serviceErr) serviceErr.textContent = 'Please select a service type.'; valid = false; }
    else { if (serviceErr) serviceErr.textContent = ''; }

    const qty = document.getElementById('quantity');
    const qtyErr = qty.nextElementSibling;
    if (!parseInt(qty.value) || parseInt(qty.value) < 1) {
      qty.classList.add('error');
      if (qtyErr) qtyErr.textContent = 'Quantity must be at least 1.';
      valid = false;
    } else { qty.classList.remove('error'); if (qtyErr) qtyErr.textContent = ''; }

    const desc = document.getElementById('description');
    const descErr = desc.nextElementSibling;
    if (!desc.value.trim()) {
      desc.classList.add('error');
      if (descErr) descErr.textContent = 'Please describe your project.';
      valid = false;
    } else { desc.classList.remove('error'); if (descErr) descErr.textContent = ''; }
  }
  return valid;
}

document.addEventListener('DOMContentLoaded', () => {

  const uploadArea    = document.getElementById('uploadArea');
  const fileInput     = document.getElementById('fileUpload');
  const uploadPreview = document.getElementById('uploadPreview');
  const uploadContent = document.getElementById('uploadContent');

  if (uploadArea && fileInput) {
    uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', e => { e.preventDefault(); uploadArea.classList.remove('dragover'); updateFilePreview(e.dataTransfer.files); });
    fileInput.addEventListener('change', () => updateFilePreview(fileInput.files));
  }

  function updateFilePreview(files) {
    if (!files.length) return;
    uploadContent.style.display = 'none';
    uploadPreview.style.display = 'block';
    uploadPreview.innerHTML = Array.from(files).map(f =>
      `<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
        <span style="color:var(--accent)">✓</span><span>${f.name}</span>
        <span style="color:var(--text-muted);font-size:.8rem">(${(f.size/1024/1024).toFixed(2)} MB)</span>
      </div>`
    ).join('') + `<button type="button" onclick="clearFiles()" style="margin-top:.75rem;background:none;border:1px solid var(--border);color:var(--text-muted);padding:.35rem .75rem;border-radius:4px;cursor:pointer;font-size:.8rem;">Remove</button>`;
  }

  window.clearFiles = () => { fileInput.value = ''; uploadPreview.style.display = 'none'; uploadContent.style.display = 'block'; };

  const deadlineInput = document.getElementById('deadline');
  if (deadlineInput) {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    deadlineInput.min = tomorrow.toISOString().split('T')[0];
  }

  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const errEl = el.nextElementSibling;
      if (errEl?.classList.contains('field-error')) errEl.textContent = '';
    });
  });

  const orderForm    = document.getElementById('orderForm');
  const orderSuccess = document.getElementById('orderSuccess');
  const submitBtn    = document.getElementById('submitBtn');

  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const terms = document.getElementById('terms');
      const termsErr = document.getElementById('termsError');
      if (!terms.checked) { if (termsErr) termsErr.textContent = 'You must agree to the terms to continue.'; return; }
      if (termsErr) termsErr.textContent = '';

      const serviceEl = document.querySelector('input[name="service"]:checked');
      const finishEl  = document.querySelector('input[name="finish"]:checked');
      const fileNames = fileInput?.files?.length ? Array.from(fileInput.files).map(f => f.name).join(', ') : 'No file uploaded';

      const orderData = {
        to_email_1:      'bansaldivya067@gmail.com',
        to_email_2:      'karansahariya4@gmail.com',
        reply_to:        document.getElementById('email').value,
        client_name:     `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
        client_email:    document.getElementById('email').value,
        client_phone:    document.getElementById('phone').value || 'Not provided',
        client_company:  document.getElementById('company').value || 'Not provided',
        client_country:  document.getElementById('country').value,
        service:         serviceEl ? serviceEl.value.toUpperCase() : 'Not selected',
        material:        document.getElementById('material').value || 'Not specified',
        color:           document.getElementById('color').value || 'Not specified',
        quantity:        document.getElementById('quantity').value,
        deadline:        document.getElementById('deadline').value || 'No deadline',
        finish:          finishEl ? finishEl.value : 'Standard',
        description:     document.getElementById('description').value,
        files:           fileNames,
        notes:           document.getElementById('additionalNotes').value || 'None',
        referral:        document.querySelector('select[name="referral"]')?.value || 'Not specified',
        order_date:      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      const btnText   = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      if (btnText)   btnText.style.display = 'none';
      if (btnLoader) btnLoader.style.display = 'inline';
      submitBtn.disabled = true;

      try {
        // Send to both emails via EmailJS
        // Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID after setup (see README.md)
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', { ...orderData, to_email: orderData.to_email_1 });
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', { ...orderData, to_email: orderData.to_email_2 });
        showSuccess(orderData.client_email);

      } catch (err) {
        console.warn('EmailJS not configured yet, falling back to mailto:', err);
        // FALLBACK: Opens default mail client with full order details
        const subject = encodeURIComponent(`New Order — ${orderData.service} — ${orderData.client_name}`);
        const body = encodeURIComponent(
`NEW SCAPE 3D ORDER REQUEST
==========================

CLIENT DETAILS
--------------
Name:     ${orderData.client_name}
Email:    ${orderData.client_email}
Phone:    ${orderData.client_phone}
Company:  ${orderData.client_company}
Country:  ${orderData.client_country}

ORDER DETAILS
-------------
Service:  ${orderData.service}
Material: ${orderData.material}
Color:    ${orderData.color}
Quantity: ${orderData.quantity}
Deadline: ${orderData.deadline}
Finish:   ${orderData.finish}

PROJECT DESCRIPTION
-------------------
${orderData.description}

FILES ATTACHED
--------------
${orderData.files}

ADDITIONAL NOTES
----------------
${orderData.notes}

How they found us: ${orderData.referral}
Order submitted:   ${orderData.order_date}`
        );
        window.open(`mailto:bansaldivya067@gmail.com,karansahariya4@gmail.com?subject=${subject}&body=${body}`, '_blank');
        showSuccess(orderData.client_email);
      }
    });
  }

  function showSuccess(email) {
    document.querySelector('.form-steps')?.classList.add('hidden');
    orderForm.classList.add('hidden');
    orderSuccess.classList.remove('hidden');
    const confirmEmail = document.getElementById('confirmEmail');
    if (confirmEmail) confirmEmail.textContent = email;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
