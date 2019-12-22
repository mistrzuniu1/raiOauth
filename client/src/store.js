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
            return state.mzkResponse['2019-12-22']['stops'];
        },
        getStopsWithFriendlyName: state => {
            var friendlyNames = [];
            if (Object.keys(state.mzkResponse).length === 0) return;


            for (const id of state.favStops){
                var name = state.mzkResponse['2019-12-22']['stops'].find(p => p.stopId == id).stopName;
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