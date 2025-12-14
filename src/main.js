import { createApp } from 'vue'
import './App.css'
import App from './App.vue'
import router from './router' 
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import axios from 'axios'
import UserContext from './UserContext.js'
import { createPinia } from 'pinia'
import 'notyf/notyf.min.css'

const app = createApp(App)
const pinia = createPinia();

app.provide('userContext', UserContext)

app.use(pinia) 

app.use(router)

app.mount('#app')