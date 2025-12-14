<template>
  <div class="flight-segment">
    <div class="flight-route">
      <h3 class="location-name">{{ flight.origin }}</h3>
      
      <div class="airplane-icon" :class="{ 'return-flight': isReturnFlight }">
        <img :src="airplaneIcon" alt="Airplane" />
      </div>

      <h3 class="location-name">{{ flight.destination }}</h3>
    </div>

    <div class="flight-details">
      <div class="date-time-container">
        <span class="detail-value">{{ flight.date }}</span>
        <span class="detail-value">{{ flight.departureTime }} - {{ flight.arrivalTime }}</span>
      </div>
    </div>

    <div class="subtotal">
      <span class="subtotal-label">Subtotal:</span>
      <span class="subtotal-value">{{ formatPrice(flight.subtotal) }}</span>
    </div>
  </div>
</template>

<script setup>
import airplaneIcon from '../assets/images/airplane-icon.png'

const props = defineProps({
  flight: {
    type: Object,
    required: true
  },
  isReturnFlight: {
    type: Boolean,
    default: false
  }
})

const formatPrice = (price) => {
  return `PHP ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<style scoped>
.flight-segment {
  width: 100%;
  max-width: 672px;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0eeef;
}

.flight-segment:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.flight-route {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
}

.location-name {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1A1A1A;
  margin: 0 0 1px 0;
}

.airplane-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0 15px;
}

.airplane-icon img {
  width: 25px;
  height: 26px;
  object-fit: contain;
}

.airplane-icon.return-flight img {
  transform: scaleX(-1);
}

.flight-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 6px 0;
  flex-grow: 1;
}

.detail-item {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail-label {
  font-weight: 600;
  color: #333;
  min-width: 70px;
}

.detail-value {
  color: #666;
  flex-grow: 1;
}

.date-time-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.passenger-name {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0;
  color: #1A1A1A;
}

.subtotal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
}

.subtotal-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0;
  color: #1A1A1A;
}

.subtotal-value {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0;
  color: #1A1A1A;
}


@media (max-width: 768px) {
  .flight-segment {
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .flight-route {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .airplane-icon {
    align-self: flex-start;
    transform: rotate(90deg);
    padding: 0.5rem 0;
    margin: 0 0 0 10px;
  }

  .airplane-icon.return-flight {
    transform: rotate(90deg) scaleX(-1);
  }

  .location-name {
    font-size: 1.1rem;
  }
  
  .date-time-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-item {
    flex-wrap: wrap;
  }

  .detail-label {
    min-width: 90px;
  }
}

@media (max-width: 480px) {
  .location-name {
    font-size: 1rem;
  }

  .subtotal-label,
  .subtotal-value,
  .passenger-name {
    font-size: 16px;
  }

  .detail-label,
  .detail-value {
    font-size: 13px;
  }

  .flight-segment {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
}
</style>