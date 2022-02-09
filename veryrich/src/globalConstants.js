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

    L5_ARCANE_ID: 41360,
    TRASH_BANISH_ID: 39674,

    //牧师
    HOLY_PRIEST_PERCENT: 0.24,
    DISCIPLINE_PRIEST_PERCENT: 0.15,
    PRIEST_HEALING_MAX: 20,
    POM_HPS_CAP: 76,
    RENEW_CAP: 0.365,
    SHIELD_MINUTE_CAP: 1.65,

    //萨满
    G2_SHAMAN_PERCENT: 0.165,
    G4_SHAMAN_PERCENT: 0.205,
    SHAMAN_HEALING_MAX: 20,


    //德
    DREAMSTATE_DRUID_PERCENT: 0.12,
    DREAMSTATE_DRUID_HEALING_MAX: 10,
    LIFEBLOOM_COEFFICIENT: 80,
    LIFEBLOOM_MAX: 800,

    //骑
    PALADIN_PERCENT: 0.1,
    PALADIN_HEALING_MAX: 10,
    LIGHT_GRACE_ID: 31834,

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
    }
}
