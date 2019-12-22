<template>
    <div>

        <div v-if="rows.length > 0">
            <div>
                <h2>Info dla {{favStopName}}</h2>
            </div>
            <div>
                <vue-good-table
                        :columns="columns"
                        :rows="rows"
                        :search-options="{
    enabled: true,
    trigger: 'enter',
    skipDiacritics: true,
    placeholder: 'Search this table'
  }">


                </vue-good-table>
            </div>
        </div>
        <div v-else><h2>Brak informacji dla {{favStopName}}</h2></div>
    </div>

</template>


<script>
    import 'vue-good-table/dist/vue-good-table.css'
    import axios from "axios";

    var dataURL = 'http://ckan2.multimediagdansk.pl/delays?stopId=';
    export default {
        name: 'OneStopDetail',
        props: ['favStopId', 'favStopName'],
        data() {
            return {
                columns: [
                    {
                        label: 'ID',
                        field: 'id'
                    },
                    {
                        label: 'Estymowany czas przybycia',
                        field: 'estimatedTime'
                    },
                    {
                        label: 'Tablica kieurnkowa',
                        field: 'headsign'
                    },
                    {
                        label: 'Numer lini',
                        field: 'routeId'
                    }
                ],
                rows: [],
            };
        },
        mounted() {
        },
        watch: {
            favStopId: {
                immediate: true,
                handler(val, oldVal) {
                    console.log('new stop to look for ' + val);
                    axios.get(dataURL + val)
                        .then((response) => {
                            response.data['delay'].map(p => {
                                p.delayTime = '5'// todo()
                            });
                            this.rows = response.data['delay'];
                            console.log(self.rows);
                        })
                        .catch((err) => {
                            console.log("Something went wrong:", +err)
                        })
                }
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