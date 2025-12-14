<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-text-wrapper">
        <div class="hero-text text-center">
          <h1 class="brand-font">About <span class="text-brand">Viaje Airlines</span></h1>
          <p>Connecting the world safely, comfortably, and reliably since 1998.</p>
        </div>
      </div>
    </section>

    <!-- Company Overview -->
    <section class="overview container">
      <h2 class="fw-bold text-center mb-4">Our Story</h2>
      <p class="lead text-center mb-5">
		Founded in 2010, Viaje Airlines has been connecting travelers to new horizons with comfort and care. Inspired by the word “biyahe”, which means travel in Tagalog, our name embodies the spirit of every journey—whether it’s a weekend getaway, a family adventure, or a business trip. We believe that every flight should be more than just a ride; it should be an experience filled with excitement, discovery, and memories that last a lifetime. At Viaje Airlines, your journey begins the moment you step onboard.
      </p>
    </section>

    <!-- Mission, Vision, Values -->
    <section class="mission-values container">
      <div class="row text-center">
        <div class="col-md-4 mb-4">
          <div class="card-section p-4">
            <h3>Mission</h3>
            <p>To deliver exceptional air travel experiences with safety and reliability at the forefront.</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card-section p-4">
            <h3>Vision</h3>
            <p>To be the airline of choice for passengers seeking comfort, convenience, and trust.</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card-section p-4">
            <h3>Values</h3>
            <p>Excellence, integrity, innovation, and sustainability guide every decision we make.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fleet & Service -->
    <section class="fleet container">
      <h2 class="fw-bold text-center mb-4">Our Fleet & Services</h2>
      <p class="text-center mb-5">Modern aircraft, comfortable cabins, and attentive service make every flight a memorable experience.</p>
      <div class="row justify-content-center">
        <div class="col-md-4 mb-4">
          <div class="card-section p-3">
            <img src="../assets/images/about-airplane.png" class="img-fluid rounded mb-3" />
            <p>State-of-the-art aircraft for long-haul comfort.</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card-section p-3">
            <img src="../assets/images/plane-interior.jpg" class="img-fluid rounded mb-3" />
            <p>Cabin experience designed for your relaxation and productivity.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Commitment Section -->
    <section class="commitment text-center py-5">
      <div class="container">
        <h2 class="fw-bold mb-3">Safety & Sustainability</h2>
        <p>
          At <span class="text-brand">Viaje Airlines</span>, safety is our top priority, and sustainability is embedded in every operation. 
          We are committed to reducing our carbon footprint and promoting responsible travel.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap');

.hero {
  position: relative;
  height: 70vh;
  background: url('../assets/images/airplane-bg.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-text-wrapper {
  background-color: rgba(255,255,255,0.8);
  border-radius: 16px;
  padding: 2rem 3rem;
}

.hero-text { 
  color: #FF7518;  
}

.brand-font {
  font-family: 'Kaushan Script', cursive;
}

.card-section {
  background-color: rgba(255,255,255,0.9);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.text-brand { 
  color: #00588e; 
}

.overview h2 {
	margin-top: 30px;
}

.container { max-width: 1200px; }

@media(max-width:575.98px){
  .hero { height: 50vh; }
  .hero-text-wrapper { padding: 1.5rem 2rem; }
  h1 { font-size: 2rem; }
}
</style>