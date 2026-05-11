import "./style.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

// 让 PWA 在后台保持最新版本，首次加载后自动注册即可。
registerSW({ immediate: true });
