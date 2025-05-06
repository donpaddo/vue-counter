import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC3QqtqHjS8LNY72xhhZPIfYHNUtj3qUGI",
    authDomain: "vuecounter-f4370.firebaseapp.com",
    projectId: "vuecounter-f4370",
    storageBucket: "vuecounter-f4370.firebasestorage.app",
    messagingSenderId: "1038276076556",
    appId: "1:1038276076556:web:8ea7cb4c4f7e8867097a29",
    measurementId: "G-H12798N9GK"
};

const appInstance = initializeApp(firebaseConfig);
const db = getFirestore(appInstance);

const app = Vue.createApp({
    data() {
        return {
            counters: [
                { id: "match", label: "Match", count: 0 },
                { id: "main", label: "You & me", count: 0 },
                { id: "mismatch", label: "Mismatch", count: 0 }
            ]
        };
    },
    methods: {
        triggerPulse(color) {
            const appEl = document.getElementById('app');
            const className = `pulse-${color}`;
            appEl.classList.remove('pulse-red', 'pulse-blue');
            void appEl.offsetWidth; // force reflow
            appEl.classList.add(className);
        },

        async increment(id) {
            const counter = this.counters.find(c => c.id === id);
            if (counter) {
                // counter.count++;

                // Special effect for "mismatch"
                if (id === "mismatch") {
                    this.triggerPulse("blue");
                } else {
                    this.triggerPulse("red");
                }

                // Optional Firebase
                await setDoc(doc(db, "counters", id), { count: counter.count + 1 });
            }
        },

        async decrement(id) {
            const counter = this.counters.find(c => c.id === id);
            if (counter && counter.count > 0) {
                // counter.count--;

                // Special effect for "match"
                if (id === "match") {
                    this.triggerPulse("blue");
                } else {
                    this.triggerPulse("red");
                }

                // Optional Firebase
                await setDoc(doc(db, "counters", id), { count: counter.count - 1 });
            }
        },
        setupSnapshot(counter) {
            const docRef = doc(db, "counters", counter.id);
            onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    counter.count = docSnap.data().count;
                } else {
                    setDoc(docRef, { count: 0 });
                }
            });
        }
    },
    mounted() {
        this.counters.forEach(counter => this.setupSnapshot(counter));
    }
});

app.mount('#app');
