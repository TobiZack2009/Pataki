/**
 * @fileoverview Main entry point for the Pataki application.
 * Handles initialization, routing, and core state management.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Initialize Firebase (config should be populated with actual values)
// For MVP, we use placeholder or env values
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "pataki-health.firebaseapp.com",
    projectId: "pataki-health",
    storageBucket: "pataki-health.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Basic Vanilla Router
 * @param {string} route 
 */
const router = async (route) => {
    const appEl = document.getElementById('app');
    
    // Smooth transition
    appEl.style.opacity = 0;
    
    setTimeout(async () => {
        switch (route) {
            case '/':
                // Landing page is already in index.html, but we can re-render if needed
                location.reload(); 
                break;
            case '/triage':
                appEl.innerHTML = renderTriage();
                attachTriageListeners();
                break;
            case '/insurance':
                appEl.innerHTML = renderInsurance();
                break;
            case '/wallet':
                appEl.innerHTML = renderWallet();
                break;
            default:
                appEl.innerHTML = '<h1 class="text-3xl">404 - Path not found</h1>';
        }
        appEl.style.opacity = 1;
    }, 300);
};

// Listen for navigation
window.addEventListener('popstate', () => {
    router(window.location.pathname);
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Pataki Initialized');
    
    // Handle auth state
    onAuthStateChanged(auth, (user) => {
        const authBtn = document.getElementById('auth-btn');
        if (user) {
            authBtn.textContent = 'Logout';
            authBtn.onclick = () => auth.signOut();
        } else {
            authBtn.textContent = 'Login';
            // Trigger login flow
        }
    });

    // Start Triage Button
    const startTriageBtn = document.getElementById('start-triage');
    if (startTriageBtn) {
        startTriageBtn.addEventListener('click', () => {
            history.pushState(null, '', '/triage');
            router('/triage');
        });
    }
});

/**
 * Triage Template
 * @returns {string}
 */
function renderTriage() {
    return `
        <div class="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="space-y-2">
                <h2 class="text-4xl font-medium tracking-tight">How can we help today?</h2>
                <p class="text-md-on-surface-variant text-lg">Choose a way to describe your symptoms.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Voice Input Card -->
                <button id="voice-input" class="flex flex-col items-center p-8 bg-md-surface-container rounded-md-2xl shadow-sm hover:md-shadow-2 hover:bg-md-primary/5 active:scale-95 transition-all duration-300 group">
                    <div class="w-16 h-16 rounded-full bg-md-primary text-md-on-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    <span class="text-xl font-medium">Speak</span>
                    <span class="text-sm text-md-on-surface-variant">Pidgin, Yoruba, English</span>
                </button>

                <!-- Text Input Card -->
                <button id="text-input" class="flex flex-col items-center p-8 bg-md-surface-container rounded-md-2xl shadow-sm hover:md-shadow-2 hover:bg-md-primary/5 active:scale-95 transition-all duration-300 group">
                    <div class="w-16 h-16 rounded-full bg-md-tertiary text-md-on-tertiary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <span class="text-xl font-medium">Type</span>
                    <span class="text-sm text-md-on-surface-variant">Chat with Pataki AI</span>
                </button>

                <!-- Scan Input Card -->
                <button id="scan-input" class="flex flex-col items-center p-8 bg-md-surface-container rounded-md-2xl shadow-sm hover:md-shadow-2 hover:bg-md-primary/5 active:scale-95 transition-all duration-300 group">
                    <div class="w-16 h-16 rounded-full bg-md-secondary-container text-md-on-secondary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <span class="text-xl font-medium">Scan</span>
                    <span class="text-sm text-md-on-surface-variant">Prescription or Lab Result</span>
                </button>
            </div>

            <div id="triage-interaction-area" class="min-h-[200px] border-2 border-dashed border-md-outline/20 rounded-md-3xl flex items-center justify-center text-md-on-surface-variant">
                Select an input method to begin
            </div>
        </div>
    `;
}

function attachTriageListeners() {
    const interactionArea = document.getElementById('triage-interaction-area');
    
    document.getElementById('voice-input').addEventListener('click', () => {
        interactionArea.innerHTML = `
            <div class="flex flex-col items-center space-y-4 animate-pulse">
                <div class="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                </div>
                <p class="text-lg font-medium">Listening to your symptoms...</p>
                <button class="px-6 h-10 rounded-full bg-md-outline/10 text-md-on-surface">Cancel</button>
            </div>
        `;
    });
}

function renderInsurance() { return '<h2 class="text-3xl">Insurance Flow</h2>'; }
function renderWallet() { return '<h2 class="text-3xl">Health Wallet</h2>'; }
