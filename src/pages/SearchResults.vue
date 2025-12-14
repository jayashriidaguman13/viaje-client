<template>
  <div class="search-results-page">
    <div class="results-background">
      <div class="container py-5">

        <h2 class="text-brand fw-bold mb-4">Available Flights</h2>

        <div v-if="loading" class="text-center fs-4 py-5">
          Loading flights...
        </div>

        <div v-else>
          <div v-if="currentFlights.length === 0" class="no-flights-card">
            <p class="no-flights-text fs-4 mb-0">No flights match your search.</p>
          </div>

          <div v-else class="results-list">
            <FlightCard
              v-for="flight in currentFlights"
              :key="flight._id"
              v-bind="flight"
              class="mb-4"
              @select="handleSelect(flight)"
            />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useFlightStore } from '../stores/flightStore';
import { useBookingStore } from '../stores/booking';
import FlightCard from "../components/FlightCard.vue";
import { Notyf } from 'notyf'; 

const notyf = new Notyf();

export default {
    name: "SearchResults",
    components: { FlightCard },

    data() {
        return {
            isRoundTrip: true, 
            selectedDeparture: null,
            flightStoreInstance: null,
            bookingStoreInstance: null,
            loading: false
        };
    },

    computed: {
        departureFlights() {
            return this.flightStoreInstance?.flightResults?.departureFlights || [];
        },
        returnFlights() {
            return this.flightStoreInstance?.flightResults?.returnFlights || [];
        },
        
        currentFlights() {
            if (this.isRoundTrip && this.selectedDeparture) {
                return this.returnFlights;
            } else {
                return this.departureFlights;
            }
        }
    },

    methods: {
        handleSelect(flight) {
            const passengerCount = this.$route.query.passengers || 1; 

            if (this.isRoundTrip && !this.selectedDeparture) {
                const departureDate = this.$route.query.date;
                this.bookingStoreInstance.setDepartureFlight(flight, departureDate);
                this.selectedDeparture = flight;
                notyf.success('Departure flight selected. Please choose your return flight.');
            } else {
                const returnDate = this.$route.query.returnDate;
                if (this.selectedDeparture) {
                    this.bookingStoreInstance.setReturnFlight(flight, returnDate);
                } else {
                    const departureDate = this.$route.query.date;
                    this.bookingStoreInstance.setDepartureFlight(flight, departureDate);
                }
                
                this.$router.push({ 
                    name: "FlightBooking", 
                    query: { passengers: passengerCount } 
                });
            }
        },
    },

    created() {
        this.flightStoreInstance = useFlightStore();
        this.bookingStoreInstance = useBookingStore();
        this.isRoundTrip = !!this.$route.query.returnDate;
    }
};
</script>

<style scoped>
.search-results-page,
.results-background,
html,
body {
  height: 100vh;
  overflow: hidden;
}
  
.results-background {
  background-image: url('../assets/images/slide1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.text-brand {
  color: whitesmoke;
  text-shadow: 2px 2px 4px rgba(0,0,0,5);
}

.no-flights-card {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1000px;
  min-height: 400px;
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  font-weight: 600;
  color: #333;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  padding: 1rem;
}

.no-flights-text {
  font-size: 1.5rem;
  margin-top: 1rem;
}

.results-list {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .no-flights-card {
    width: 95%;
    min-height: 400px;
    padding: 1.5rem;
  }
  .no-flights-text {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .no-flights-card {
    min-height: 300px;
    padding: 1rem;
  }
  .no-flights-text {
    font-size: 1.1rem;
  }
}
</style>