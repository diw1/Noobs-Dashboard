export const globalConstants = {

    //WCl
    API_KEY: '8973e2f9f9412a72ff5f0aa377e1f391',
    WCL_API_BASE_URL: localStorage.getItem('cnWCL') === 'true' ? 'https://cn.classic.warcraftlogs.com/v1/':'https://classic.warcraftlogs.com/v1/',
    ENDTIME: 60*60*1000*120,  //120 Hours
    DARK_RUNEID: 27869,
    DEMON_RUNEID: 16666,
    MANA_POTION_IDS: [28499, 41617, 41618],
    FAERIEFIRE_ID: 26993,
    LIFEBLOOM_ID: 33763,
    EARTH_SHIELD_ID: 32594,
    SHAMAN_ARMOR_ID: 16237,
    PRIEST_ARMOR_ID: 15359,
    POM_ID: 33110,
    RENEW_ID: 25222,
    SHIELD_ID: 25218,
    L5CH_ID: 25423,
    L5COH_ID: 34866,

    BEAR_DOWN: 46239,
    TRASH_BANISH_ID: 39674,
    BRUTALLUS_ENCOUNTER_ID: 725,
    INTERRUPT_REWARDS: 12500,

    //牧师
    HOLY_PRIEST_PERCENT: 0.224,
    DISCIPLINE_PRIEST_PERCENT: 0.149,
    PRIEST_HEALING_MAX: 20,
    DISP_RENEW_CAP: 0.80,
    HOLY_RENEW_CAP: 0.80,
    DISP_SHIELD_MINUTE_CAP: 2,
    HOLY_SHIELD_MINUTE_CAP: 1.6,
    BRUTALLUS_PRIEST_CAP:0.55,
    HOLY_POM_CAP: 135,
    POM_COEFFICIENT: 5,

    //萨满
    G2_SHAMAN_PERCENT: 0.174,
    G4_SHAMAN_PERCENT: 0.202,
    G5_SHAMAN_PERCENT: 0.177,
    G5_SHAMAN_PERCENT_5H: 0.17,
    G2_4_SHAMAN_PERCENT_5H: 0.212,
    G2_5_SHAMAN_PERCENT_5H: 0.204,
    G2_SHAMAN_HEALING_MAX: 15,
    G4_SHAMAN_HEALING_MAX: 20,
    G5_SHAMAN_HEALING_MAX: 20,
    G2_SHAMAN_HEALING_MAX_5H: 25,
    BRUTALLUS_SHAMAN_CAP:0.75,

    //德
    DREAMSTATE_DRUID_PERCENT: 0.11,
    DREAMSTATE_DRUID_PERCENT_5H: 0.1,
    DREAMSTATE_DRUID_HEALING_MAX: 7.5,
    DREAMSTATE_DRUID_HEALING_MAX_5H: 5,

    LIFEBLOOM_COEFFICIENT: 100,
    LIFEBLOOM_MAX: 750,
    FF_TRASH_COEFFICIENT: 25,
    TANK_RECEIVED_PERCENT_CAP_DRUID:0.18,
    TANK_RECEIVED_PERCENT_CAP_DRUID_5H:0.225,
    TANK_RECEIVED_PERCENT_CAP_DRUID_MAX_5H:7.5,
    TANK_RECEIVED_PERCENT_CAP_DRUID_MAX:5,
    //骑
    PALADIN_PERCENT: 0.092,
    PALADIN_HEALING_MAX: 10,
    LIGHT_GRACE_ID: 31834,
    TANK_EMERGENCY_CAP: 0.39,
    TANK_HEALING_PERCENT_CAP:0.84,
    TANK_RECEIVED_PERCENT_CAP_PALADIN:0.224,

    // DASHBOARD
    API_BASE_URL: 'http://1.15.154.218/speedrunadmin/public/api',
    WCL_BASE_URL: 'https://classic.warcraftlogs.com/reports/',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm',
    APPRAISAL_STATUS: {
        1: { text: '正式队员', status: 'Success' },
        2: { text: '考核队员', status: 'Processing' },
        3: { text: '冷冻队员', status: 'Error' },
    },
    FACTION_STATUS: {
        1: { text: '联盟', status: 'Processing' },
        2: { text: '部落', status: 'Error' },
    },
    ATTENDANCE_STATUS: {
        '出战': {status:'success'},
        '替补': {status:'processing'},
        '轮换': {status:'processing'},
        '休息': {status:'processing'},
        '请假': {status:'error'},
        '未满足出战条件': {status:'warning'},
    },

    // Sin stone
    SIN_STONE_BASE_URL: 'http://124.223.17.133:8080/sinstone'
}
