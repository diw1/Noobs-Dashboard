export const globalConstants = {
    API_KEY: '8973e2f9f9412a72ff5f0aa377e1f391',
    WCL_API_BASE_URL: 'https://classic.warcraftlogs.com/v1/',

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
