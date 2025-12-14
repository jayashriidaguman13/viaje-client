<template>
  <div class="forbidden-page d-flex flex-column align-items-center justify-content-center text-center">
    
    <img :src="Logo" alt="Brand Logo" class="forbidden-logo mb-4" />

    <h1 class="display-3 fw-bold text-danger mb-3">403 - Access Denied</h1>
    <p class="lead mb-5 text-muted">
      You do not have the necessary permissions to view this page.
      <br>
      Administrative privileges are required.
    </p>

    <router-link to="/" class="btn btn-brand btn-lg fw-semibold">
      Go to Homepage
    </router-link>
  </div>
</template>

<script setup>
import Logo from '../assets/images/logo2.png';
</script>

<style scoped>
.forbidden-page {
  min-height: 100vh; 
  padding: 20px;
  background-color: #f8f9fa;
}

.forbidden-logo {
  max-width: 150px; 
  height: auto;
}

.btn-brand {
    background-color: #007bff; 
    border-color: #007bff;
    color: white;
}

.btn-brand:hover {
    background-color: #0056b3;
    border-color: #004085;
}
</style>