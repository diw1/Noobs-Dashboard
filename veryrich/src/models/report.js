import service from '../services/wcl'
import {actions} from 'mirrorx'
import _ from 'lodash'
import {globalConstants} from '../globalConstants'

export default {
    name: 'report',
    initialState: {
        dmg: null,
        healing: null,
        tankIds: null,
        healerIds: null,
        dpsIds: null,
        fightSummary: null,
        emergencyHealing: null,
        manaPotion: null,
        runes: null,
        bossFightDebuff: null,
        bossTrashDebuff: null,
        druidLifeBloom: null,
        shamanEarthShield: null,
        bossFightExtraArmorBuff: null,
        lightGraceBuff: null,

        filteredBossDmg:null,
        fight:null,
        bossTrashDmg:null,
        poisonDmgTaken: null,
        rogueSunderDebuff: null,
        viscidusBanned: null,
        hunterAura: null,

        swiftBoot: null,
        stopWatch: null,
        fightsData: null,
        tactics: null,

        bossTrashLess5SunderCasts:null,
        //TBC
        alarDebuff: null,
        lurkerSpout: null,
        kaelFlame: null,
        vashjCleave: null
    },
    reducers: {
        save(state, data) {
            return {
                ...state,
                ...data
            }
        },
    },
    effects: {
        getS(data, getState) {
            return getState()
        },

        async getHealing(reportId){
            const result = await service.getTables(reportId,'healing')
            actions.report.save({
                healing: result.data.entries.filter(player=>player.type!=='NPC')
            })
        },

        async getFightDebuff(reportId){
            const bossResult = await service.getTables(reportId,'debuffs', {hostility:1, encounter:-2})
            const trashResult = await service.getTables(reportId,'debuffs', {hostility:1})
            actions.report.save({
                bossFightDebuff: bossResult.data,
                bossTrashDebuff: trashResult.data
            })
        },

        async getEmergencyHealing(reportId){
            const result = await service.getEmergencyHealing(reportId)
            actions.report.save({
                emergencyHealing: result.data.entries
            })
        },

        async getSummary(reportId){
            let [tankIds, healerIds, dpsIds] = Array(3).fill([])
            const fightsSummary = await service.getFightSummary(reportId, 0, globalConstants.ENDTIME)

            dpsIds = fightsSummary.data?.playerDetails?.dps?.filter(player=>player.specs?.length>0)?.map(player=>player.id)
            tankIds = fightsSummary.data?.playerDetails?.tanks?.map(player=>player.id)
            healerIds = fightsSummary.data?.playerDetails?.healers?.map(player=>player.id)

            actions.report.save({
                fightsSummary: fightsSummary?.data,
                tankIds,
                healerIds,
                dpsIds
            })
        },

        async getLifeBloomHealing(reportId){
            const result = await service.getTables(reportId,'healing', {
                options:8,
                abilityid: globalConstants.LIFEBLOOM_ID,
                sourceid: actions.report.getS().report.fightsSummary?.playerDetails?.healers?.find(player=>player.type==='Druid')?.id
            })
            actions.report.save({
                druidLifeBloom: result.data
            })
        },

        async getEarthShield(reportId){
            const shamans = actions.report.getS().report.fightsSummary?.playerDetails?.healers?.filter(player=>player.type==='Shaman')
            let sum = shamans?.map(async (shaman) => {
                const result = await service.getTables(reportId,'buffs', {
                    abilityid: globalConstants.EARTH_SHIELD_ID,
                    sourceid: shaman.id
                })
                const buffPercent = result.data?.auras?.reduce((acc,item)=>acc+item.totalUptime,0) / result.data.totalTime

                const castResult = await service.getTables(reportId,'casts', {
                    abilityid: globalConstants.EARTH_SHIELD_ID,
                    sourceid: shaman.id
                })
                const buffCast = castResult.data?.entries?.reduce((acc,item)=>acc+item.total,0)
                return {...shaman, buffPercent, buffCast}
            })
            Promise.all(sum).then(records=>actions.report.save({
                shamanEarthShield: records
            }))
        },


        async getBossFightArmorBuff(reportId){
            const tanks = actions.report.getS().report.fightsSummary?.playerDetails?.tanks
            let sum = tanks?.map(async (tank) => {
                const result = await service.getTables(reportId,'buffs', {
                    sourceid: tank.id,
                    encounter: -2
                })
                const buffPercent = result.data?.auras?.filter(aura=>aura.guid===globalConstants.SHAMAN_ARMOR_ID || aura.guid===globalConstants.PRIEST_ARMOR_ID)?.reduce(
                    (acc,item)=>acc+item.totalUptime,0) / result.data.totalTime

                return {...tank, armorPercent: buffPercent}
            })
            Promise.all(sum).then(records=>actions.report.save({
                bossFightExtraArmorBuff: records
            }))
        },

        async getLightGraceBuff(reportId){
            const bossResult = await service.getTables(reportId,'buffs', {abilityid:globalConstants.LIGHT_GRACE_ID})
            actions.report.save({
                lightGraceBuff: bossResult.data,
            })
        },

        async getFight(reportId){
            const result = await service.getFight(reportId)
            actions.report.save({
                fight: result.data
            })
        },

        async getFightsData(reportId){
            let report = actions.report.getS().report
            let {fight} = report
            const {fights} = fight
            const fightsPromises = fights.map(async fight=> {
                const fightsSummary = await service.getFightSummary(reportId, fight.start_time, fight.end_time)
                let record = {
                    BattleID: fight.id,
                    BattleName: fight.name,
                    StartTime: fight.start_time,
                    EndTime: fight.end_time,
                    BossID: fight.boss
                }
                return fightsSummary.data?.composition?.filter(player=>(player.type === 'Warrior' || player.type === 'Rogue')).map(player=>{
                    let fightDetail = {
                        ...record,
                        name: player.name,
                        class: player.type,
                        mark: record.BattleID+player.name,
                        damageDone: fightsSummary.data?.damageDone?.find(record=>record.id===player.id)?.total || 0,
                        healing: fightsSummary.data?.healingDone?.find(record=>record.id===player.id)?.total || 0,
                    }
                    // if (fightDetail.BossID === globalConstants.MAEXXNA_ENCOUNTER_ID){
                    //     const debuffDmg = webWrapDebuff.find(debuff=>debuff.id===player.id)?.debuffDmg
                    //     fightDetail.damageDone = debuffDmg ? fightDetail.damageDone + debuffDmg : fightDetail.damageDone
                    // }
                    // if (fightDetail.BossID === globalConstants.KEL_ENCOUNTER_ID){
                    //     // const debuffDmg = chainDebuff.find(debuff=>debuff.id===player.id)?.debuffDmg
                    //     // fightDetail.damageDone = debuffDmg ? fightDetail.damageDone + debuffDmg : fightDetail.damageDone
                    //     const parryDmg = kelParry.find(parry=>parry.id===player.id)?.kelParryDmg
                    //     fightDetail.damageDone = parryDmg ? fightDetail.damageDone + parryDmg : fightDetail.damageDone
                    // }
                    return (fightDetail)
                })
            })
            Promise.all(fightsPromises).then(trashRecords=> {
                const fightsData = trashRecords.reduce((sum, trashRecord) => sum.concat(trashRecord), [])
                actions.report.save({
                    fightsData: fightsData
                })}
            )

        },

        async getStopWatch(reportId){
            const result = await service.getCastsByAbility(reportId, globalConstants.STOPWATCH_ID)
            actions.report.save({
                stopWatch: result.data.entries
            })
        },

        async getSwiftBoot(reportId){
            const result = await service.getCastsByAbility(reportId, globalConstants.SWIFT_BOOT_ID)
            actions.report.save({
                swiftBoot: result.data.entries
            })
        },

        async getRunes(reportId){
            let result = actions.report.getS().report.healing
            let promises = []
            promises.push(service.getCastsByAbility(reportId, globalConstants.DARK_RUNEID))
            promises.push(service.getCastsByAbility(reportId, globalConstants.DEMON_RUNEID))
            Promise.all(promises).then(trashRecords=>{
                trashRecords.map(trashRecord=>{
                    result = result.map(entry=>{
                        let res = _.cloneDeep(entry)
                        res.runes = res.runes || 0
                        const newCast = trashRecord.data.entries.find(i=>i.id===entry.id)?.total
                        res.runes =  Number.isInteger(newCast) ? res.runes + newCast : res.runes
                        return res
                    })
                    actions.report.save({
                        runes: result
                    })

                })
            })
        },

        async getManaPotion(reportId){
            let result = actions.report.getS().report.healing
            let promises = []
            globalConstants.MANA_POTION_IDS.map(id=>promises.push(service.getCastsByAbility(reportId, id)))
            Promise.all(promises).then(trashRecords=>{
                trashRecords.map(trashRecord=>{
                    result = result.map(entry=>{
                        let res = _.cloneDeep(entry)
                        res.manaPotion = res.manaPotion || 0
                        const newCast = trashRecord.data.entries.find(i=>i.id===entry.id)?.total
                        res.manaPotion =  Number.isInteger(newCast) ? res.manaPotion + newCast : res.manaPotion
                        return res
                    })
                    actions.report.save({
                        manaPotion: result
                    })

                })
            })
        },

        async getHunterbuff(reportId){
            const result = await service.getBuffsByAbility(reportId, globalConstants.HUNTERAURA)
            actions.report.save({
                hunterAura: result.data.auras
            })
        },

        async getSlime({reportId, slimeID}){
            let result = actions.report.getS().report.tactics
            //小软的致密伤害
            service.getDamageDoneByAbilityAndTarget(reportId, globalConstants.DENSE_BOMB, slimeID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.dense1 =  Number.isInteger(newCast) ? newCast : 0
                    return res
                })
                actions.report.save({
                    slimeTactics: result
                })
            })
            //小软的帽子伤害
            service.getDamageDoneByAbilityAndTarget(reportId, globalConstants.HAT, slimeID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.hat =  Number.isInteger(newCast) ? newCast : 0
                    return res
                })
                actions.report.save({
                    slimeTactics: result
                })
            })
            // 瘟疫1滋补
            const nothCurse = await service.getDebuffsByAbility(reportId, globalConstants.NOTH_CURSE_ID)
            service.getBuffsByAbilityAndEncounter(reportId, globalConstants.RESTO, globalConstants.NOTH_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    const hasDebuff = nothCurse.data.auras.find(i=>i.id===entry.id)
                    const hasRes = record.data.auras.find(i=>i.id===entry.id)?.totalUptime > 5000
                    res.resto =  hasDebuff && !hasRes
                    return res
                })
                actions.report.save({
                    slimeTactics: result
                })
            })
            //跳舞男迅捷鞋
            service.getCastsByAbilityAndEncounter(reportId, 0, globalConstants.HEIGAN_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.gear.find(i=>i.id===globalConstants.SWIFT_BOOT_ITEM_ID)? 1 :0
                    res.swiftBoot =  Number.isInteger(newCast) ? newCast : 0
                    return res
                })
                actions.report.save({
                    slimeTactics: result
                })
            })
        },

        async getThaddius(reportId){
            let result = actions.report.getS().report.tactics
            //电男死愿
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.DEATHWISH, globalConstants.THADDIUS_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.deathwish1 = res.deathwish1 || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.deathwish1 =  Number.isInteger(newCast) ? res.deathwish1 + newCast : res.deathwish1
                    return res
                })
                actions.report.save({
                    thaddiusTactics: result
                })
            })
            //电男冲动
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.RUSH, globalConstants.THADDIUS_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.deathwish1 = res.deathwish1 || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.deathwish1 =  Number.isInteger(newCast) ? res.deathwish1 + newCast : res.deathwish1
                    return res
                })
                actions.report.save({
                    thaddiusTactics: result
                })
            })
            //孢子死愿
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.DEATHWISH, globalConstants.LOATHEB_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.deathwish2 = res.deathwish2 || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.deathwish2 =  Number.isInteger(newCast) ? res.deathwish2 + newCast : res.deathwish2
                    return res
                })
                actions.report.save({
                    thaddiusTactics: result
                })
            })
            //孢子冲动
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.RUSH, globalConstants.LOATHEB_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.deathwish2 = res.deathwish2 || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.deathwish2 =  Number.isInteger(newCast) ? res.deathwish2 + newCast : res.deathwish2
                    return res
                })
                actions.report.save({
                    thaddiusTactics: result
                })
            })
        },

        async get4DK(reportId){
            let result = actions.report.getS().report.tactics
            const fight =  actions.report.getS().report.fight
            const start = fight.fights.find(record=>record.boss===1113).end_time
            const end = fight.fights.find(record=>record.boss===1109).start_time
            service.getBuffsByAbilityAndTime(reportId, globalConstants.STONESHIELD, start, end).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.stoneShield =  record.data.auras?.find(i=>i.id===entry.id)
                    return res
                })
                actions.report.save({
                    fourTactics: result
                })
            })
            //4DK 死愿
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.DEATHWISH, globalConstants.FOUR_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.deathwish3 = res.deathwish3 || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.deathwish3 =  Number.isInteger(newCast) ? res.deathwish3 + newCast : res.deathwish3
                    return res
                })
                actions.report.save({
                    fourTactics: result
                })
            })
            //4DK 冲动
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.RUSH, globalConstants.FOUR_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.deathwish3 = res.deathwish3 || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.deathwish3 =  Number.isInteger(newCast) ? res.deathwish3 + newCast : res.deathwish3
                    return res
                })
                actions.report.save({
                    fourTactics: result
                })
            })
            //4DK 鲁莽
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.RECKLESSNESS, globalConstants.FOUR_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.recklessness = res.recklessness || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.recklessness =  Number.isInteger(newCast) ? res.recklessness + newCast : res.recklessness
                    return res
                })
                actions.report.save({
                    fourTactics: result
                })
            })
            //4DK 剑舞
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.BLADEFLURRY, globalConstants.FOUR_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.recklessness = res.recklessness || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.recklessness =  Number.isInteger(newCast) ? res.recklessness + newCast : res.recklessness
                    return res
                })
                actions.report.save({
                    fourTactics: result
                })
            })
            //4DK 暗抗
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.DARKRES, globalConstants.FOUR_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.darkres =  Number.isInteger(newCast) ? newCast : 0
                    return res
                })
                actions.report.save({
                    fourTactics: result
                })
            })
        },

        async getSpider({reportId, interruptID}){
            let result = actions.report.getS().report.tactics
            //蜘蛛群自然抗吸收
            service.getDamageTakenByAbility(reportId, globalConstants.NATUREDMG1).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.natureres = res.natureres || false
                    const absorb = record.data.entries.find(i=>i.id===entry.id)?.hitdetails.length>0 ?
                        record.data.entries.find(i=>i.id===entry.id).hitdetails.find(hitdetail=> hitdetail.type==='Absorb'
                            || hitdetail.type==='Tick Absorb' || hitdetail.type==='Resist' || hitdetail.type==='Hit' && hitdetail.absorbOrOverheal>0) : true
                    res.natureres =  absorb || res.natureres
                    return res
                })
                actions.report.save({
                    spiderTactics: result
                })
            })

            service.getDamageTakenByAbility(reportId, globalConstants.NATUREDMG2).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.natureres = res.natureres || false
                    const absorb = record.data.entries.find(i=>i.id===entry.id)?.hitdetails.length>0 ?
                        record.data.entries.find(i=>i.id===entry.id).hitdetails.find(hitdetail=> hitdetail.type==='Absorb'
                            || hitdetail.type==='Tick Absorb' || hitdetail.type==='Resist' || hitdetail.type==='Hit' && hitdetail.absorbOrOverheal>0) : true
                    res.natureres =  absorb || res.natureres
                    return res
                })
                actions.report.save({
                    spiderTactics: result
                })
            })
            // 侍僧地精工兵
            service.getDamageDoneByAbilityAndTarget(reportId, globalConstants.SAPPER, interruptID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.sapper = res.sapper || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.sapper =  Number.isInteger(newCast) ? res.sapper + newCast : res.sapper
                    return res
                })
                actions.report.save({
                    spiderTactics: result
                })
            })

            // 火箭鞋打蜘蛛1
            service.getCastsByAbilityAndEncounter(reportId, 0, globalConstants.ANUB_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.gear.find(i=>i.id===globalConstants.ROCKET_BOOT_ITEM_ID)? 1 :0
                    res.rocketBoot =  Number.isInteger(newCast) ? newCast : 0
                    return res
                })
                actions.report.save({
                    spiderTactics: result
                })
            })
            //冰龙的暗抗
            service.getDamageTakenByAbility(reportId, globalConstants.LIFE_STEAL_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.darkres2 =  true
                    const absorb = record.data.entries.find(i=>i.id===entry.id)?.hitdetails.length>0 ?
                        record.data.entries.find(i=>i.id===entry.id).hitdetails.find(hitdetail=> hitdetail.type==='Absorb'
                            || hitdetail.type==='Tick Absorb' || hitdetail.type==='Resist' || hitdetail.type==='Tick' && hitdetail.absorbOrOverheal>0) : true
                    res.darkres2 =  absorb
                    return res
                })
                actions.report.save({
                    spiderTactics: result
                })
            })
            //冰龙死愿
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.DEATHWISH, globalConstants.SAPPHIRON_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.deathwish4 = res.deathwish4 || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.total
                    res.deathwish4 =  Number.isInteger(newCast) ? res.deathwish4 + newCast : res.deathwish4
                    return res
                })
                actions.report.save({
                    spiderTactics: result
                })
            })

            // 老克打断
            service.getCastsByAbilityAndEncounter(reportId, globalConstants.PUMMEL, globalConstants.KEL_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.interrupt2 = res.interrupt2 || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.hitCount
                    res.interrupt2 =  Number.isInteger(newCast) ? res.interrupt2 + newCast : res.interrupt2
                    return res
                })
                actions.report.save({
                    spiderTactics: result
                })
            })

            service.getCastsByAbilityAndEncounter(reportId, globalConstants.SHIELDBASH, globalConstants.KEL_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.interrupt2 = res.interrupt2 || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.hitCount
                    res.interrupt2 =  Number.isInteger(newCast) ? res.interrupt2 + newCast : res.interrupt2
                    return res
                })
                actions.report.save({
                    spiderTactics: result
                })
            })

            service.getCastsByAbilityAndEncounter(reportId, globalConstants.KICK, globalConstants.KEL_ENCOUNTER_ID).then(record=>{
                result = result.map(entry=>{
                    let res = _.cloneDeep(entry)
                    res.interrupt2 = res.interrupt2 || 0
                    const newCast = record.data.entries.find(i=>i.id===entry.id)?.hitCount
                    res.interrupt2 =  Number.isInteger(newCast) ? res.interrupt2 + newCast : res.interrupt2
                    return res
                })
                actions.report.save({
                    spiderTactics: result
                })
            })


        },
    }
}
