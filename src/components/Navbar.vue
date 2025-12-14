<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/"><img :src="Logo" alt="Logo" class="logo" /></router-link>
    </div>

    <ul class="navbar-center" v-if="!store.user.isLoading">
      <!-- Guest and regular user links -->
      <li v-if="!isAdmin"><router-link to="/">Home</router-link></li>
      <li v-if="!isAdmin"><router-link to="/services">Services</router-link></li>
      <li v-if="!isAdmin"><router-link to="/about-us">About Us</router-link></li>
      <li v-if="!isAdmin"><router-link to="/contact-us">Contact Us</router-link></li>

      <!-- Admin links -->
      <li v-if="isAdmin"><router-link to="/admin">Admin Dashboard</router-link></li>
      <li v-if="isAdmin"><router-link to="/admin/bookings">Bookings</router-link></li>
		</ul>

    <ul class="navbar-right" v-if="!store.user.isLoading">
      <li v-if="!isLoggedIn"><router-link to="/signup">Sign Up</router-link></li>
      <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
      <li v-if="isLoggedIn"><router-link to="/profile">Profile</router-link></li>
      <li v-if="isLoggedIn"><button class="logout-btn" @click="goToLogout">Logout</button></li>
    </ul>

    <div class="burger" @click="toggleMenu">☰</div>

    <div v-if="menuOpen && !store.user.isLoading" class="burger-menu">
      <li v-if="!isAdmin"><router-link to="/">Home</router-link></li>
      <router-link to="/admin" @click="toggleMenu" v-if="isAdmin">Admin Dashboard</router-link>
      <li v-if="isLoggedIn"><router-link to="/profile">Profile</router-link></li>
      <router-link to="/services" @click="toggleMenu" v-if="!isAdmin">Services</router-link>
      <router-link to="/about-us" @click="toggleMenu" v-if="!isAdmin">About Us</router-link>
      <router-link to="/contact-us" @click="toggleMenu" v-if="!isAdmin">Contact Us</router-link>

      <router-link to="/admin/bookings" @click="toggleMenu" v-if="isAdmin">Bookings</router-link>

      <router-link to="/signup" @click="toggleMenu" v-if="!isLoggedIn">Sign Up</router-link>
      <router-link to="/login" @click="toggleMenu" v-if="!isLoggedIn">Login</router-link>
      <button v-if="isLoggedIn" class="logout-btn" @click="goToLogout">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '../assets/images/logo.png'
import { useGlobalStore } from '../stores/global.js'

const store = useGlobalStore()  
const router = useRouter()

const isLoggedIn = computed(() => !!store.user.token)
const isAdmin = computed(() => !!store.user.isAdmin)
const menuOpen = ref(false)

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const goToLogout = () => {
    router.push({ path: '/logout', query: { pending: 'true' } });
    menuOpen.value = false;
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!store.user.token && token) {
    try {
      await store.getUserDetails(token)
    } catch {}
  }
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  color: white;
  font-family: 'Raleway', sans-serif;
  font-weight: 300;
  z-index: 1000;
}

.navbar-left .logo { height: 50px; }

.navbar-center, .navbar-right {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.navbar-center li a,
.navbar-right li a,
.logout-btn {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.1rem 0;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  color: white;
  padding: 0;
  margin: 0;
}

.burger {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.burger-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0 0 8px 8px;
  align-items: flex-start;
}

.burger-menu a,
.burger-menu .logout-btn {
  color: white;
  font-weight: 500;
  text-decoration: none;
  text-align: left;
  width: 100%;
  padding: 0;
}

@media (max-width: 992px) {
  .navbar-center, .navbar-right { display: none; }
  .burger { display: block; }
}
</style>