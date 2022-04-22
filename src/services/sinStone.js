import {globalConstants} from '../globalConstants'
import {postSinStoneData} from './axios'

function postSinStone (payload) {
    const header = {'Content-Type': 'application/json'}
    const url = globalConstants.SIN_STONE_BASE_URL
    return postSinStoneData(url, payload, header, 'POST')
}

export default {
    postSinStone
}
