<template>
    <div>

        <div>
            <router-link to="/login">Wyloguj!</router-link>
            <h1>Wszystkie przystanki dostępne w bazie danych ZTM:</h1>
            <ZtmStops></ZtmStops>
        </div>
        <div>
            <h3>Twoje ulubione przystanki, wybierz jeden by wyświetlić informacje:</h3>
            <div v-for="favStop in stopsUpdated" class="floatcenter">
                <button v-on:click="onFavStopClick(favStop)" class="button5">{{favStop}}</button>
            </div>

            <OneStopDetail v-bind:fav-stop-id="favStopId" v-bind:fav-stop-name="favStopName"/>
        </div>
    </div>


</template>


<script>
    import OneStopDetail from "../stops/OneStopDetail";
    import ZtmStops from "../stops/ZtmStops";
    

    const axios = require('axios')

    export default {
        name: "main",
        data() {
            return {
                favStops: [],
                favStopId: '',
                favStopName: ""
            }
        },
        beforeCreate() {
            this.user = JSON.parse(localStorage.getItem('user'));

            const AuthStr = 'Bearer '.concat(this.user.token);

            var headers = { Authorization: AuthStr }

            axios.get("http://localhost:3000/users/me/stops", {headers})
                .then(res => {
                    this.$store.commit('setFavStops', {stops: res.data});
                })
                .catch((error) => {
                    console.log('error ' + error);
                });
        },
        mounted() {
            if (localStorage.getItem('reloaded')) {
                // The page was just reloaded. Clear the value from local storage
                // so that it will reload the next time this page is visited.
                localStorage.removeItem('reloaded');
            } else {
                // Set a flag so that we know not to reload the page twice.
                localStorage.setItem('reloaded', '1');
                location.reload();
            }
        },

        computed: {
            stopsUpdated() {
                return this.$store.getters.getStopsWithFriendlyName;
            }
        },
        components: {
            ZtmStops,
            OneStopDetail
        },
        methods: {
            onFavStopClick(stopName) {
                var mzkResponse = this.$store.state.mzkResponse;
                if (Object.keys(mzkResponse).length === 0) return;

                var stopId = mzkResponse['2019-12-22']['stops'].find(p => p.stopName == stopName).stopId;
                this.favStopName = stopName;
                this.favStopId = stopId;
            }
        }

    };
</script>

<style>
    .centermy {
        float: left;
        margin: auto;
        width: 49%;
        border: 3px solid green;
    }
    .floatcenter {
        text-align: center;
    }
    .centerblue {
        float: right;
        margin: auto;
        width: 49%;
        border: 3px solid blue;
    }

    .button5 {
        width: 200px;
        border-collapse:collapse;
        background-color: white;
        color: black;
        border: 2px solid #008CBA;
    }

    .button5:hover {
        width: 200px;
        background-color: #008CBA;
        color: white;
    }
</style>
