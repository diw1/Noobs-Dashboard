import service from '../services/'
import { actions } from 'mirrorx'

export default {
    name: 'player',
    initialState: {
        playersData: null,
        playerData: null,
    },
    reducers: {
    },
    effects: {
        async fetchAllPlayers (params={page:1,limit:25}) {
            try {
                const data = await service.getPlayerLists(params)
                actions.player.save({
                    playersData: data?.data?.playerres,
                })
                return data
            } catch(err) {
                actions.player.save({
                    playersData: []
                })
                return Promise.reject(err.response.data)
            }
        },

        async fetchPlayer (params) {
            try {
                const data = await service.getPlayerList(params)
                actions.player.save({
                    playerData: data?.data?.data
                })
                return data
            } catch(err) {
                actions.player.save({
                    playerData: {}
                })
                return Promise.reject(err.response.data)
            }
        },

    }
}
