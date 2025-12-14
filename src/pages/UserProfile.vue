<template>
  <div class="user-profile-page">
    <!-- Background wrapper (same idea as Login page) -->
    <div class="profile-background d-flex align-items-start justify-content-center">
      <div class="container py-5">

        <!-- PROFILE HEADER -->
        <div class="row justify-content-center mb-4">
          <div class="col-12 col-lg-10">
            <div class="profile-hero-badge">
              <h1 class="profile-title mb-2">My Profile</h1>
              <p class="profile-subtitle mb-0">
                Manage your traveler details and review your bookings.
              </p>
            </div>
          </div>
        </div>

        <!-- PROFILE + ACTIONS -->
        <div class="row justify-content-center mb-5">
          <div class="col-12 col-lg-10">
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
                  <h5 class="card-title mb-2 mb-sm-0 text-brand">Profile Details</h5>

                  <!-- View mode buttons -->
                  <div v-if="!isEditing" class="btn-group">
                    <button class="btn btn-brand btn-sm" type="button" @click="startEdit">
                      Edit Profile
                    </button>
                    <button class="btn btn-outline-brand btn-sm" type="button" @click="showChangePasswordModal">
                      Change Password
                    </button>
                  </div>

                  <!-- Edit mode buttons -->
                  <div v-else class="btn-group">
                    <!-- submit button tied to form -->
                    <button class="btn btn-brand btn-sm" type="submit" form="profile-form">
                      Save Changes
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" type="button" @click="cancelEdit">
                      Cancel
                    </button>
                  </div>
                </div>

                <!-- PROFILE FORM -->
                <form id="profile-form" @submit.prevent="saveProfile">
                  <div class="row g-3">
                    <!-- First Name -->
                    <div class="col-12 col-md-6">
                      <label class="form-label fw-semibold" for="firstName">First Name</label>
                      <input id="firstName" type="text" class="form-control" v-model.trim="profile.firstName"
                        :readonly="!isEditing" :class="{ 'is-invalid': errors.firstName }" />
                      <div v-if="errors.firstName" class="invalid-feedback">
                        {{ errors.firstName }}
                      </div>
                    </div>

                    <!-- Last Name -->
                    <div class="col-12 col-md-6">
                      <label class="form-label fw-semibold" for="lastName">Last Name</label>
                      <input id="lastName" type="text" class="form-control" v-model.trim="profile.lastName"
                        :readonly="!isEditing" :class="{ 'is-invalid': errors.lastName }" />
                      <div v-if="errors.lastName" class="invalid-feedback">
                        {{ errors.lastName }}
                      </div>
                    </div>

                    <!-- Birthday -->
                    <div class="col-12 col-md-4">
                      <label class="form-label fw-semibold" for="birthday">Birthday</label>
                      <input id="birthday" type="date" class="form-control" v-model="profile.birthday"
                        :readonly="!isEditing" :class="{ 'is-invalid': errors.birthday }" />
                      <div v-if="errors.birthday" class="invalid-feedback">
                        {{ errors.birthday }}
                      </div>
                    </div>

                    <!-- Email -->
                    <div class="col-12 col-md-4">
                      <label class="form-label fw-semibold" for="email">Email</label>
                      <input id="email" type="email" class="form-control" v-model.trim="profile.email"
                        :readonly="!isEditing" :class="{ 'is-invalid': errors.email }" />
                      <div v-if="errors.email" class="invalid-feedback">
                        {{ errors.email }}
                      </div>
                    </div>

                    <!-- Phone -->
                    <div class="col-12 col-md-4">
                      <label class="form-label fw-semibold" for="phone">Phone Number</label>
                      <input id="phone" type="tel" class="form-control" v-model.trim="profile.phone"
                        :readonly="!isEditing" :class="{ 'is-invalid': errors.phone }" placeholder="09XXXXXXXXX" />
                      <div v-if="errors.phone" class="invalid-feedback">
                        {{ errors.phone }}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- MY BOOKINGS SECTION -->
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="card-title mb-3 text-brand">My Bookings</h5>

                <div v-if="bookings.length === 0" class="text-muted">
                  No bookings yet.
                </div>

                <div v-else class="row g-3">
                  <div v-for="booking in bookings" :key="booking._id" class="col-12 col-md-6">
                    <div class="card booking-card h-100">
                      <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <h6 class="mb-0 fw-semibold">
                            {{ booking.bookingType === 'roundTrip' ? 'Round Trip' : 'One Way' }}
                          </h6>
                          <span class="badge bg-secondary text-capitalize">
                            {{ booking.status }}
                          </span>
                        </div>

                        <div v-if="booking.flightId">
                          <!-- One-way -->
                          <div v-if="booking.bookingType === 'oneWay'">
                            <p class="mb-1 small text-muted">Departure</p>
                            <p class="mb-1 fw-semibold">
                              {{ booking.flightId.origin }} → {{ booking.flightId.destination }}
                            </p>
                            <p class="mb-1 small">
                              {{ formatBookingDate(booking.departureDate || booking.flightId.departureDate) }} • {{ formatBookingTime(booking.flightId.departureTime) }}
                            </p>
                            <p class="mb-1 small text-muted">
                              Flight: {{ booking.flightNumber }}
                            </p>
                            <p class="mb-1 small text-muted">
                              Passengers: {{ booking.passengers.length }} • Total: ₱{{ booking.totalAmount.toLocaleString() }}
                            </p>
                          </div>

                          <!-- Round-trip: two legs -->
                          <div v-else>
                            <p class="mb-1 small text-muted">Departure Flight</p>
                            <p class="mb-1 fw-semibold">
                              {{ booking.flightId.origin }} → {{ booking.flightId.destination }}
                            </p>
                            <p class="mb-2 small">
                              {{ formatBookingDate(booking.departureDate || booking.flightId.departureDate) }} • {{ formatBookingTime(booking.flightId.departureTime) }}
                            </p>
                            <p class="mb-1 small text-muted">
                              Flight: {{ booking.flightNumber }}
                            </p>

                            <hr class="my-2" />

                            <p class="mb-1 small text-muted">Return Flight</p>
                            <p class="mb-1 fw-semibold">
                              {{ booking.flightId.destination }} → {{ booking.flightId.origin }}
                            </p>
                            <p class="mb-1 small" v-if="booking.returnDate">
                              {{ formatBookingDate(booking.returnDate) }}
                            </p>
                            <p class="mb-1 small text-muted" v-else>
                              (Return flight details may vary)
                            </p>
                            <p class="mb-1 small text-muted">
                              Passengers: {{ booking.passengers.length }} • Total: ₱{{ booking.totalAmount.toLocaleString() }}
                            </p>
                          </div>
                        </div>

                        <div class="mt-auto pt-3 text-end">
                          <button type="button" class="btn btn-sm btn-outline-danger"
                            @click="requestCancelBooking(booking)">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> <!-- row g-3 -->
              </div>
            </div>
          </div>
        </div>

      </div> <!-- /.container -->
    </div> <!-- /.profile-background -->

    <!-- CHANGE PASSWORD MODAL (Bootstrap) -->
    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h5 class="modal-title">Change Password</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold" for="newPassword">
                New Password
              </label>
              <input id="newPassword" type="password" class="form-control" v-model.trim="newPassword" />
            </div>
            <div class="mb-1">
              <label class="form-label fw-semibold" for="confirmPassword">
                Confirm Password
              </label>
              <input id="confirmPassword" type="password" class="form-control" v-model.trim="confirmPassword" />
            </div>
            <p v-if="passwordError" class="text-danger small mt-2">
              {{ passwordError }}
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
              Cancel
            </button>
            <button class="btn btn-brand btn-sm" @click="savePassword">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CANCEL BOOKING CONFIRM MODAL (Bootstrap) -->
    <div class="modal fade" id="cancelBookingModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h5 class="modal-title">Cancel Booking</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to cancel?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
              No
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmCancelBooking">
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { Notyf } from 'notyf'
import api from '../api.js'
import { useGlobalStore } from '../stores/global.js'
import { Modal } from 'bootstrap'

const notyf = new Notyf()
const { user } = useGlobalStore()   

const profile = reactive({
  firstName: '',
  lastName: '',
  birthday: '',
  email: '',
  phone: ''
})

const originalProfile = ref({ ...profile })
const isEditing = ref(false)
const errors = reactive({
  firstName: '',
  lastName: '',
  birthday: '',
  email: '',
  phone: ''
})

// Password fields
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')

// Bookings from API
const bookings = ref([])

const bookingToCancel = ref(null)
const loadingProfile = ref(false)

const clearProfileErrors = () => {
  errors.firstName = ''
  errors.lastName = ''
  errors.birthday = ''
  errors.email = ''
  errors.phone = ''
}

const fetchProfile = async () => {
  try {
    loadingProfile.value = true

    const { data } = await api.get('/user/profile')

    const u = data.user || {}

    profile.firstName = u.firstName || ''
    profile.lastName = u.lastName || ''
    if (u.birthday) {
      const iso = u.birthday.toString()
      profile.birthday = iso.substring(0, 10)  
    } else {
      profile.birthday = ''
    }

    profile.email = u.email || ''
    profile.phone = u.phoneNumber || u.mobileNo || ''

    originalProfile.value = { ...profile }
  } catch (err) {
    console.error('Error loading profile:', err)
    notyf.error('Failed to load profile details.')
  } finally {
    loadingProfile.value = false
  }
}

const fetchBookings = async () => {
  try {
    const { data } = await api.get('/booking/my-bookings')
    bookings.value = data.bookings || []
    console.log(JSON.stringify(bookings.value, null, 2))
  } catch (err) {
    console.error('Error loading bookings:', err)
    notyf.error('Failed to load bookings.')
  }
}

onMounted(async () => {
  await Promise.all([fetchProfile(), fetchBookings()])
})

// ---------- Profile editing ----------
const startEdit = () => {
  originalProfile.value = { ...profile }
  clearProfileErrors()
  isEditing.value = true
}

const validateProfile = () => {
  let valid = true
  clearProfileErrors()

  if (!profile.firstName) {
    errors.firstName = 'First name is required.'
    valid = false
  }
  if (!profile.lastName) {
    errors.lastName = 'Last name is required.'
    valid = false
  }
  if (!profile.birthday) {
    errors.birthday = 'Birthday is required.'
    valid = false
  }
  if (!profile.email) {
    errors.email = 'Email is required.'
    valid = false
  } else {
    const pattern = /\S+@\S+\.\S+/
    if (!pattern.test(profile.email)) {
      errors.email = 'Please enter a valid email address.'
      valid = false
    }
  }
  if (!profile.phone) {
    errors.phone = 'Phone number is required.'
    valid = false
  } else {
    const digitsOnly = /^\d+$/
    if (!digitsOnly.test(profile.phone)) {
      errors.phone = 'Phone number must be numeric.'
      valid = false
    } else if (profile.phone.length !== 11) {
      errors.phone = 'Phone number must be 11 digits.'
      valid = false
    }
  }

  if (!valid) {
    notyf.error('Please fix the errors in your profile.')
  }
  return valid
}

const saveProfile = async () => {
  if (!validateProfile()) return

  try {
    await api.put('/user/update-profile',
      {
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthday: profile.birthday,
        email: profile.email,
        phoneNumber: profile.phone,   
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    )

    notyf.success('✅ Profile successfully updated')
    originalProfile.value = { ...profile }
    isEditing.value = false
  } catch (err) {
    console.error('Error updating profile:', err)
    notyf.error('Failed to update profile.')
  }
}

const cancelEdit = () => {
  Object.assign(profile, originalProfile.value)
  clearProfileErrors()
  isEditing.value = false
}

// ---------- Password modal (Bootstrap) ----------
const showChangePasswordModal = () => {
  resetPasswordForm()

  showModal('changePasswordModal')
}

const resetPasswordForm = () => {
  newPassword.value = ''
  confirmPassword.value = ''
  passwordError.value = ''
}

const savePassword = async () => {
  passwordError.value = ''

  if (!newPassword.value || !confirmPassword.value) {
    passwordError.value = 'Both fields are required.'
    notyf.error('Please fill in both password fields.')
    return
  }

  if (newPassword.value.length < 6) {
    passwordError.value = 'Password should be at least 6 characters.'
    notyf.error('Password too short.')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match.'
    notyf.error('Passwords do not match.')
    return
  }

  try {
    await api.put('/user/update-password',
      { newPassword: newPassword.value, confirmPassword: confirmPassword.value },   
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    )

    notyf.success('🔒 Password successfully changed')

    resetPasswordForm()

    hideModal('changePasswordModal')
  } catch (err) {
    console.error('Error changing password:', err)
    notyf.error('Failed to change password.')
  }
}

// ---------- Cancel booking (still demo) ----------
const requestCancelBooking = (booking) => {
  bookingToCancel.value = booking

  showModal('cancelBookingModal')
}

const confirmCancelBooking = async () => {
  if (!bookingToCancel.value) return

  try {
    // TODO: Call API to cancel booking
    // await api.delete(`/booking/${bookingToCancel.value._id}`)
    
    bookings.value = bookings.value.filter(
      (b) => b._id !== bookingToCancel.value._id
    )
    notyf.error('❌ Booking canceled.')

    hideModal('cancelBookingModal')
    bookingToCancel.value = null
  } catch (err) {
    console.error('Error canceling booking:', err)
    notyf.error('Failed to cancel booking.')
  }
}

// Format booking date
const formatBookingDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Format booking time
const formatBookingTime = (timeString) => {
  if (!timeString) return ''
  if (timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }
  return timeString
}

const showModal = (id) => {
  const modalElement = document.getElementById(id)
  if (modalElement) {
    const modal = new Modal(modalElement)
    modal.show()
  }
}

const hideModal = (id) => {
  const modalElement = document.getElementById(id)
  if (modalElement) {
    const modal = Modal.getInstance(modalElement)
    if (modal) {
      modal.hide()

      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove())
    }
  }
}
</script>


<style scoped>
/* Layout + background */
.user-profile-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.profile-background {
  flex: 1;
  position: relative;
  background-image: url('../assets/images/home-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

/* Brighter, lighter overlay for readability */
.profile-background::before {
  content: "";
  position: absolute;
  inset: 0;
  /* was rgba(0, 0, 0, 0.25 / 0.35) – dark
     now lighter so the whole page looks brighter */
  background: rgba(0, 0, 0, 0.15);
  pointer-events: none;
}

.profile-title {
  /* was #00456e */
  color: #005b96;
  font-weight: 800;
}


/* Subtitle in white, with shadow for readability */
.profile-subtitle {
  color: #005b96;;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
}

/* content above overlay */
.profile-background>.container {
  position: relative;
  z-index: 1;
}

/* Brand color */
.text-brand {
  color: #00588e;
}

.btn-brand {
  background-color: #00588e;
  border-color: #00588e;
  color: #ffffff;
}

.btn-brand:hover,
.btn-brand:focus {
  background-color: #00456e;
  border-color: #00456e;
  color: #ffffff;
}

.btn-outline-brand {
  border-color: #00588e;
  color: #00588e;
}

.btn-outline-brand:hover,
.btn-outline-brand:focus {
  background-color: #00588e;
  color: #ffffff;
}

/* Cards with slight glass effect */
.card {
  /* was rgba(255, 255, 255, 0.9) – now closer to pure white */
  background-color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.18);
}

/* Booking cards */
.booking-card {
  border-radius: 0.75rem;
}

.booking-card .card-body {
  padding: 1rem 1.25rem;
}

/* Responsive tweaks */
@media (max-width: 575.98px) {
  .user-profile-page .card-body {
    padding: 1.25rem;
  }
}
</style>