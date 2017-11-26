import apiClient from './../../apiClient';

const state = {
    namespaces: ['123'],
    count: 1,
    statuses: []
};

const getters = {

};

const actions = {
    async loadNamespaces({commit, dispatch}) {
        let namespaces = await apiClient.getNamespaces();
        commit('LOAD_NAMESPACES', {namespaces});
    },

    async loadStatuses({commit, dispatch}, namespace) {
        let statuses = await apiClient.getStatuses(namespace);
        commit('LOAD_NAMESPACE_STATUSES', {namespace, statuses});
        console.log(namespace, statuses);
    }
};

const mutations = {
    LOAD_NAMESPACES(state, {namespaces}) {
        state.namespaces = namespaces;
        state.count = namespaces.length;
    },
    LOAD_NAMESPACE_STATUSES(state, {namespace, statuses}) {
        state.statuses = statuses;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

