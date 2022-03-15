import service from '../services/'
import { actions } from 'mirrorx'

export default {
    name: 'role',
    initialState: {
        roleData: null,
    },
    reducers: {
    },
    effects: {
        async fetchRole (params) {
            try {
                const data = await service.getRoleList(params)
                actions.role.save({
                    roleData: data?.data
                })
                return data
            } catch(err) {
                actions.role.save({
                    roleData: {}
                })
                return Promise.reject(err.response.data)
            }
        },

    }
}
