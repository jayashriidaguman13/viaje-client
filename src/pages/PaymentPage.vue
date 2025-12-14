<template>
  <div class="payment-page container py-5">
    <button class="btn btn-light back-btn mb-4" @click="$router.back()">← Back</button>

    <h1 class="mb-5 fw-bold text-brand text-center text-md-start">Secure Checkout</h1>

    <div class="row g-4">
      <!-- Booking Summary -->
      <div class="col-md-6">
        <div class="card summary-card p-4">
          <h3 class="text-brand mb-3">Booking Summary</h3>
          <p><strong>Flight:</strong> {{ booking.flightNumber }}</p>
          <p><strong>From:</strong> {{ booking.origin }}</p>
          <p><strong>To:</strong> {{ booking.destination }}</p>
          <p><strong>Departure:</strong> {{ booking.departureDate }} {{ booking.departureTime }}</p>
          <p><strong>Arrival:</strong> {{ booking.arrivalDate }} {{ booking.arrivalTime }}</p>
          <p v-if="returnFlight"><strong>Return Flight:</strong> {{ returnFlight.origin }} → {{ returnFlight.destination }}</p>
          <p><strong>Passengers:</strong> {{ booking.passengers.length }}</p>
          <hr>
          <p class="total-price"><strong>Total:</strong> ₱{{ booking.totalAmount.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Payment Form -->
      <div class="col-md-6">
        <div class="card payment-card p-4">
          <h3 class="text-brand mb-3">Payment Method</h3>

          <select v-model="booking.paymentMethod" class="form-select mb-3">
            <option disabled value="">Select a payment method</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="digital_wallet">Digital Wallet</option>
            <option value="paypal">Paypal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>

          <!-- Optional card info inputs -->
          <div v-if="booking.paymentMethod === 'credit_card' || booking.paymentMethod === 'debit_card'">
            <input type="text" v-model="cardNumber" placeholder="Card Number" class="form-control mb-2" />
            <div class="d-flex gap-2">
              <input type="text" v-model="cardExpiry" placeholder="MM/YY" class="form-control" />
              <input type="text" v-model="cardCVV" placeholder="CVV" class="form-control" />
            </div>
          </div>

          <button class="btn btn-primary w-100 mt-4" @click="payNow">Pay Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api";
import { Notyf } from "notyf";
import { useBookingStore } from "../stores/booking";

const notyf = new Notyf();
const router = useRouter();
const bookingStore = useBookingStore();

const departureFlight = ref(null);
const returnFlight = ref(null);
const loading = ref(true);
const error = ref(null);

const booking = reactive({
  flightId: "",
  flightNumber: "",
  origin: "",
  destination: "",
  departureDate: "",
  departureTime: "",
  arrivalDate: "",
  arrivalTime: "",
  passengers: [],
  bookingType: "oneWay",
  totalAmount: 0,
  paymentMethod: "",
  departureDateForBooking: "", 
  returnDateForBooking: "" 
});

const cardNumber = ref("");
const cardExpiry = ref("");
const cardCVV = ref("");

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

const formatTime = (timeString) => {
  if (!timeString) return '';
  if (timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }
  return timeString;
}

const totalAmount = computed(() => {
  let total = 0;
  if (departureFlight.value) {
    total += departureFlight.value.price || 0;
  }
  if (returnFlight.value) {
    total += returnFlight.value.price || 0;
  }
  return total;
});

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!bookingStore.departureFlight) {
      error.value = 'No departure flight found. Please select a flight first.';
      loading.value = false;
      return;
    }

    if (!bookingStore.passengers || bookingStore.passengers.length === 0) {
      error.value = 'No passenger information found. Please enter passenger details first.';
      loading.value = false;
      return;
    }

    const depFlightData = bookingStore.departureFlight;
    departureFlight.value = depFlightData;

    if (bookingStore.returnFlight) {
      returnFlight.value = bookingStore.returnFlight;
    }

    booking.flightId = depFlightData._id;
    booking.flightNumber = depFlightData.flightNumber || '';
    booking.origin = depFlightData.origin || '';
    booking.destination = depFlightData.destination || '';
    booking.departureDate = formatDate(depFlightData.departureDate);
    booking.departureTime = formatTime(depFlightData.departureTime);
    booking.arrivalDate = formatDate(depFlightData.arrivalDate);
    booking.arrivalTime = formatTime(depFlightData.arrivalTime);
    booking.passengers = [...bookingStore.passengers];
    booking.bookingType = bookingStore.returnFlight ? "roundTrip" : "oneWay";
    
    booking.departureDateForBooking = depFlightData.departureDate 
      ? new Date(depFlightData.departureDate).toISOString()
      : new Date().toISOString();
    
    if (returnFlight.value && returnFlight.value.departureDate) {
      booking.returnDateForBooking = new Date(returnFlight.value.departureDate).toISOString();
    }
    
    let calculatedTotal = depFlightData.price || 0;
    if (returnFlight.value) {
      calculatedTotal += returnFlight.value.price || 0;
    }
    booking.totalAmount = calculatedTotal;

  } catch (err) {
    console.error('Error loading booking data:', err);
    error.value = err.response?.data?.message || 'Failed to load booking information';
  } finally {
    loading.value = false;
  }
});

const isValidCardNumber = (num) => /^\d{16}$/.test(num);
const isValidExpiry = (exp) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
const isValidCVV = (cvv) => /^\d{3,4}$/.test(cvv);

const payNow = async () => {
  if (!booking.paymentMethod) {
    notyf.error("Select a payment method");
    return;
  }

  if (booking.paymentMethod === "credit_card" || booking.paymentMethod === "debit_card") {
    if (!isValidCardNumber(cardNumber.value)) {
      notyf.error("Card number must be 16 digits");
      return;
    }

    if (!isValidExpiry(cardExpiry.value)) {
      notyf.error("Expiry must be in MM/YY format");
      return;
    }

    if (!isValidCVV(cardCVV.value)) {
      notyf.error("CVV must be 3 or 4 digits");
      return;
    }
  }

  try {
    const bookingPayload = {
      flightId: booking.flightId,
      passengers: booking.passengers,
      bookingType: booking.bookingType,
      totalAmount: booking.totalAmount,
      paymentMethod: booking.paymentMethod,
      flightNumber: booking.flightNumber,
      departureDate: booking.departureDateForBooking,
      returnDate: booking.returnDateForBooking || undefined
    };
    
    const res = await api.post("/booking/create", bookingPayload);
    notyf.success("Payment successful! Booking confirmed");
    
    const bookingId = res.data.booking?._id || res.data.bookingId;
    
    bookingStore.clearAll();
    
    router.push({ 
      path: "/booking-success",
      query: { id: bookingId }
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    notyf.error(err.response?.data?.message || "Payment failed. Please try again.");
  }
};
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background: #f7faff;
  font-family: 'Arial', sans-serif;
}

.back-btn {
  background: #e6f0ff;
  color: #003366;
  font-weight: 600;
  border: none;
  margin-top: 2rem;
}

.text-brand {
  color: #005b96;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.summary-card p,
.payment-card p {
  margin: 0.5rem 0;
}

.summary-card h3,
.payment-card h3 {
  color: #003366;
  font-weight: 700;
}

.total-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #003366;
}

.payment-card .form-select,
.payment-card .form-control {
  border-radius: 8px;
  border: 1px solid #ccc;
}

.payment-card button.btn {
  font-weight: 600;
}
</style>