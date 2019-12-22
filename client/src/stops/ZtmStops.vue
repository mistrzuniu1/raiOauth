<template>
    <div>
        <vue-good-table
                :columns="columns"
                :rows="rows"
                @on-row-dblclick="onRowDoubleClick"
                :pagination-options="{
    enabled: true,
    mode: 'records',
    perPage: 10,
    position: 'top',
    perPageDropdown: [10, 30, 50],
    dropdownAllowAll: false,
    setCurrentPage: 2,
    nextLabel: 'next',
    prevLabel: 'prev',
    rowsPerPageLabel: 'Rows per page',
    ofLabel: 'of',
    pageLabel: 'page', // for 'pages' mode
    allLabel: 'All',
  }"
                :search-options="{
    enabled: true,
    trigger: 'enter',
    skipDiacritics: true,
    placeholder: 'Search this table'
  }">
        </vue-good-table>
    </div>
</template>


<script>
    import 'vue-good-table/dist/vue-good-table.css'
    import axios from "axios";

    var dataURL = 'https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json';


    export default {
        name: 'ZtmStops',
        data() {
            return {
                columns: [
                    {
                        label: 'ID',
                        field: 'stopId',
                        type: 'number'
                    },
                    {
                        label: 'Nazwa przystanku',
                        field: 'stopName'
                    },
                    {
                        label: 'Tablica kierunkowa',
                        field: 'stopDesc'
                    }
                ],
                rows: [],
            };
        },
        mounted() { // when the Vue app is booted up, this is run automatically.
            axios.get(dataURL)
                .then((response) => {
                    console.log(response.data);
                    this.$store.commit('setMzkResponse', {stops: response.data});
                    this.rows = this.$store.getters.getAllStopsForToday;
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        methods: {
            onRowDoubleClick(params) {
                let favStops = this.$store.getters.getFavStops;

                let clickedStop = params.row.stopId.toString();
                if (favStops.includes(clickedStop)) {
                    return;
                }

                let token = JSON.parse(localStorage.getItem('user')).token;
                const config = {
                    headers: {'Authorization': "Bearer " + token}
                };

                axios.post("http://localhost:3000/users/me/stop", {stopName: clickedStop}, config)
                .then(res => {
                    favStops.push(clickedStop);
                    this.$store.commit('setFavStops', {stops: favStops});
                })

            }
        },
        computed: {
            allStopsUpdated () {
                this.rows = this.$store.getters.getAllStopsForToday;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>