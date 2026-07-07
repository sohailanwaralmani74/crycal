---
layout: default
title: Contact Wanjaaro — Financial Calculator Help & Support
description: Have questions about our financial calculators? Contact the Wanjaaro team for support, feedback, or feature requests. We'd love to hear from you.
permalink: /contact-us
---

# Contact Wanjaaro – Financial Calculator Help

We'd love to hear from you. Whether you have a question about a calculator, a feature request, or just want to share feedback — reach out.

## Contact Form

You can also use the form below to send us a message directly. All messages are forwarded to our team via a secure, third-party form service. We do not store or retain your personal data beyond what's needed to respond.

<form id="contactForm" action="https://formsubmit.co/aefed7cae4aaf06e0f4785c109bc6fba" method="POST">
  
  <!-- FormSubmit required fields -->
  <input type="hidden" name="_captcha" value="true">
  <input type="hidden" name="_template" value="table">
  <input type="hidden" name="_next" value="https://wanjaaro.com/contact-us?sent=true">

  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required placeholder="Your name">
  </div>

  <div class="form-group">
    <label for="email">Email Address</label>
    <input type="email" id="email" name="email" required placeholder="you@example.com">
  </div>

  <div class="form-group">
    <label for="subject">Subject</label>
    <select id="subject" name="subject">
      <option value="general">General Inquiry</option>
      <option value="feedback">Feedback / Suggestion</option>
      <option value="bug">Bug Report</option>
      <option value="feature">Feature Request</option>
      <option value="other">Other</option>
    </select>
  </div>

  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="6" required placeholder="Your message here..."></textarea>
  </div>

  <button type="submit" class="btn-primary">Send Message</button>
</form>

<div id="contactSuccessMessage" style="display:none;" class="content-block">
  <h2>Thanks — your message is on its way</h2>
  <p>I've received your message and will get back to you as soon as I can. Appreciate you reaching out.</p>
</div>

<script>
  if (new URLSearchParams(window.location.search).get('sent') === 'true') {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('contactSuccessMessage').style.display = 'block';
  }
</script>

---

**Privacy note:** For more details, see our <a href="privacy-policy">Privacy Policy</a>.