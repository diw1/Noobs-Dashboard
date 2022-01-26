import axios from 'axios'
import _, {startsWith} from 'lodash'
import {actions} from 'mirrorx'
import {globalConstants} from '../globalConstants'

function normalizeUrl(baseUrl, url) {
    if (startsWith(url, baseUrl)) return url
    return baseUrl.replace(/\/*$/, '') + '/' + url.replace(/^\/*/, '')
}

/** extract Error Message
 * @param {Object} err { field_errors , global_errors , message }
 * @return {string}
 */
function extractErrorMessages (err) {
    let field_errors = err.field_errors || []
    let global_errors = err.global_errors ? err.global_errors.forEach(e => {
        return `${e.message}`
    }) : []

    if(err.message) {
        global_errors.push(err.message)
    }

    return {
        field_errors,
        global_errors
    }
}

const errorHandler = (error) =>{
    const { response } = error
    const { status } = response
    if (status>= 501 && status<=504 ) {
        actions.routing.push({
            pathname: '/exception',
            state: {code: status}
        })
    }else{
        error.response && error.response.data &&_.extend(error.response.data, extractErrorMessages(error.response.data))
        return Promise.reject(error)
    }
}

function callAPI(method, url, headers, data,) {
    url = normalizeUrl(globalConstants.API_BASE_URL, url)

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data,
    }) .then((response) => {
        if (response.status >= 200 && response.status < 300) {
            return response.data
        } else {
            return Promise.reject(response)
        }
    })
        .catch((error) => {
            return errorHandler(error)
        })

}

function callWCLAPI(method, url, headers, data,) {
    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data,
    })

}


function getData(url) {
    return callAPI('GET', url, null, null)
}

function getWCLData(url) {
    return callWCLAPI('GET', url, null, null)
}

function saveData(url, payload, method) {
    return callAPI(method, url, null, payload)
}

export { getData, saveData, getWCLData }
