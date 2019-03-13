import Vue from 'vue'
import router from './router' //роутер
import store from './store' //хранилище
import Vuetify from 'vuetify' //библиотека для создания интерфейса на основе Material Design
import 'vuetify/dist/vuetify.min.css' //стили для Material Design
import 'material-design-icons-iconfont/dist/material-design-icons.css' //иконки
import ru from 'vuetify/src/locale/ru.ts' //для русского языка по умолчанию
import VueResource from 'vue-resource'    //для web-запросов к серверу
import App from './App.vue' //главный шаблон

Vue.config.productionTip = false;

//подключаем vuetify
Vue.use(Vuetify, {
    lang: {
        locales: {ru},
        current: 'ru'
    }
});

//Подключаем VueResource
Vue.use(VueResource);
Vue.http.options.root = 'http://localhost:8081/';

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');
