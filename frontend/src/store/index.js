import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger';
import statusDashboard from './modules/statusDashboard';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        statusDashboard
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
});
