<template>
    <!--
    <div class="namespace-list">
        Namespace list
    </div>
    -->
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    export default {
        name: 'NamespaceList',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        mounted() {
        },
        computed: {
            ...mapState({

            })
        },
        methods: {
            ...mapActions([
            ])
        }
    }
</script>

<style scoped lang="scss">

</style>
