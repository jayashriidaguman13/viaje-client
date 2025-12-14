<template>
  <div class="search-wrapper">
    <div class="search-card">
      <h2 class="text-brand mb-3 fw-bold">Find Flights</h2>

      <div class="d-flex gap-3 mb-3 flex-wrap">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" value="oneway" v-model="tripType" id="oneway" />
          <label class="form-check-label" for="oneway">One-way</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" value="round" v-model="tripType" id="round" />
          <label class="form-check-label" for="round">Round Trip</label>
        </div>
      </div>

      <div class="inputs-row">
        <select v-model="origin" class="input">
          <option value="" disabled>Origin</option>
          <option v-for="code in airportCodes" :key="code" :value="code">{{ code }}</option>
        </select>

        <select v-model="destination" class="input">
          <option value="" disabled>Destination</option>
          <option v-for="code in airportCodes" :key="code" :value="code" :disabled="code === origin">{{ code }}</option>
        </select>

        <select v-model="passengers" class="input-passengers">
          <option value="" disabled>Passengers</option>
          <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
        </select>

        <input type="date" v-model="date" class="input date-input" :min="today" />

        <input v-if="tripType === 'round'" type="date" v-model="returnDate" class="input date-input" :min="date || today" />

        <button class="search-btn" @click="handleSearch">Search Flights</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import api from '../api';
import { useFlightStore } from '../stores/flightStore.js';

const router = useRouter();
const notyf = new Notyf();

const airportCodes = ["MNL", "NRT", "SIN", "HKG", "LAX"];
const origin = ref("");
const destination = ref("");
const date = ref("");
const returnDate = ref("");
const tripType = ref("oneway");
const passengers = ref("");
const today = new Date().toISOString().split('T')[0];
const flightStore = useFlightStore();

const handleSearch = async () => {
  if (!origin.value || !destination.value || !date.value || !passengers.value) {
    notyf.error("Please fill in origin, destination, departure date, and passengers.");
    return;
  }

  if (origin.value === destination.value) {
    notyf.error("Origin and destination cannot be the same.");
    return;
  }

  try {
    const response = await api.get("/flights/search", {
      params: {
        origin: origin.value,
        destination: destination.value,
        date: date.value,
        returnDate: tripType.value === "round" ? returnDate.value : null
      }
    });

    flightStore.setFlights(response.data);

    router.push({
      name: "SearchResults",
      query: {
          origin: origin.value,
          destination: destination.value,
          date: date.value,
          returnDate: tripType.value === "round" ? returnDate.value : "",
          passengers: passengers.value
      }
    });

  } catch (err) {
    notyf.error(
      err.response?.data?.message || "Failed to fetch flights. Please try again."
    );
  }
};
</script>

<style scoped>
.search-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}

.search-card {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  padding: 2rem 2.5rem;
  margin: 1rem 0;
  width: 100%;
  max-width: 1300px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.18);
  color: #005b96;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-brand {
  color: #005b96;
}

.inputs-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.input, .input-passengers, .date-input {
  flex: 1 1 auto;
  min-width: 150px;
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  color: #005b96;
}

.search-btn {
  flex: 0 0 auto;
  background-color: #005b96;
  color: white;
  border: none;
  padding: 0.55rem 1.4rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  white-space: nowrap;
}

.search-btn:hover {
  background-color: #00497a;
}

@media (max-width: 992px) {
  .search-card {
    width: 90%;
    text-align: center;
    padding: 1.5rem 2rem;
    margin-bottom: 6rem;
  }

  .inputs-row {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .input, .date-input, .input-passengers, .search-btn {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 576px) {
  .search-card {
    width: 95%;
    padding: 1rem 1.5rem;
    margin-bottom: 4rem;
  }

  h2.text-brand {
    font-size: 1.5rem;
  }

  .search-btn {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .d-flex.gap-3.mb-3 {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>