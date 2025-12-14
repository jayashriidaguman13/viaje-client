import { defineStore } from 'pinia';

export const useFlightStore = defineStore('flight', {
  state: () => ({
    flightResults: null, 
  }),
  actions: {
    setFlights(data) {
      this.flightResults = data;
    },
    clearFlights() {
      this.flightResults = null;
    }
  },
  getters: {
    departureFlights: (state) => state.flightResults?.departureFlights || [],
  }
});