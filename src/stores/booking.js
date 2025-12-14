import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBookingStore = defineStore('booking', () => {
  const passengers = ref([]);
  const departureFlight = ref(null);
  const returnFlight = ref(null);
  const departureFlightId = ref(null);
  const returnFlightId = ref(null);

  function setPassengers(passengerData) {
    passengers.value = passengerData;
  }

  function clearPassengers() {
    passengers.value = [];
  }

  function setDepartureFlight(flightData, selectedDate) {
    departureFlight.value = {
      ...flightData,
      departureDate: selectedDate,
      arrivalDate: selectedDate // For same-day flights, arrival is same date
    };
    departureFlightId.value = flightData._id;
  }

  function setReturnFlight(flightData, selectedDate) {
    returnFlight.value = {
      ...flightData,
      departureDate: selectedDate,
      arrivalDate: selectedDate
    };
    returnFlightId.value = flightData._id;
  }

  function setFlightIds(departureId, returnId = null) {
    departureFlightId.value = departureId;
    returnFlightId.value = returnId;
  }

  function clearFlightIds() {
    departureFlightId.value = null;
    returnFlightId.value = null;
  }

  function clearFlights() {
    departureFlight.value = null;
    returnFlight.value = null;
    clearFlightIds();
  }

  function clearAll() {
    clearPassengers();
    clearFlights();
  }

  return {
    passengers,
    departureFlight,
    returnFlight,
    departureFlightId,
    returnFlightId,
    setPassengers,
    clearPassengers,
    setDepartureFlight,
    setReturnFlight,
    setFlightIds,
    clearFlightIds,
    clearFlights,
    clearAll
  };
});
