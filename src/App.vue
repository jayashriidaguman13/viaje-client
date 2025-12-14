<template>
  <Navbar 
    v-bind:is-logged-in="isLoggedIn"
    v-bind:is-admin="isAdmin"
    v-on:logout="logout"
  />
  <router-view />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import FlightCard from './components/FlightCard.vue'
import UserContext from './UserContext.js'
import { useRouter } from 'vue-router'
import { useGlobalStore } from './stores/global.js'

const router = useRouter()
const isLoggedIn = ref(false)
const isAdmin = ref(false)
const store = useGlobalStore()

if (store.user.token) {
  store.getUserDetails(store.user.token)
}

function updateUserState() {
  const user = UserContext.user
  if (user && user.token) {
    isLoggedIn.value = true
    isAdmin.value = user.isAdmin || false
  } else {
    isLoggedIn.value = false
    isAdmin.value = false
  }
}

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  UserContext.user = null
  updateUserState()
  router.push({ path: '/login' })
}

onMounted(updateUserState)
</script>