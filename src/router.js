import { createRouter, createWebHistory } from 'vue-router';
import { useGlobalStore } from './stores/global.js';

// Public Pages
import Home from './pages/Home.vue';
import AboutUs from './pages/AboutUs.vue';
import ContactUs from './pages/ContactUs.vue';
import Services from './pages/Services.vue';
import SearchResults from './pages/SearchResults.vue';

// Authentication & User Pages
import LoginPage from './pages/LoginPage.vue';
import SignupPage from './pages/SignupPage.vue';
import LogoutPage from './pages/LogoutPage.vue';
import UserProfilePage from './pages/UserProfile.vue';

// Transaction & Flow Pages
import PaymentPage from './pages/PaymentPage.vue';
import FlightBooking from './pages/FlightBooking.vue';
import FlightBookingSummary from './pages/FlightBookingSummary.vue';
import BookingSuccess from './pages/BookingSuccess.vue';

// Admin & Error Pages
import AdminDashboard from './pages/AdminDashboard.vue';
import AllBookings from './pages/AllBookings.vue';
import ForbiddenView from './components/ForbiddenView.vue';


const routes = [
    // Public Routes 
    { path: '/', name: 'Home', component: Home },
    { path: '/services', name: 'Services', component: Services },
    { path: '/about-us', name: 'AboutUs', component: AboutUs },
    { path: '/contact-us', name: 'ContactUs', component: ContactUs },
    { path: '/search', name: 'SearchResults', component: SearchResults },

    // Authentication Routes
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/signup', name: 'Signup', component: SignupPage },
    { path: '/logout', name: 'Logout', component: LogoutPage }, 
    { path: '/forbidden', name: 'Forbidden', component: ForbiddenView },

    // Protected User Routes (Requires Auth) 
    { path: '/profile', name: 'Profile', component: UserProfilePage, meta: { requiresAuth: true } },
    { path: '/flight-booking', name: 'FlightBooking', component: FlightBooking, meta: { requiresAuth: true } },
    { path: '/booking-summary', name: 'BookingSummary', component: FlightBookingSummary, meta: { requiresAuth: true } },
    { path: '/booking/payment', name: 'PaymentPage', component: PaymentPage, meta: { requiresAuth: true } },
    { path: '/booking-success', name: 'BookingSuccess', component: BookingSuccess, meta: { requiresAuth: true } },

    // Admin Routes (Requires Admin)
    { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/admin/bookings', name: 'AllBookings', component: AllBookings, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const globalStore = useGlobalStore();
    const isLoggedIn = !!globalStore.user.token;
    const isAdmin = !!globalStore.user.isAdmin;

    if (to.path === '/logout' && to.query.pending === 'true') {
        return next();
    }
    
    if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (!isLoggedIn) {
            return next({ path: '/login', query: { redirect: to.fullPath } });
        }
        
        if (!isAdmin) {
            return next({ name: 'Forbidden' });
        }
    }

    if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
        return next({ path: '/login', query: { redirect: to.fullPath } });
    }
    if (isLoggedIn && (to.name === 'Login' || to.name === 'Signup')) {
        return next({ name: 'Profile' }); 
    }

    next();
});

export default router;