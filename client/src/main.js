import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import axios from 'axios';

import {router} from './_helpers';
import App from './app/App';

import VueGoodTablePlugin from 'vue-good-table';

import 'vue-good-table/dist/vue-good-table.css'
import store from "./store";

Vue.use(VueGoodTablePlugin);
const oauthRedirectUri = window.location.origin + '/oauth'
Vue.use(VueAxios, axios)
Vue.use(VueAuthenticate, {

    tokenName: 'access_token',
    storageType: 'cookieStorage',
    baseUrl: 'http://localhost:3000', // Your API domain
    cookieStorage: {
        domain: window.location.hostname,
        path: '/',
        secure: false
    },

    providers: {
        github: {
            clientId: 'f7417d3aec7f832dc20b',
            clientSecret: "3e692ebbb960170793a5145c030374d39bcbdb25",
            redirectUri: 'http://localhost:8080/auth/callback'
        },
        facebook:
            {
                clientId: '3511646252193280',
                clientSecret: "7ce62d4e0f9b96d54ffdd3b99183e3e7",
                redirectUri: 'http://localhost:8080/auth/callback'
            }
    }
})


new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');

