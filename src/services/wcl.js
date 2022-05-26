import { getWCLData } from './axios'
import {globalConstants} from '../globalConstants'
import queryString from 'query-string'

function getTables (reportID, table, params) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/${table}/${reportID}?api_key=${globalConstants.API_KEY}&wipes=2&end=${globalConstants.ENDTIME}&${queryString.stringify(params)}&filter=encounterid%20%21%3D%20724`
    return getWCLData(url)
}

function getEvents (reportID, table, params) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/events/${table}/${reportID}?api_key=${globalConstants.API_KEY}&wipes=2&end=${globalConstants.ENDTIME}&${queryString.stringify(params)}`
    return getWCLData(url)
}

function getEmergencyHealingTank (reportID) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/healing/${reportID}?api_key=${globalConstants.API_KEY}&wipes=2&end=${globalConstants.ENDTIME}&boss=-3&difficulty=0&filter=encounterid!%3D724%20AND%20effectiveHealing%20!%3D%200%20AND%20resources.hpPercent%20>%200%20AND%20target.role%20%3D%20"tank"%20AND%20((190%20*%20resources.hpPercent%20%20-%20effectiveHealing%20)%20<%209000)%20AND%20effectiveHealing%20>%201200`
    return getWCLData(url)
}

function getEmergencyHealingNonTank (reportID) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/healing/${reportID}?api_key=${globalConstants.API_KEY}&wipes=2&end=${globalConstants.ENDTIME}&boss=-3&difficulty=0&filter=encounterid!%3D724%20AND%20effectiveHealing%20>%201200%20AND%20resources.hpPercent%20>%200%20AND%20target.role%20!%3D%20"tank"%20AND%20((110%20*%20resources.hpPercent%20%20-%20effectiveHealing%20)%20<%205500)`
    return getWCLData(url)
}

function getDMGdone (reportID) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/damage-done/${reportID}?api_key=${globalConstants.API_KEY}&wipes=2&end=${globalConstants.ENDTIME}`
    return getWCLData(url)
}

function getBOSSDMG (reportID) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/damage-done/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&targetclass=boss`
    return getWCLData(url)
}

function getBOSSTrashDmg (reportID, trashIDs) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/damage-done/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&targetid=${trashIDs}`
    return getWCLData(url)
}

function getBOSSTrashCast (reportID, trashIDs) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/casts/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&targetid=${trashIDs}`
    return getWCLData(url)
}

function getBOSSTrashSundarCast (reportID, trashIDs) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/casts/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&targetid=${trashIDs}&filter=ability.id%3D11597%20AND%20NOT%20IN%20RANGE%20FROM%20type%20%3D%20%22applydebuffstack%22%20AND%20ability.id%20%3D%2011597%20AND%20stack%20%3D%205%20TO%20type%3D%22removedebuff%22%20AND%20ability.id%3D11597%20GROUP%20BY%20target%20ON%20target%20END&by=source`
    return getWCLData(url)
}

function getFight (reportID) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/fights/${reportID}?api_key=${globalConstants.API_KEY}`
    return getWCLData(url)
}

function getFightSummary (reportID, start, end) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/summary/${reportID}?api_key=${globalConstants.API_KEY}&start=${start}&end=${end}&filter=encounterid%20%21%3D%20724`
    return getWCLData(url)
}

function getDamageTakenByAbility (reportID, abilityId) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/damage-taken/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&abilityid=${abilityId}`
    return getWCLData(url)
}

function getDamageDoneByAbilityAndTarget (reportID, abilityId, targetId) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/damage-done/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&abilityid=${abilityId}&targetid=${targetId}`
    return getWCLData(url)
}

function getDebuffsByAbility (reportID, abilityId, enemy= false) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/debuffs/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&abilityid=${abilityId}&hostility=${enemy?1:0}`
    return getWCLData(url)
}

function getBuffsByAbility (reportID, abilityId) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/buffs/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&abilityid=${abilityId}`
    return getWCLData(url)
}

function getBuffsByAbilityAndTime (reportID, abilityId, start, end) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/buffs/${reportID}?api_key=${globalConstants.API_KEY}&start=${start}&end=${end}&abilityid=${abilityId}`
    return getWCLData(url)
}

function getBuffsByAbilityAndEncounter (reportID, abilityId, encounterID) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/buffs/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&abilityid=${abilityId}&encounter=${encounterID}`
    return getWCLData(url)
}

function getCastsByAbility (reportID, abilityId) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/casts/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&abilityid=${abilityId}`
    return getWCLData(url)
}

function getCastsByAbilityAndEncounter (reportID, abilityId, encounterID) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/casts/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&abilityid=${abilityId}&encounter=${encounterID}`
    return getWCLData(url)
}

function getDamageDoneByAbilityAndEncounter (reportID, abilityId, encounterID) {
    const url = `${globalConstants.WCL_API_BASE_URL}report/tables/damage-done/${reportID}?api_key=${globalConstants.API_KEY}&end=${globalConstants.ENDTIME}&abilityid=${abilityId}&encounter=${encounterID}`
    return getWCLData(url)
}

export default {
    getTables,
    getEvents,
    getEmergencyHealingTank,
    getEmergencyHealingNonTank,
    getDMGdone,
    getBOSSDMG,
    getBOSSTrashDmg,
    getBOSSTrashCast,
    getFight,
    getFightSummary,
    getDamageTakenByAbility,
    getDebuffsByAbility,
    getDamageDoneByAbilityAndTarget,
    getCastsByAbility,
    getBuffsByAbility,
    getBuffsByAbilityAndTime,
    getBuffsByAbilityAndEncounter,
    getCastsByAbilityAndEncounter,
    getDamageDoneByAbilityAndEncounter,
    getBOSSTrashSundarCast
}
