import { createApp } from "vue";
import App from "./App.vue";
import router from "./config/route.config";
import store from "./store";
import "./styles/index.styl";

// @ts-ignore
createApp(App).use(router).use(store).mount("#app");
