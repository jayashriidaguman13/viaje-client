<template>
  <div class="contact-page">
    <div class="contact-wrapper container">

      <!-- TITLE -->
      <h1 class="text-brand mb-4 fw-bold">Contact Us</h1>
      <p class="mb-5">
        Have questions or need assistance? Reach out to us using the form below or through our contact info.
      </p>

      <div class="row">

        <!-- CONTACT FORM -->
        <div class="col-lg-7 mb-4">
          <div class="contact-card p-4">
            <form @submit.prevent="handleSubmit" novalidate>
              <div class="mb-3">
                <label for="name" class="form-label fw-semibold">Name</label>
                <input
                  id="name"
                  type="text"
                  v-model.trim="name"
                  class="form-control"
                  :class="{ 'is-invalid': nameError }"
                  placeholder="Your full name"
                  required
                />
                <div v-if="nameError" class="invalid-feedback">{{ nameError }}</div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label fw-semibold">Email</label>
                <input
                  id="email"
                  type="email"
                  v-model.trim="email"
                  class="form-control"
                  :class="{ 'is-invalid': emailError }"
                  placeholder="viajetraveler@email.com"
                  required
                />
                <div v-if="emailError" class="invalid-feedback">{{ emailError }}</div>
              </div>

              <div class="mb-3">
                <label for="message" class="form-label fw-semibold">Message</label>
                <textarea
                  id="message"
                  v-model.trim="message"
                  class="form-control"
                  :class="{ 'is-invalid': messageError }"
                  rows="5"
                  placeholder="Write your message here..."
                  required
                ></textarea>
                <div v-if="messageError" class="invalid-feedback">{{ messageError }}</div>
              </div>

              <button type="submit" class="btn btn-brand btn-lg">Send Message</button>
            </form>
          </div>
        </div>

        <!-- CONTACT INFO -->
        <div class="col-lg-5">
          <div class="contact-info p-4">
            <h5 class="fw-bold mb-3">Our Office</h5>
            <p>Viaje Airlines HQ<br>123 Aviation Ave<br>Metro City, PH</p>

            <h5 class="fw-bold mt-4 mb-3">Phone & Email</h5>
            <p>Phone: +63 912 345 6789<br>Email: support@viajeairlines.com</p>

            <h5 class="fw-bold mt-4 mb-3">Follow Us</h5>
            <p>
              <a href="https://www.facebook.com/" class="text-brand me-3" target="_blank">Facebook</a>
              <a href="https://x.com/" class="text-brand me-3" target="_blank">Twitter</a>
              <a href="https://www.instagram.com/" class="text-brand" target="_blank">Instagram</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Notyf } from "notyf";

const notyf = new Notyf();

const name = ref("");
const email = ref("");
const message = ref("");

const nameError = ref("");
const emailError = ref("");
const messageError = ref("");

const validateEmail = (value) => {
  if (!value) return "Email is required.";
  const pattern = /\S+@\S+\.\S+/;
  if (!pattern.test(value)) return "Please enter a valid email.";
  return "";
};

const handleSubmit = () => {
  nameError.value = name.value ? "" : "Name is required.";
  emailError.value = validateEmail(email.value);
  messageError.value = message.value ? "" : "Message is required.";

  if (nameError.value || emailError.value || messageError.value) {
    notyf.error("Please fill in all required fields correctly.");
    return;
  }

  notyf.success("Your message has been sent! We'll get back to you soon.");

  name.value = "";
  email.value = "";
  message.value = "";
};
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  padding: 6rem 1rem;
  background: url('../assets/images/slide1.jpg') no-repeat center center;
  background-size: cover;
  color: #005b96;
}

.contact-wrapper {
  background-color: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  padding: 2.5rem;
}

.contact-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.contact-info {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.text-brand {
  color: #005b96;
}

.btn-brand {
  background-color: #005b96;
  color: white;
  border: none;
}

.btn-brand:hover {
  background-color: #00497a;
}

@media (max-width: 768px) {
  .contact-wrapper {
    padding: 1.5rem;
  }
}
</style>