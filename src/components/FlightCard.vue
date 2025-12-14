<template>
  <div class="flight-card">
    <div class="flight-info">
      <div class="airline">
        <h2 class="airline-name">Viaje Airlines</h2>
        <span class="flight-number">{{ flightNumber }}</span>
      </div>

      <div class="route">
        <div class="location">
          <h3>{{ origin }}</h3>
          <p>{{ formattedDepartureDate }} — {{ departureTime }}</p>
        </div>

        <div class="arrow">
          <span>➜</span>
          <p class="duration">{{ flightDuration }}</p>
        </div>

        <div class="location">
          <h3>{{ destination }}</h3>
          <p>{{ formattedArrivalDate }} — {{ arrivalTime }}</p>
        </div>
      </div>
    </div>

    <div class="pricing">
      <p class="price">₱{{ (price || 0).toLocaleString() }}</p>
      <button class="btn-select" @click="handleSelect">Select</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/global.js'

const props = defineProps({
  flightNumber: String,
  origin: String,
  destination: String,
  departureDate: String,
  departureTime: String,
  arrivalDate: String,
  arrivalTime: String,
  price: Number
})

const emit = defineEmits(['select']);

const router = useRouter()
const store = useGlobalStore()

const isLoggedIn = computed(() => !!store.user.token)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formattedDepartureDate = computed(() => formatDate(props.departureDate || ''))
const formattedArrivalDate = computed(() => formatDate(props.arrivalDate || ''))

const flightDuration = computed(() => {
  if (!props.departureDate || !props.arrivalDate || !props.departureTime || !props.arrivalTime) return '--'
  const dep = new Date(`${props.departureDate}T${props.departureTime}`)
  const arr = new Date(`${props.arrivalDate}T${props.arrivalTime}`)
  const diffMs = arr - dep
  if (diffMs <= 0) return '--'
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60)
  return `${hours}h ${minutes}m`
})

const handleSelect = () => {
  if (isLoggedIn.value) {
    emit('select')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.flight-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem; 

  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1.6rem 2rem;
  margin: 1rem 0;

  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  transition: 0.25s ease;
}

.flight-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.airline-name {
  font-size: 1.4rem;
  color: #043b63;
  margin: 0;
  font-weight: 700;
}

.flight-number {
  color: #777;
  font-size: .9rem;
}

.route {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.location h3 {
  margin: 0;
  font-size: 1.3rem;
  white-space: nowrap; 
}

.location p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.arrow {
  text-align: center;
  flex-shrink: 1; 
}

.arrow span {
  font-size: 1.5rem;
  display: block;
  color: #043b63;
}

.duration {
  font-size: 0.85rem;
  color: #666;
}

.pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .5rem;
  flex-shrink: 0; 
}

.price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #043b63;
  margin: 0;
}

.btn-select {
  background: #046fd1;
  color: #fff;
  border: none;
  padding: .7rem 1.4rem;
  border-radius: 8px;
  font-size: .95rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-select:hover {
  background: #035aaa;
}

@media (max-width: 992px) {
  .flight-card {
    gap: 1.5rem; 
    padding: 1.25rem 1.5rem;   }

  .route {
    gap: 1.5rem; 
  }

  .location h3 {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .flight-card {
    flex-direction: column;
    align-items: stretch;
    text-align: left; 
    padding: 1rem;
  }

  .flight-info {
    width: 100%;
    margin-bottom: 1rem;
  }

   .route {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
  }

  .arrow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    order: 2; 
    padding: 0.5rem 0;
  }
  
  .arrow span {
    font-size: 1.2rem;
    margin: 0;
  }

  .duration {
    text-align: left;
    order: 1; 
  }
  
  .location {
    width: 100%;
    text-align: left;
    margin-top: 0.5rem;
    order: 3;
  }

  .pricing {
    flex-direction: row; 
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px dashed #e0e0e0;
  }

  .btn-select {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .flight-card {
    padding: 0.75rem;
  }
  
  .airline-name {
    font-size: 1.2rem;
  }

  .price {
    font-size: 1.3rem;
  }
}
</style>