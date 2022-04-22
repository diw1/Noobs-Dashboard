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
    DISCIPLINE_PRIEST_PERCENT: 0.17,
    PRIEST_HEALING_MAX: 15,
    DISP_POM_HPS_CAP: 105,
    HOLY_POM_HPS_CAP: 76,
    POM_COEFFICIENT: 4,
    DISP_RENEW_CAP: 0.80,
    HOLY_RENEW_CAP: 0.365,
    DISP_SHIELD_MINUTE_CAP: 2.45,
    HOLY_SHIELD_MINUTE_CAP: 1.65,
    TANK_RECEIVED_PERCENT_CAP_PRIEST:0.17,

    //牧师(3萨)
    HOLY_PRIEST_PERCENT_3SHAMANS: 0.24,
    DISCIPLINE_PRIEST_PERCENT_3SHAMANS: 0.17,
    PRIEST_HEALING_MAX_3SHAMANS: 15,
    DISP_POM_HPS_CAP_3SHAMANS: 105,
    HOLY_POM_HPS_CAP_3SHAMANS: 76,
    POM_COEFFICIENT_3SHAMANS: 4,
    DISP_RENEW_CAP_3SHAMANS: 0.80,
    HOLY_RENEW_CAP_3SHAMANS: 0.365,
    DISP_SHIELD_MINUTE_CAP_3SHAMANS: 2.45,
    HOLY_SHIELD_MINUTE_CAP_3SHAMANS: 1.65,
    TANK_RECEIVED_PERCENT_CAP_PRIEST_3SHAMANS:0.195,

    //萨满
    G2_SHAMAN_PERCENT: 0.21,
    G4_SHAMAN_PERCENT: 0.255,
    SHAMAN_HEALING_MAX: 20,
    //萨满(3萨)
    G2_SHAMAN_PERCENT_3SHAMANS: 0.19,
    G4_SHAMAN_PERCENT_3SHAMANS: 0.225,
    SHAMAN_HEALING_MAX_3SHAMANS: 20,

    //德
    DREAMSTATE_DRUID_PERCENT: 0.135,
    DREAMSTATE_DRUID_HEALING_MAX: 7.5,
    LIFEBLOOM_COEFFICIENT: 100,
    LIFEBLOOM_MAX: 750,
    FF_TRASH_COEFFICIENT: 40,
    RAID_EMERGENCY_CAP_DRUID: 0.1,
    RAID_EMERGENCY_MAX_DRUID: 5,

    //骑
    PALADIN_PERCENT: 0.095,
    PALADIN_HEALING_MAX: 10,
    LIGHT_GRACE_ID: 31834,
    TANK_EMERGENCY_CAP: 0.37,
    TANK_HEALING_PERCENT_CAP:0.79,
    TANK_RECEIVED_PERCENT_CAP_PALADIN:0.2,

    //骑(3萨)
    PALADIN_PERCENT_3SHAMANS: 0.095,
    PALADIN_HEALING_MAX_3SHAMANS: 10,
    TANK_EMERGENCY_CAP_3SHAMANS: 0.37,
    TANK_HEALING_PERCENT_CAP_3SHAMANS:0.79,
    TANK_RECEIVED_PERCENT_CAP_PALADIN_3SHAMANS:0.2,

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
