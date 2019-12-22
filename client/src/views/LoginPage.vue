<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" v-model="username" name="username" class="form-control"
                       :class="{ 'is-invalid': submitted && !username }"/>
                <div v-show="submitted && !username" class="invalid-feedback">Username is required</div>
            </div>
            <div class="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" v-model="password" name="password" class="form-control"
                       :class="{ 'is-invalid': submitted && !password }"/>
                <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="loading">Login</button>
                <img v-show="loading"
                     src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
            </div>
            <div v-if="error" class="alert alert-danger">{{error}}</div>

        </form>
        <button class="btn btn-primary" @click="register">Register</button>
        <br>
        <br>
        <button @click="authenticate('github')">auth Github</button>
        <br>
        <button @click="authenticate('facebook')">auth Facebook</button>

    </div>
</template>

<script>
    import {router} from '../_helpers';
    const axios = require('axios').default;

    export default {
        data() {
            return {
                username: '',
                password: '',
                submitted: false,
                loading: false,
                error: ''
            }
        },
        beforeCreate() {
            localStorage.removeItem('user');
            this.$store.commit('setFavStops', {stops: []});
        },
        methods: {
            handleSubmit(e) {
                this.submitted = true;
                const {username, password} = this;

                if (!(username && password)) {
                    return;
                }

                this.loading = true;
                axios.post('http://localhost:3000/users/login', {
                    email: username,
                    password: password
                }).then(function (response) {
                    const data = response.data;
                    data.user.token = data.token;
                    console.log(data.user.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    router.push('/')
                }).catch(function (error) {
                    location.reload(true);
                })
            },
            authenticate:function (provider) {
                if (!this.$auth.isAuthenticated()) {
                    this.$auth.logout()
                }

                this.$auth.authenticate(provider).then(function (response) {
                        if (provider === 'github')
                        {
                            axios.post('http://localhost:3000/users/logingithub', {
                                acces_token: response['data']['access_token']
                            }).then(function (response) {
                                const data = response.data;
                                data.user.token = data.token;
                                console.log("dobry token(authentication): "+data.token)
                                localStorage.setItem('user', JSON.stringify(data.user));
                                router.push('/')
                            }).catch(function (error) {
                                location.reload(true);
                            })
                        }
                        else if (provider==='facebook')
                        {
                            axios.post('http://localhost:3000/users/loginfacebook', {
                                acces_token: response['data']['access_token']
                            }).then(function (response) {
                                const data = response.data;
                                data.user.token = data.token;
                                console.log("dobry token(authentication): "+data.token)
                                localStorage.setItem('user', JSON.stringify(data.user));
                                router.push('/')
                            }).catch(function (error) {
                                location.reload(true);
                            })
                        }
                    })
            },
            register(){
                router.push('/register')
            }
        }
    };
</script>

