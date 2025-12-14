<template>
  <div class="admin-bookings-page">
    <div class="container py-5">
      <h1 class="mb-4 text-brand">All Bookings</h1>

      <p v-if="bookings.length === 0" class="text-muted">
        No bookings available
      </p>

      <div v-else class="accordion" id="bookingAccordion">
        <div
          class="accordion-item mb-3"
          v-for="booking in bookings"
          :key="booking._id"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#booking-${booking._id}`"
            >
              <strong>{{ booking.flightNumber }}</strong>
              &nbsp;— {{ booking.origin }} → {{ booking.destination }}
            </button>
          </h2>

          <div
            :id="`booking-${booking._id}`"
            class="accordion-collapse collapse"
            data-bs-parent="#bookingAccordion"
          >
            <div class="accordion-body">
              <p><strong>Passengers:</strong> {{ booking.passengers.length }}</p>
              <p><strong>Booking Type:</strong> {{ booking.bookingType }}</p>
              <p><strong>Departure Date:</strong> {{ formatDate(booking.departureDate) }}</p>
              <p v-if="booking.returnDate"><strong>Return Date:</strong> {{ formatDate(booking.returnDate) }}</p>
              <p><strong>Total Amount:</strong> ₱{{ booking.totalAmount.toLocaleString() }}</p>
              <p><strong>Payment:</strong> {{ booking.paymentMethod.replace('_', ' ') }}</p>
              <p>
                <strong>Status:</strong>
                <span
                  class="badge"
                  :class="{
                    'bg-warning': booking.status === 'pending',
                    'bg-success': booking.status === 'confirmed',
                    'bg-danger': booking.status === 'cancelled'
                  }"
                >
                  {{ booking.status }}
                </span>
              </p>

              <button
                class="btn btn-outline-danger btn-sm mt-3"
                @click="openCancelModal(booking)"
                v-if="booking.status !== 'cancelled'"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCancelModal" class="modal-backdrop">
      <div class="modal-card">
        <h4>Cancel Booking</h4>
        <p>Are you sure you want to cancel this booking?</p>

        <div class="modal-actions">
          <button class="btn btn-danger" @click="confirmCancel">
            Yes, Cancel
          </button>
          <button class="btn btn-secondary" @click="showCancelModal = false">
            No, Keep
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import { Notyf } from "notyf";

const notyf = new Notyf();
const bookings = ref([]);

const showCancelModal = ref(false);
const selectedBooking = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchBookings = async () => {
  try {
    const res = await api.get("/booking/all");
    bookings.value = res.data.bookings || [];
  } catch (err) {
    notyf.error("Failed to load bookings");
  }
};

const openCancelModal = (booking) => {
  selectedBooking.value = booking;
  showCancelModal.value = true;
};

const confirmCancel = async () => {
  try {
    await api.patch(`/booking/cancel/${selectedBooking.value._id}`);
    notyf.success("Booking cancelled");
    showCancelModal.value = false;
    fetchBookings();
  } catch (err) {
    notyf.error("Failed to cancel booking");
  }
};

onMounted(fetchBookings);
</script>

<style scoped>
.admin-bookings-page {
  min-height: 100vh;
  background: #f7faff;
}

.text-brand {
  color: #003366;
}

.container h1 {
  margin-top: 3rem;
}

.accordion-button {
  font-weight: 600;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1.5rem;
}
</style>