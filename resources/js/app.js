import '../css/app.css';
import axios from './bootstrap';

import { createApp } from 'vue';
import router from './router';
import App from './App.vue';

// Make axios available globally
window.axios = axios;

const app = createApp(App);

app.use(router);

app.mount('#app');
