<template>
  <div class="admin-page-container">
    <section class="hero-section">
      <div
        class="carousel-background"
        :style="{ backgroundImage: `url(${images[currentImage]})` }"
      ></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="admin-title">Admin Dashboard</h1>
        <button class="add-flight-btn" @click="showAddModal = true">
          Add Flight
        </button>
      </div>
    </section>

    <section class="flights-section">
      <div class="container">
        <h2 class="section-title">Available Flights</h2>
        <p v-if="Array.isArray(flights) && flights.length === 0">
          No flights currently available.
        </p>
        
        <table v-else-if="Array.isArray(flights) && flights.length > 0" class="table table-striped mt-3">
          <thead>
            </thead>
          <tbody>
            <tr v-for="(flight, index) in flights" :key="flight?._id || index">
              <td>{{ flight?.flightNumber || "-" }}</td>
              <td>{{ flight?.origin || "-" }}</td>
              <td>{{ flight?.destination || "-" }}</td>
              <td>{{ flight?.price?.toLocaleString() || "-" }}</td>
              <td>{{ flight?.isActive ? 'Active' : 'Archived' }}</td>
              <td>
                <template v-if="flight">
                  <button class="btn btn-sm btn-primary me-2" @click="openUpdateModal(flight)">Update</button>
                  <button
                    class="btn btn-sm"
                    :class="flight.isActive ? 'btn-danger' : 'btn-success'"
                    @click="toggleFlightStatus(flight)"
                  >
                    {{ flight.isActive ? 'Archive' : 'Activate' }}
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Loading flights or data failed to load as an array.</p>
      </div>
    </section>

    <div v-if="showAddModal" class="modal-backdrop">
      <div class="modal-card">
        <h3>Add New Flight</h3>
        <div class="modal-inputs">
          <input type="text" v-model="newFlight.origin" placeholder="Origin" />
          <input type="text" v-model="newFlight.destination" placeholder="Destination" />
          <input type="time" v-model="newFlight.departureTime" placeholder="Departure Time" />
          <input type="time" v-model="newFlight.arrivalTime" placeholder="Arrival Time" />
          <input type="number" v-model.number="newFlight.price" placeholder="Price" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="addFlight">Add Flight</button>
          <button class="btn btn-secondary" @click="showAddModal = false">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div v-if="showUpdateModal" class="modal-backdrop">
      <div class="modal-card">
        <h3>Update Flight</h3>
        <div class="modal-inputs">
          <input
            type="text"
            v-model="updateFlightData.origin"
            placeholder="Origin"
          />
          <input
            type="text"
            v-model="updateFlightData.destination"
            placeholder="Destination"
          />
          <input
            type="number"
            v-model.number="updateFlightData.price"
            placeholder="Price"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="updateFlight">Update</button>
          <button class="btn btn-secondary" @click="showUpdateModal = false">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Notyf } from "notyf";
import api from "../api";

const notyf = new Notyf();

const images = [
  new URL("../assets/images/slide1.jpg", import.meta.url).href,
  new URL("../assets/images/slide2.jpeg", import.meta.url).href,
  new URL("../assets/images/slide3.jpeg", import.meta.url).href,
];

const currentImage = ref(0);
let interval = null;
const flights = ref([]);

const fetchFlights = async () => {
  try {
    const res = await api.get("/flights/all-flights");

    console.log("API Success! Full response data:", res.data);
    console.log("Extracted flights array:", res.data.flights);

    flights.value = res.data.flights;
  } catch (err) {
    console.error("Failed to fetch flights:", err);
    notyf.error("Failed to fetch flights"); 
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
    } else if (err.request) {
      console.error("No response received. Request details:", err.request);
    } else {
      console.error("Error setting up request:", err.message);
    }
  }
};

const showAddModal = ref(false);
const newFlight = ref({ origin: "", destination: "", price: null });

const generateFlightNumber = () => {
  return "FL-" + Math.floor(1000 + Math.random() * 9000);
};

const addFlight = async () => {
  if (
    !newFlight.value.origin ||
    !newFlight.value.destination ||
    !newFlight.value.departureTime ||
    !newFlight.value.arrivalTime ||
    !newFlight.value.price
  ) {
    notyf.error("Fill all fields");
    return;
  }

  try {
    await api.post("/flights/create-flight", { ...newFlight.value });
    notyf.success("Flight added");
    showAddModal.value = false;
    newFlight.value = { origin: "", destination: "", departureTime: "", arrivalTime: "", price: null };
    fetchFlights();
  } catch (err) {
    console.error("Failed to add flight:", err.response?.data || err.message);
    notyf.error("Failed to add flight");
  }
};

const showUpdateModal = ref(false);
const updateFlightData = ref({});

const openUpdateModal = (flight) => {
  updateFlightData.value = { ...flight };
  showUpdateModal.value = true;
};

const updateFlight = async () => {
  try {
    await api.put(
      `/flights/update/${updateFlightData.value._id}`,
      updateFlightData.value
    );
    notyf.success("Flight updated");
    showUpdateModal.value = false;
    fetchFlights();
  } catch (err) {
    notyf.error("Failed to update flight");
  }
};

const toggleFlightStatus = async (flight) => {
  const route = flight.isActive ? "archive" : "activate";
  try {
    await api.patch(`/flights/${route}/${flight._id}`);
    notyf.success(`Flight ${flight.isActive ? "archived" : "activated"}`);
    fetchFlights();
  } catch (err) {
    notyf.error("Failed to update flight status");
  }
};

onMounted(() => {
  interval = setInterval(() => {
    currentImage.value = (currentImage.value + 1) % images.length;
  }, 8000);
  
  fetchFlights();
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.page-container, .admin-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
}

.carousel-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 1;
  animation: fadeLoop 8s infinite;
  transition: opacity 0.3s ease-in-out;
}

@keyframes fadeLoop {
  0% { opacity: 1 }
  33% { opacity: 0.7 }
  66% { opacity: 1 }
  100% { opacity: 1 }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 15px;
}

.admin-title {
  color: white;
  font-size: 3rem;
  font-weight: 700;
}

.add-flight-btn {
  padding: 0.6rem 1.2rem;
  background-color: #005b96;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.add-flight-btn:hover {
  background-color: #00497a;
}

.flights-section {
  padding: 40px 20px;
  background: #f7faff;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 350px;
}

.modal-inputs input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>