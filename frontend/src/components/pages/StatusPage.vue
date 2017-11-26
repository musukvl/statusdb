<template>
    <div class="container" id="status-page">


        <div class="row">
            <div class="col-lg-3">
                <ul>
                    <li v-for="namespace in dashboard.namespaces">
                        <a href="" v-on:click.stop.prevent="loadStatuses(namespace)">{{namespace}}</a>
                    </li>
                </ul>
            </div>
            <div class="col-lg-9">
                <table class="table">
                    <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tr v-for="status in dashboard.statuses">
                        <td>{{status.key}}</td>
                        <td>{{status.value}}</td>
                        <td>{{status.description}}</td>
                    </tr>
                </table>
            </div>
        </div>


        <namespace-list></namespace-list>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import NamespaceList from './../NamespaceList.vue'


export default {
  name: 'StatusPage',
  components: {
      NamespaceList
  },
  data () {
      return {
          msg: 'Welcome to Your Vue.js App'
      }
  },
  mounted () {
      this.loadNamespaces();
  },
  computed: {
      ...mapState({
          dashboard: state => state.statusDashboard
      })
  },
  methods: {
      ...mapActions([
          'loadNamespaces',
          'loadStatuses'
      ])
  }
}
</script>

<style scoped lang="scss">

</style>
