import service from '../services/'
import { actions } from 'mirrorx'

export default {
    name: 'raid',
    initialState: {
        raidsData: null,
        raidsCount: 0,
        raidData: null,
    },
    reducers: {
    },
    effects: {
        async fetchAllRaids (params) {
            try {
                const data = await service.getRaidLists(params)
                actions.raid.save({
                    raidsData: data?.data?.raidres,
                    raidsCount: data?.data?.raidcount
                })
                return data
            } catch(err) {
                actions.raid.save({
                    raidsData: []
                })
                return Promise.reject(err.response.data)
            }
        },

        async fetchRaid (params) {
            try {
                const data = await service.getRaidList(params)
                actions.raid.save({
                    raidData: data?.data?.data
                })
                return data
            } catch(err) {
                actions.raid.save({
                    raidData: {}
                })
                return Promise.reject(err.response.data)
            }
        },

    }
}
