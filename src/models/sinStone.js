import sinStoneService from '../services/sinStone'
import { actions } from 'mirrorx'

export default {
    name: 'sinStone',
    initialState: {
        sinStone: null,
        loading: false,
    },
    reducers: {
    },
    effects: {
        async fetchSinStone (wclCode) {
            try {
                const payload = {WCL: wclCode}
                const data = await sinStoneService.postSinStone(payload)
                console.log(data.data)
                actions.sinStone.save({
                    sinStone: data.data
                })

                return data.data
            } catch(err) {
                actions.sinStone.save({
                    sinStone: {}
                })
                return Promise.reject(err.response.data)
            }
        },

    }
}
