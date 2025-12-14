import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from "../api";
import axios from "axios"; 

export const useGlobalStore = defineStore('global', () => {
    const token = localStorage.getItem('token');
    let user = reactive({
        token,
        email: null,
        isAdmin: null,
        isLoading: false
    });

    async function getUserDetails(token, loginData = null) {        if (!token) {
            user.token = null;
            user.email = null;
            user.isAdmin = null;
            return;
        }

        user.isLoading = true;

        try {
            if (loginData) {
                user.email = loginData.email || null;
                user.isAdmin = loginData.isAdmin || null;
            } else {
                const { data } = await api.get("/user/profile");
                const profileData = data.user; 

                if (profileData) {
                    user.email = profileData.email;
                    user.isAdmin = profileData.isAdmin;
                } else {
                    console.error("Profile API succeeded but 'user' object was missing in the response data.");
                    throw new Error("Invalid profile data structure.");
                }
            }

            user.token = token;

        } catch (err) {
            console.error("Token Validation Failed (Logging out):", err);
            
            user.token = null;
            user.email = null;
            user.isAdmin = null;
            
            localStorage.removeItem('token'); 
            
        } finally {
            user.isLoading = false;
        }
    }

    function logout() {
        console.log("Performing full user logout cleanup.");
        
        user.token = null;
        user.email = null;
        user.isAdmin = null;

        localStorage.removeItem('token'); 
        
        delete axios.defaults.headers.common['Authorization'];
    }
    return { user, getUserDetails, logout };
});