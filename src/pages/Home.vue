<template>
  <div class="page-container">
    <section class="hero-section" id="home">
      <div class="carousel-background" :style="{ backgroundImage: `url(${images[currentImage]})` }"></div>
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <div class="hero-text">
          <h1>Experience Travel<br>and Lifestyle</h1>
          <router-link to="/services" class="learn-more-btn">Learn More</router-link>
        </div>

        <div class="search-wrapper-centered">
          <FlightSearchBar />
        </div>
      </div>
    </section>

    <section class="top-destinations-section" id="destinations">
      <h2 class="section-title">Top Destinations</h2>
      <div class="container mt-4">
        <div class="row g-4">
          <div class="col-lg-3 col-md-6" v-for="destination in destinations" :key="destination.name">
            <a :href="destination.url" class="destination-card" target="_blank" rel="noopener noreferrer">
              <div class="destination-image" :style="{ backgroundImage: `url(${destination.image})` }"></div>
              <div class="destination-info">
                <h5>{{ destination.name }}</h5>
                <p>{{ destination.country }}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="packages-section">
      <h2 class="section-title">Packages & Deals</h2>
      <div class="container mt-4">
        <div class="row g-4">
          <div class="col-lg-3 col-md-6" v-for="pkg in packages" :key="pkg.title">
            <a :href="pkg.url" class="package-card" target="_blank" rel="noopener noreferrer">
              <div class="package-image" :style="{ backgroundImage: `url(${pkg.image})` }"></div>
              <div class="package-info">
                <h5>{{ pkg.title }}</h5>
                <p class="package-desc">{{ pkg.description }}</p>
                <div class="package-price">From <span>₱{{ pkg.price.toLocaleString() }}</span></div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <div class="accordion mt-4" id="faqAccordion">
          <div class="accordion-item" v-for="(faq, index) in faqs" :key="index">
            <h2 class="accordion-header" :id="'heading' + index">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + index"
                aria-expanded="false"
                :aria-controls="'collapse' + index"
              >
                {{ faq.question }}
              </button>
            </h2>
            <div
              :id="'collapse' + index"
              class="accordion-collapse collapse"
              :aria-labelledby="'heading' + index"
              data-bs-parent="#faqAccordion"
            >
              <div class="accordion-body">{{ faq.answer }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer-section">
      <div class="container">
        <div class="footer-top row align-items-start" id="content">
          <div class="col-md-4 mb-3 text-start">
            <h5>Quick Links</h5>
            <ul class="footer-links">
              <li><a href="#home">Home</a></li>
              <li><router-link to="/services">Services</router-link></li>
              <li><a href="#destinations">Top Destinations</a></li>
              <li><router-link to="/contact-us">Contact Us</router-link></li>
            </ul>
          </div>
          <div class="col-md-4 mb-3 text-center">
            <h5>Follow Us</h5>
            <div class="social-icons">
              <a href="https://www.facebook.com/" target="_blank"><img :src="facebookIcon" alt="Facebook" /></a>
              <a href="https://www.x.com/" target="_blank"><img :src="twitterIcon" alt="Twitter" /></a>
              <a href="https://www.instagram.com/" target="_blank"><img :src="instagramIcon" alt="Instagram" /></a>
            </div>
          </div>
          <div class="col-md-4 mb-3 text-md-end text-start">
            <h5>Disclaimer</h5>
            <p class="disclaimer">This website is a <strong>school project</strong> created for educational purposes. No actual bookings or transactions are processed.</p>
          </div>
        </div>
        <div class="footer-bottom text-center mt-4">
          &copy; {{ new Date().getFullYear() }} Airline Project. All rights reserved.
        </div>
      </div>
      <button id="backToTop" class="back-to-top" @click="scrollToTop" v-show="showBackToTop">↑</button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import FlightSearchBar from '../components/FlightSearchBar.vue'
import facebookIcon from '../assets/images/facebook.png'
import twitterIcon from '../assets/images/twitter.png'
import instagramIcon from '../assets/images/instagram.png'

const currentImage = ref(0)
let interval = null

const images = [
  new URL('../assets/images/slide1.jpg', import.meta.url).href,
  new URL('../assets/images/slide2.jpeg', import.meta.url).href,
  new URL('../assets/images/slide3.jpeg', import.meta.url).href,
]

const destinations = [
  { name: 'Tokyo', country: 'Japan', image: new URL('../assets/images/destinations/tokyo.jpeg', import.meta.url).href, url: 'https://en.wikipedia.org/wiki/Tokyo' },
  { name: 'Paris', country: 'France', image: new URL('../assets/images/destinations/paris.jpg', import.meta.url).href, url: 'https://en.wikipedia.org/wiki/Paris' },
  { name: 'New York', country: 'USA', image: new URL('../assets/images/destinations/new-york.jpeg', import.meta.url).href, url: 'https://en.wikipedia.org/wiki/New_York_City' },
  { name: 'Sydney', country: 'Australia', image: new URL('../assets/images/destinations/sydney.jpg', import.meta.url).href, url: 'https://en.wikipedia.org/wiki/Sydney' }
]

const packages = [
  { title: 'Tokyo City Escape', description: '5 days · Flight + Hotel', price: 48999, image: new URL('../assets/images/packages/tokyo.webp', import.meta.url).href, url: 'https://example.com/packages/tokyo' },
  { title: 'Romantic Paris Getaway', description: '4 days · Flight + Hotel', price: 48999, image: new URL('../assets/images/packages/paris.jpg', import.meta.url).href, url: 'https://example.com/packages/paris' },
  { title: 'New York Explorer', description: '6 days · Flight + Hotel', price: 69999, image: new URL('../assets/images/packages/new-york.webp', import.meta.url).href, url: 'https://example.com/packages/newyork' },
  { title: 'Sydney Adventure', description: '5 days · Flight + Hotel', price: 65999, image: new URL('../assets/images/packages/sydney.webp', import.meta.url).href, url: 'https://example.com/packages/sydney' }
]

const faqs = [
  { question: 'How do I book a flight?', answer: 'You can search for your desired destination using the flight search bar and follow the booking steps provided.' },
  { question: 'Can I change my travel dates after booking?', answer: 'Yes, changes are possible depending on the airline’s policy. Please check the terms and conditions for each booking.' },
  { question: 'Are there any discounts for students?', answer: 'Some packages and destinations may offer student discounts. Look out for the special tags on eligible packages.' },
  { question: 'What is your cancellation policy?', answer: 'Cancellations are subject to airline and package terms. Fees may apply depending on timing and fare type.' }
]

const showBackToTop = ref(false)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => {
  interval = setInterval(() => {
    currentImage.value = (currentImage.value + 1) % images.length
  }, 8000)
  window.addEventListener('scroll', () => {
    showBackToTop.value = window.scrollY > 300
  })
})

onBeforeUnmount(() => clearInterval(interval))
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Satisfy&display=swap");

.page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
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
  0% { opacity: 1; }
  33% { opacity: 0.7; }
  66% { opacity: 1; }
  100% { opacity: 1; }
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
  height: 100%;
  gap: 20px;
}

.hero-text {
  align-self: flex-start; 
  padding-left: 60px;
  color: white;
}

.search-wrapper-centered {
  width: 100%;
  display: flex;
  justify-content: center; 
  padding: 0 20px;
  box-sizing: border-box;
}

.hero-text h1 {
  margin: 0;
  font-family: 'Satisfy', sans-serif;
  font-size: 4rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.6);
}

.learn-more-btn {
  display: inline-block;
  padding: 6px 16px;
  background: #ffffffcc;
  color: #003366;
  font-weight: 600;
  border-radius: 6px;
  text-decoration: none;
  transition: 0.3s ease;
  width: auto;
  align-self: flex-start;
}

.learn-more-btn:hover {
  background: white;
  transform: translateY(-1px);
}

.top-destinations-section,
.packages-section,
.faq-section {
  padding: 60px 20px;
  text-align: center;
  background: #f7faff;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #003366;
}

.destination-card,
.package-card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 14px;
  overflow: hidden;
  background: white;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.destination-card:hover,
.package-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}

.destination-image,
.package-image {
  height: 220px;
  background-size: cover;
  background-position: center;
}

.destination-info,
.package-info {
  padding: 16px;
  text-align: center;
}

.destination-info h5,
.package-info h5 {
  margin: 0 0 6px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #003366;
}

.destination-info p,
.package-desc {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #666;
}

.package-price {
  font-size: 0.95rem;
  font-weight: 600;
  color: #003366;
}

.package-price span {
  font-size: 1.2rem;
  color: #0077cc;
}

.faq-section .accordion-button {
  background-color: white;
  color: #003366;
  font-weight: 600;
  border-radius: 8px;
  margin-bottom: 10px;
}

.faq-section .accordion-button:focus {
  box-shadow: none;
}

.faq-section .accordion-body {
  text-align: left;
  color: #333;
  font-size: 0.95rem;
}

.footer-section {
  padding-top: 20px;
  text-align: center;
  background: #003366;
  color: white;
}

.footer-section .container {
  padding-bottom: 0px;
  margin-bottom: 0rem;
}

.footer-section h5 {
  font-weight: 700;
  margin-bottom: 12px;
}

.footer-links {
  list-style: none;
  padding: 0;
  text-align: left;
}

.footer-links li {
  margin-bottom: 6px;
}

.footer-links a {
  color: #ffffffcc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-icons img {
  width: 28px;
  height: 28px;
  transition: transform 0.3s ease;
}

.disclaimer {
  font-size: 0.85rem;
  color: #ffffffcc;
}

.footer-bottom {
  font-size: 0.85rem;
  color: #ffffffaa;
}

.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #0077cc;
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: background 0.3s;
  z-index: 999;
}

.back-to-top:hover {
  background: #00bfff;
}

@media (max-width: 992px) {
  .hero-content {
    align-items: center;
    padding-left: 0;
    padding-right: 0;
    text-align: center;
    margin-top: 6rem;
  }

  .hero-text {
    width: 100%;
    text-align: center;
    padding-left: 0px;
  }

  .hero-text h1 {
    font-size: 2.8rem;
  }
}

@media (max-width: 576px) {
  .hero-content {
    margin-top: 70px;
  }

  .hero-text h1 {
    font-size: 2rem;
    padding-left: 0px;

  }
}
</style>