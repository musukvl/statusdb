import axios from 'axios';

axios.defaults.baseURL = process.env.API_URL;

axios.interceptors.request.use((config) => {
    config.headers['X-Api-Key'] = "TESTS_API_KEY";
    return config;
});

const apiClient = {

    async getTest() {
        let response = await axios.get('/api/test');
        console.log(response.data);
        return response.data;
    },
    async getNamespaces() {
        let response = await axios.post('/api/get-namespaces');
        let data = response.data
        console.log(data);
        return data;
    },
    async getStatuses(namespace) {
        let response = await axios.post('/api/get-namespace-status', {namespace});
        let data = response.data
        console.log(data);
        return data;
    }
};

export default apiClient;
