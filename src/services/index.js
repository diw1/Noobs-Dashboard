import { getData } from './axios'
import queryString from 'query-string'


function getPlayerLists(params) {
    const url = `human/lists?${queryString.stringify(params)}`
    return getData(url)
}

function getPlayerList(params) {
    const url = `human/list?${queryString.stringify(params)}`
    return getData(url)
}

function getRaidLists(params) {
    const url = `raid/lists?${queryString.stringify(params)}`
    return getData(url)
}

function getRaidList(params) {
    const url = `raid/list?${queryString.stringify(params)}`
    return getData(url)
}

function getRoleList(params) {
    const url = `role/list?${queryString.stringify(params)}`
    return getData(url)
}

function getParamList() {
    const url = 'index/listAllParam'
    return getData(url)
}

export default {
    getPlayerLists,
    getPlayerList,
    getRaidLists,
    getRaidList,
    getRoleList,
    getParamList,
}
