# Scape 3D — Email Setup Guide

## Contact Details
- bansaldivya067@gmail.com  |  karansahariya4@gmail.com
- +91 98876 52110  |  +91 82097 59008
- Jaipur, Rajasthan, India

---

## Email Flow (3 emails per order)
1. Admin notification → bansaldivya067@gmail.com
2. Admin notification → karansahariya4@gmail.com
3. Customer confirmation → client's own email

---

## EmailJS Setup (FREE, 15 mins)

1. Sign up at https://www.emailjs.com (free = 200 emails/month)
2. Connect Gmail: Dashboard → Email Services → Add New Service → Gmail
   → Note your SERVICE ID (e.g. service_abc123)

3. Create ADMIN Template (email-templates/admin-order-notification.html):
   - To: {{to_email}} | Subject: New Order — {{service}} — {{client_name}}
   - Paste the HTML file content into HTML mode
   → Note ADMIN TEMPLATE ID (e.g. template_admin123)

4. Create CUSTOMER Template (email-templates/customer-confirmation.html):
   - To: {{to_email}} | Subject: Order Received ✓ — Scape 3D
   - Paste the HTML file content into HTML mode
   → Note CUSTOMER TEMPLATE ID (e.g. template_cust456)

5. Get Public Key: Account → General → Public Key

6. Update order.html line ~13:
   emailjs.init("YOUR_PUBLIC_KEY")  →  emailjs.init("your_actual_key")

7. Update js/order.js (3 places):
   'YOUR_SERVICE_ID'           → 'service_abc123'
   'YOUR_ADMIN_TEMPLATE_ID'    → 'template_admin123'
   'YOUR_CUSTOMER_TEMPLATE_ID' → 'template_cust456'

Done! Submit a test order to verify all 3 emails arrive.

---

## Fallback (works without setup)
Form opens mail client pre-filled with order details addressed to both emails.

---

## Files
  index.html, services.html, gallery.html, order.html
  css/style.css
  js/main.js, js/order.js
  email-templates/admin-order-notification.html   ← paste into EmailJS
  email-templates/customer-confirmation.html      ← paste into EmailJS
