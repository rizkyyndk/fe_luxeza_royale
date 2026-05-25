import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";

import { createPinia } from "pinia";

import "./style.css";

import { API_CONFIG } from "./config/apiConfig";

console.log("API CONFIG:", API_CONFIG);

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.mount("#app");
