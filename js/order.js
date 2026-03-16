// =============================================
// SCAPE 3D — Order Form + EmailJS
// Admin    → akirakaran2124@gmail.com
// Customer → their own email
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
        if (errEl && errEl.classList.contains('field-error')) errEl.textContent = msg;
        valid = false;
      } else {
        el.classList.remove('error');
        if (errEl && errEl.classList.contains('field-error')) errEl.textContent = '';
      }
    });
  }
  if (step === 2) {
    const serviceSelected = document.querySelector('input[name="service"]:checked');
    const serviceErr = document.getElementById('serviceError');
    if (!serviceSelected) {
      if (serviceErr) serviceErr.textContent = 'Please select a service type.';
      valid = false;
    } else {
      if (serviceErr) serviceErr.textContent = '';
    }
    const qty = document.getElementById('quantity');
    const qtyErr = qty.nextElementSibling;
    if (!parseInt(qty.value) || parseInt(qty.value) < 1) {
      qty.classList.add('error');
      if (qtyErr) qtyErr.textContent = 'Quantity must be at least 1.';
      valid = false;
    } else {
      qty.classList.remove('error');
      if (qtyErr) qtyErr.textContent = '';
    }
    const desc = document.getElementById('description');
    const descErr = desc.nextElementSibling;
    if (!desc.value.trim()) {
      desc.classList.add('error');
      if (descErr) descErr.textContent = 'Please describe your project.';
      valid = false;
    } else {
      desc.classList.remove('error');
      if (descErr) descErr.textContent = '';
    }
  }
  return valid;
}

document.addEventListener('DOMContentLoaded', function() {

  // --- File Upload ---
  var uploadArea    = document.getElementById('uploadArea');
  var fileInput     = document.getElementById('fileUpload');
  var uploadPreview = document.getElementById('uploadPreview');
  var uploadContent = document.getElementById('uploadContent');

  if (uploadArea && fileInput) {
    uploadArea.addEventListener('dragover', function(e) { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', function() { uploadArea.classList.remove('dragover'); });
    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      updateFilePreview(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', function() { updateFilePreview(fileInput.files); });
  }

  function updateFilePreview(files) {
    if (!files || !files.length) return;
    uploadContent.style.display = 'none';
    uploadPreview.style.display = 'block';
    var html = '';
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      html += '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">' +
        '<span style="color:var(--accent)">✓</span><span>' + f.name + '</span>' +
        '<span style="color:var(--text-muted);font-size:.8rem">(' + (f.size/1024/1024).toFixed(2) + ' MB)</span>' +
        '</div>';
    }
    html += '<button type="button" onclick="clearFiles()" style="margin-top:.75rem;background:none;border:1px solid var(--border);color:var(--text-muted);padding:.35rem .75rem;border-radius:4px;cursor:pointer;font-size:.8rem;">Remove</button>';
    uploadPreview.innerHTML = html;
  }

  window.clearFiles = function() {
    fileInput.value = '';
    uploadPreview.style.display = 'none';
    uploadContent.style.display = 'block';
  };

  var deadlineInput = document.getElementById('deadline');
  if (deadlineInput) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    deadlineInput.min = tomorrow.toISOString().split('T')[0];
  }

  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(function(el) {
    el.addEventListener('input', function() {
      el.classList.remove('error');
      var errEl = el.nextElementSibling;
      if (errEl && errEl.classList.contains('field-error')) errEl.textContent = '';
    });
  });

  // --- Form Submit ---
  var orderForm    = document.getElementById('orderForm');
  var orderSuccess = document.getElementById('orderSuccess');
  var submitBtn    = document.getElementById('submitBtn');

  if (!orderForm) return;

  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var terms = document.getElementById('terms');
    var termsErr = document.getElementById('termsError');
    if (!terms.checked) {
      if (termsErr) termsErr.textContent = 'You must agree to the terms to continue.';
      return;
    }
    if (termsErr) termsErr.textContent = '';

    var serviceEl = document.querySelector('input[name="service"]:checked');
    var finishEl  = document.querySelector('input[name="finish"]:checked');
    var fileNames = 'No file uploaded';
    if (fileInput && fileInput.files && fileInput.files.length) {
      var names = [];
      for (var i = 0; i < fileInput.files.length; i++) names.push(fileInput.files[i].name);
      fileNames = names.join(', ');
    }

    var orderData = {
      to_email:       'akirakaran2124@gmail.com',
      reply_to:       document.getElementById('email').value,
      client_name:    document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
      client_email:   document.getElementById('email').value,
      client_phone:   document.getElementById('phone').value || 'Not provided',
      client_company: document.getElementById('company').value || 'Not provided',
      client_country: document.getElementById('country').value,
      service:        serviceEl ? serviceEl.value.toUpperCase() : 'Not selected',
      material:       document.getElementById('material').value || 'Not specified',
      color:          document.getElementById('color').value || 'Not specified',
      quantity:       document.getElementById('quantity').value,
      deadline:       document.getElementById('deadline').value || 'No deadline specified',
      finish:         finishEl ? finishEl.value : 'Standard',
      description:    document.getElementById('description').value,
      files:          fileNames,
      notes:          document.getElementById('additionalNotes').value || 'None',
      referral:       (document.querySelector('select[name="referral"]') || {}).value || 'Not specified',
      order_date:     new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    var btnText   = submitBtn.querySelector('.btn-text');
    var btnLoader = submitBtn.querySelector('.btn-loader');
    if (btnText)   btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline';
    submitBtn.disabled = true;

    // Try EmailJS — if not configured it throws and we show Gmail fallback
    Promise.all([
      emailjs.send('service_azcnjts', 'template_8wehudq', orderData),
      emailjs.send('service_azcnjts', 'template_sspteah', Object.assign({}, orderData, { to_email: orderData.client_email }))
    ])
    .then(function() {
      showSuccess(orderData.client_email);
    })
    .catch(function() {
      // EmailJS not configured — show Gmail compose fallback
      showFallbackSuccess(orderData);
    });
  });

  function showSuccess(email) {
    document.querySelector('.form-steps').classList.add('hidden');
    orderForm.classList.add('hidden');
    orderSuccess.classList.remove('hidden');
    var confirmEmail = document.getElementById('confirmEmail');
    if (confirmEmail) confirmEmail.textContent = email;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showFallbackSuccess(data) {
    document.querySelector('.form-steps').classList.add('hidden');
    orderForm.classList.add('hidden');

    var subject = 'New Scape 3D Order — ' + data.service + ' — ' + data.client_name;
    var body = 'NEW SCAPE 3D ORDER REQUEST\n==========================\n\n' +
      'CLIENT DETAILS\n' +
      'Name:     ' + data.client_name + '\n' +
      'Email:    ' + data.client_email + '\n' +
      'Phone:    ' + data.client_phone + '\n' +
      'Company:  ' + data.client_company + '\n' +
      'Country:  ' + data.client_country + '\n\n' +
      'ORDER DETAILS\n' +
      'Service:  ' + data.service + '\n' +
      'Material: ' + data.material + '\n' +
      'Color:    ' + data.color + '\n' +
      'Quantity: ' + data.quantity + '\n' +
      'Deadline: ' + data.deadline + '\n' +
      'Finish:   ' + data.finish + '\n\n' +
      'PROJECT DESCRIPTION\n' + data.description + '\n\n' +
      'FILES: ' + data.files + '\n\n' +
      'ADDITIONAL NOTES\n' + data.notes + '\n\n' +
      'Referral: ' + data.referral + '\n' +
      'Submitted: ' + data.order_date;

    // Gmail compose URL — opens Gmail directly, no blank screen
    var gmailLink = 'https://mail.google.com/mail/?view=cm' +
      '&to=akirakaran2124%40gmail.com' +
      '&su=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    var successEl = document.getElementById('orderSuccess');
    successEl.innerHTML =
      '<div class="success-icon">✓</div>' +
      '<h2>Order Submitted!</h2>' +
      '<p>Hi <strong>' + data.client_name + '</strong>, your order is ready to send!<br/>' +
      'Click below — Gmail will open with everything filled in. Just press Send.</p>' +

      '<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin:2rem auto;max-width:460px;text-align:left;">' +
        '<div style="font-size:0.7rem;letter-spacing:0.2em;color:var(--accent);margin-bottom:1rem;text-transform:uppercase;">Your Order Summary</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">' +
          '<div><div style="font-size:0.75rem;color:var(--text-muted)">Service</div><strong style="color:var(--accent)">' + data.service + '</strong></div>' +
          '<div><div style="font-size:0.75rem;color:var(--text-muted)">Quantity</div><strong>' + data.quantity + '</strong></div>' +
          '<div><div style="font-size:0.75rem;color:var(--text-muted)">Material</div><strong>' + data.material + '</strong></div>' +
          '<div><div style="font-size:0.75rem;color:var(--text-muted)">Finish</div><strong>' + data.finish + '</strong></div>' +
          '<div style="grid-column:span 2"><div style="font-size:0.75rem;color:var(--text-muted)">Deadline</div><strong>' + data.deadline + '</strong></div>' +
        '</div>' +
      '</div>' +

      '<a href="' + gmailLink + '" target="_blank" class="btn btn-primary" style="font-size:1rem;padding:1rem 2.5rem;">' +
        '📧 Send Order to Scape 3D' +
      '</a>' +
      '<p style="font-size:0.82rem;color:var(--text-muted);margin-top:0.75rem;">Opens Gmail with everything pre-filled. Just hit Send!</p>' +
      '<a href="index.html" class="btn btn-ghost" style="margin-top:1.25rem;">← Back to Home</a>';

    successEl.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

});
