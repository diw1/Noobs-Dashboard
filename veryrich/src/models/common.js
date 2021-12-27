import service from '../services/'
import { actions } from 'mirrorx'

export default {
    name: 'common',
    initialState: {
        paramcd: null,
        paramrole: null,
        paramclass: null,
    },
    reducers: {
    },
    effects: {
        async fetchAllParams () {
            try {
                const data = await service.getParamList()
                actions.common.save({
                    paramcd: data?.data?.paramcd,
                    paramrole: data?.data?.paramrole,
                    paramclass: data?.data?.paramclass,
                })
                return data
            } catch(err) {
                return Promise.reject(err.response.data)
            }
        },

    }
}
