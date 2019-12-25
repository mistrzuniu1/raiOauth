import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        favStops: [],
        mzkResponse: {}
    },
    getters: {
        getFavStops: state => {
            return state.favStops;
        },
        getAllStopsForToday: state => {
            var currentDateWithFormat = new Date().toJSON().slice(0,10).toString()
            console.log(currentDateWithFormat);
            return state.mzkResponse[currentDateWithFormat]['stops'];
        },
        getStopsWithFriendlyName: state => {
            var friendlyNames = [];
            if (Object.keys(state.mzkResponse).length === 0) return;


            for (const id of state.favStops){
                var currentDateWithFormat = new Date().toJSON().slice(0,10).toString()
                console.log(currentDateWithFormat);
                var name = state.mzkResponse[currentDateWithFormat]['stops'].find(p => p.stopId == id).stopName;
                friendlyNames.push(name)
            }

            return friendlyNames;
        }
    },
    mutations: {
        addFavStop(state, payload) {
            state.favStops.push(payload.stop)
        },
        setFavStops(state, payload) {
            state.favStops = payload.stops
        },
        setMzkResponse(state, payload){
            state.mzkResponse = payload.stops;
        }

    }
});