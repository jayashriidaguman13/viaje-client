<template>
  <div class="services-page">
    <div class="container h-100 d-flex flex-column justify-content-center">
      <div class="text-center mb-5">
        <h1 class="fw-bold text-brand">Our Services</h1>
        <p class="text-muted mt-2">
          Everything you need for a smooth and comfortable journey
        </p>
      </div>

      <div class="row g-4">
        <div class="col-md-6 col-lg-3">
          <a href="https://gohotels.ph/ready-set-go/how-to-get-the-cheapest-domestic-flights" target="_blank" class="service-link">
            <div class="service-card">
              <i class="bi bi-airplane-fill service-icon"></i>
              <h5 class="fw-bold mt-3">Flight Booking</h5>
              <p class="text-muted">
                Book domestic and international flights with ease and flexibility.
              </p>
            </div>
          </a>
        </div>

        <div class="col-md-6 col-lg-3">
          <a href="https://www.travelers.com/resources/travel/10-packing-tips-how-to-pack-suitcase-for-vacation" target="_blank" class="service-link">
            <div class="service-card">
              <i class="bi bi-bag-check-fill service-icon"></i>
              <h5 class="fw-bold mt-3">Baggage Services</h5>
              <p class="text-muted">
                Clear baggage policies, add-ons, and hassle-free check-in.
              </p>
            </div>
          </a>
        </div>

        <div class="col-md-6 col-lg-3">
          <a href="https://www.wander-lust.nl/upgrade-to-business-class/" target="_blank" class="service-link">
            <div class="service-card">
              <i class="bi bi-calendar-check-fill service-icon"></i>
              <h5 class="fw-bold mt-3">Manage Booking</h5>
              <p class="text-muted">
                Change flights, select seats, and update passenger details.
              </p>
            </div>
          </a>
        </div>

        <div class="col-md-6 col-lg-3">
          <a href="https://www.zendesk.com/blog/customer-support-vs-customer-service/" target="_blank" class="service-link">
            <div class="service-card">
              <i class="bi bi-headset service-icon"></i>
              <h5 class="fw-bold mt-3">Customer Support</h5>
              <p class="text-muted">
                Dedicated support to assist you before, during, and after travel.
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.services-page {
  min-height: 100vh;
  background: #f7faff;
  display: flex;
  align-items: center;
}

.text-brand {
  color: #003366;
}

.service-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.service-card {
  background: white;
  border-radius: 16px;
  padding: 2.2rem 1.8rem;
  height: 100%;
  text-align: center;
  box-shadow: 0 8px 22px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(0,0,0,0.14);
}

.service-icon {
  font-size: 2.8rem;
  color: #0077cc;
}

@media (max-width: 768px) {
  .services-page {
    padding: 60px 0;
  }
}
</style>