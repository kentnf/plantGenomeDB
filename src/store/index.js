import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'


export default createStore({
    state: {
        init: 'initVal',
        navconfigData: "",

    },
    getters: {},
    mutations: {
        navconfigDataMutations(state, value) {
            //console.log(value, "navDataValue");
            state.navconfigData = value.data
        },
    },
    actions: {
        navconfigDataAction(context, value) {
            context.commit('navconfigDataMutations', value) // ->'

        }
    },
    modules: {},
    plugins: [createPersistedstate({
        reducer(val) {
            // console.log(val, "createPersistedstateVal");
            return {
                // 只储存state中的assessmentData
                //  assessmentData: val.assessmentData
                navconfigData: val.navconfigData,

            }
        }
    })]
})