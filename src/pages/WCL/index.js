import {Component, Fragment} from 'react'
import {Button, Input, Table, Card, Col, Row, Switch, Tooltip} from 'antd'
import {actions, connect} from 'mirrorx'
import {QuestionCircleOutlined} from '@ant-design/icons'
import {globalConstants} from '../../globalConstants'
import Logo from '../../image/logo_with_title.png'
import {toPercent} from '../../utility/common'
import {WelcomeBanner} from '../Layout/Banner'


class DashboardPage extends Component{

    constructor(props) {
        super(props)
        this.state={
            report: null,
            loading: false,
            manual: [],
            cnWCL: localStorage.getItem('cnWCL')? JSON.parse(localStorage.getItem('cnWCL')) : false
        }
    }

    submit = () => {
        const { report} = this.state
        let promises = []
        this.setState({loading: true})
        actions.report.getSummary(report).then(()=>{
            promises.push(actions.report.getHealing(report))
            promises.push(actions.report.getFightDebuff(report))
            promises.push(actions.report.checkHealingBrutallus(report))
            promises.push(actions.report.getemergencyHealingTank(report))
            promises.push(actions.report.getEmergencyHealingNonTank(report))
            Promise.all(promises).then(()=>{
                promises = []
                promises.push(actions.report.getRunes(report))
                promises.push(actions.report.getManaPotion(report))
                promises.push(actions.report.getLifeBloomHealing(report))
                // promises.push(actions.report.getPOMHealing(report))
                promises.push(actions.report.getEarthShield(report))
                promises.push(actions.report.getBossFightArmorBuff(report))
                promises.push(actions.report.getLightGraceBuff(report))
                promises.push(actions.report.getDispels(report))
                promises.push(actions.report.getInterrupts(report))
                promises.push(actions.report.getBearDown(report))
                promises.push(actions.report.checkG4Shaman(report))
                promises.push(actions.report.checkG2Shaman(report))
                promises.push(actions.report.getTankRenewBuff(report))
                promises.push(actions.report.getPriestShield(report))
                promises.push(actions.report.checkHealingToTank(report))
                promises.push(actions.report.checkHealingToTankBrutallus(report))
                Promise.all(promises).then(()=>{
                    this.setState({loading: false})
                })
            })
        })
    }

    findTargetIds = (trashIds, fight) => {
        const enemies = fight?.enemies
        return enemies.map(enemy=>trashIds.includes(enemy.guid)&&enemy.id).filter(id=>!!id)
    }

    calculateLifeBloom = (tankIds, lifeBloom) => {
        const totalTime = lifeBloom?.totalTime
        let sum = 0
        tankIds.map(tankId=>{
            const tankEntry = lifeBloom?.entries.find(entry=>tankId===entry.id)
            if (tankEntry) sum = sum + tankEntry.total/tankEntry.tickCount*tankEntry.uptime
        })
        return (sum/totalTime).toFixed(2)
    }

    // calculatePOM = (tankIds, pom, time) => {
    //     let sum = 0
    //     tankIds.map(tankId=>{
    //         const tankEntry = pom?.entries.find(entry=>tankId===entry.id)
    //         if (tankEntry) sum = sum + tankEntry.total
    //     })
    //     return [sum, sum/time*1000]
    // }

    calculatePercentScore = (record) => {
        let pass = 0
        let max = 0
        switch (record.type){
        case 'Paladin':
            pass = globalConstants.PALADIN_PERCENT
            max = globalConstants.PALADIN_HEALING_MAX
            break
        case 'Druid' :
            pass= globalConstants.DREAMSTATE_DRUID_PERCENT
            max = globalConstants.DREAMSTATE_DRUID_HEALING_MAX
            break
        case 'Priest':
            pass = record.icon==='Priest-Holy' ? globalConstants.HOLY_PRIEST_PERCENT : globalConstants.DISCIPLINE_PRIEST_PERCENT
            max = globalConstants.PRIEST_HEALING_MAX
            break
        case 'Shaman':
            pass = record.withShadowPriest? globalConstants.G4_SHAMAN_PERCENT: record.g2Shaman ? globalConstants.G2_SHAMAN_PERCENT : globalConstants.G5_SHAMAN_PERCENT
            max =  record.withShadowPriest? globalConstants.G4_SHAMAN_HEALING_MAX: record.g2Shaman ? globalConstants.G2_SHAMAN_HEALING_MAX : globalConstants.G5_SHAMAN_HEALING_MAX
        }
        return record.percent > pass ? `大于${toPercent(pass,1)},${max}分` : `小于${toPercent(pass,1)},不合格,${(Math.max(0,max-(pass-record.percent)/0.002)).toFixed(1)}分`
    }

    calculatedRuneAverage = (runes) => {
        let sum = runes[0]?.runeSum
        let average = sum / this.props.healerIds.length
        return Math.floor(average)
    }

    calculatedPotionAverage = (potions) => {
        let sum = potions[0]?.potionSum
        let average = sum / this.props.healerIds.length
        return Math.floor(average)
    }

    generateSource = () => {
        const {healing, brutallusHealing, dispels, emergencyHealingTank, emergencyHealingNonTank, tankIds, healerIds, runes, manaPotion, bossFightDebuff,missed_bear_down, bossTrashDebuff, druidLifeBloom, shamanEarthShield, bossFightExtraArmorBuff, lightGraceBuff} = this.props
        return healing?.filter(entry=>healerIds?.find(id=>id===entry.id))?.map(entry=>{
            const emergency = emergencyHealingTank?.find(i=>i.id===entry.id)?.total || 0
            const emergencyPercent = emergencyHealingTank?.find(i=>i.id===entry.id)?.percent || 0
            const emergencyNonTank = emergencyHealingNonTank?.find(i=>i.id===entry.id)?.total || 0
            const emergencyNonTankPercent = emergencyHealingNonTank?.find(i=>i.id===entry.id)?.percent || 0
            const brutallusTankTotal = brutallusHealing?.find(i=>i.id===entry.id)?.healingToTankBrutallus || 0
            const brutallusTankPercent = brutallusHealing?.find(i=>i.id===entry.id)?.healingToTankBrutallusPercent || 0
            const runesCasts = runes?.find(trashEntry=>trashEntry.id===entry.id)?.runes
            const runesAverage = runes?.find(trashEntry=>trashEntry.id===entry.id)?.runeSum/healerIds.length
            const manaPotionCasts = manaPotion?.find(trashEntry=>trashEntry.id===entry.id)?.manaPotion || 0
            const manaPotionAverage = manaPotion?.find(trashEntry=>trashEntry.id===entry.id)?.manaPotion/healerIds.length
            const bossFF = parseFloat(bossFightDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUptime/bossFightDebuff?.totalTime*100).toFixed(2)
            const bossFFCast = bossFightDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUses
            const trashFF = parseFloat(bossTrashDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUptime/bossTrashDebuff?.totalTime*100).toFixed(2)
            const trashFFCast = bossTrashDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUses
            const lifeBloom = this.calculateLifeBloom(tankIds,druidLifeBloom)
            // const [pom,pomPersecond] = this.calculatePOM(tankIds,prayOfMending, fightsSummary?.totalTime)
            const earthShield = toPercent(shamanEarthShield?.find(trashEntry=>trashEntry.id===entry.id)?.buffPercent,1)
            const earthShieldCast = shamanEarthShield?.find(trashEntry=>trashEntry.id===entry.id)?.buffCast
            const lightGrace = toPercent(lightGraceBuff?.auras?.find(trashEntry=>trashEntry.id===entry.id)?.totalUptime / lightGraceBuff?.totalTime, 2)
            const dispelCasts = dispels?.find(trashEntry=>trashEntry.id===entry.id)?.total
            return {
                ...entry,
                emergency,
                emergencyPercent,
                emergencyNonTank,
                emergencyNonTankPercent,
                runesCasts,
                runesAverage,
                manaPotionCasts,
                manaPotionAverage,
                bossFF,
                bossFFCast,
                trashFF,
                trashFFCast,
                lifeBloom,
                earthShield,
                earthShieldCast,
                bossFightExtraArmorBuff,
                lightGrace,
                dispelCasts,
                missed_bear_down,
                brutallusTankTotal,
                brutallusTankPercent
            }
        })

    }

    handleLocaleChange = (v) => {
        localStorage.setItem('cnWCL', JSON.stringify(v))
        this.setState({cnWCL: v})
    }

    render() {
        const {runes, manaPotion} = this.props
        const runeAverage = runes && this.calculatedRuneAverage(runes)
        const potionAverage = manaPotion && this.calculatedPotionAverage(manaPotion)
        const {loading, cnWCL} = this.state
        const dataSource =  this.generateSource()
        const g2manaTide = dataSource?.find(record=>record.g2Shaman)?.manaTide
        const g5manaTide = dataSource?.find(record=>record.type==='Shaman' && !record.g2Shaman && !record.withShadowPriest)?.manaTide
        const manaTideScore = `${Math.min(5, (g2manaTide/g5manaTide - 1) / 0.1).toFixed(2)}分`
        const columns = [
            {
                title: 'ID',
                dataIndex: 'name',
                width: 80,
                fixed: 'left',
            },
            {
                title: '职业',
                dataIndex: 'type',
                filters: [
                    {
                        text: '战',
                        value: 'Warrior',
                    },
                    {
                        text: '法',
                        value: 'Mage',
                    },
                    {
                        text: '术',
                        value: 'Warlock',
                    },
                    {
                        text: '猎',
                        value: 'Hunter',
                    },
                    {
                        text: '贼',
                        value: 'Rogue',
                    },
                    {
                        text: '德',
                        value: 'Druid',
                    },
                    {
                        text: '牧',
                        value: 'Priest',
                    },
                    {
                        text: '骑',
                        value: 'Paladin',
                    },
                    {
                        text: '萨',
                        value: 'Shaman',
                    },

                ],
                onFilter: (value, record) => record.type === value ,
            },
            {
                title: '治疗量',
                dataIndex: 'total',
                sorter: (a, b) => a.total-b.total,
                defaultSortOrder: 'descend',
                render: (text, record)=> <span><div>{text},</div><div>{toPercent(record.percent, 2)},{this.calculatePercentScore(record)}</div></span>
            },
            {
                title: <Tooltip title="括号中第一个值是你对坦克的治疗占你治疗的百分比（奶骑会在分母减去对团血的救急治疗），第二个值是你对坦克的治疗占坦克受到治疗的百分比。">
                    <span>坦克治疗量<QuestionCircleOutlined /></span>
                </Tooltip>,
                dataIndex: 'healingToTank',
                sorter: (a, b) => a.healingToTank-b.healingToTank,
                render: (text, record)=> <span><div>{text},</div>
                    <div>{toPercent(record.healingToTankPercent,1)} {record.type==='Paladin' && (globalConstants['TANK_HEALING_PERCENT_CAP']-record.healingToTankPercent>0 ?  `${Math.max(0,(5 - (globalConstants['TANK_HEALING_PERCENT_CAP'] - record.healingToTankPercent) /0.02)).toFixed(2)}分`: '5分')},
                        {toPercent(record.tankHealingReceivedPercent,1)} {(record.type==='Paladin' || record.type==='Druid') && (globalConstants[`TANK_RECEIVED_PERCENT_CAP_${record.type.toUpperCase()}`]-record.tankHealingReceivedPercent>0 ?  `${Math.max(0,(5 - (globalConstants[`TANK_RECEIVED_PERCENT_CAP_${record.type.toUpperCase()}`] - record.tankHealingReceivedPercent) /0.004)).toFixed(2)}分`: '5分')}</div>
                </span>
            },
            {
                title: <Tooltip title="括号中值是你对坦克的治疗占你治疗的百分比">
                    <span>布胖坦克治疗量<QuestionCircleOutlined /></span>
                </Tooltip>,
                dataIndex: 'brutallusTankTotal',
                sorter: (a, b) => a.brutallusTankTotal-b.brutallusTankTotal,
                render: (text, record)=> <span><div>{text},</div>
                    <div>{toPercent(record.brutallusTankPercent,1)} {record.type==='Priest' && (globalConstants['BRUTALLUS_PRIEST_CAP']-record.brutallusTankPercent>0 ?  `${Math.max(0,(5 - (globalConstants['BRUTALLUS_PRIEST_CAP'] - record.brutallusTankPercent) /0.03)).toFixed(2)}分`: '5分')}
                        {record.g2Shaman && (globalConstants['BRUTALLUS_SHAMAN_CAP']-record.brutallusTankPercent>0 ?  `${Math.max(0,(5 - (globalConstants['BRUTALLUS_SHAMAN_CAP'] - record.brutallusTankPercent) /0.04)).toFixed(2)}分`: '5分')}</div>
                </span>
            },

            {
                title: <Tooltip title="对坦克血在50%以下时的直接治疗量">
                    <span>坦克急救<QuestionCircleOutlined /></span>
                </Tooltip>,
                dataIndex: 'emergency',
                sorter: (a, b) => a.emergency-b.emergency,
                render: (text, record)=> `${text}(${(record.emergencyPercent*100).toFixed(1)}%) ${record.type==='Paladin' ? (globalConstants['TANK_EMERGENCY_CAP']-record.emergencyPercent>0 ?  `${Math.max(0,10 - (globalConstants['TANK_EMERGENCY_CAP'] - record.emergencyPercent) /0.02).toFixed(2)}分`: '10分'):''} `
            },
            {
                title: <Tooltip title="对非坦克目标血在50%以下时的直接治疗量">
                    <span>团血急救<QuestionCircleOutlined /></span>
                </Tooltip>,
                dataIndex: 'emergencyNonTank',
                sorter: (a, b) => a.emergencyNonTank-b.emergencyNonTank,
                render: (text, record)=> `${text}(${(record.emergencyNonTankPercent*100).toFixed(1)}%)`
            },
            {
                title: <Tooltip title={`平均数为: ${potionAverage}`}>
                    <span>大蓝<QuestionCircleOutlined /></span>
                </Tooltip>,
                dataIndex: 'manaPotionCasts',
            },
            {
                title: <Tooltip title={`平均数为: ${runeAverage}`}>
                    <span>符文<QuestionCircleOutlined /></span>
                </Tooltip>,
                dataIndex: 'runesCasts',
            },
            {
                title: '驱散',
                dataIndex: 'dispelCasts',
                sorter: (a, b) => a.dispelCasts-b.dispelCasts,
            },
            {
                title: '打断',
                dataIndex: 'interrupts',
            },
            {
                title: '奶德',
                children: [
                    {
                        title: <Tooltip title="坦克的绽放平均hot值（包含过量）*buff覆盖率的总和">
                            <span>坦克三花(7.5分)<QuestionCircleOutlined /></span>
                        </Tooltip>,
                        dataIndex: 'lifeBloom',
                        render: (text, record)=> record.type === 'Druid' && `${text}(${record.lifeBloom>globalConstants.LIFEBLOOM_MAX?7.5 : (record.lifeBloom/globalConstants.LIFEBLOOM_COEFFICIENT).toFixed(2)}分)`
                    },
                    {
                        title: '精灵火覆盖率(施法)',
                        children: [{
                            title: 'Boss(10分)',
                            dataIndex: 'bossFF',
                            render: (text, record)=> record.type === 'Druid' && `${text}%(${record.bossFFCast}次,${(Number.parseFloat(text)/10).toFixed(2)}分)`
                        },{
                            title: '全程(覆盖和施法各5)',
                            dataIndex: 'trashFF',
                            render: (text, record)=> record.type === 'Druid' && `${text}%,${Math.min(5,Number.parseFloat(text)/16).toFixed(2)}分(${record.trashFFCast}次,${Math.min(5,(record.trashFFCast/globalConstants.FF_TRASH_COEFFICIENT)).toFixed(2)}分)`
                        },]
                    },
                ]
            },
            {
                title: '奶萨',
                children: [
                    {
                        title: '法潮回蓝',
                        dataIndex: 'manaTide',
                        render: (text, record) => `${text} ${record.type === 'Shaman' && !record.g2Shaman && !record.withShadowPriest ? manaTideScore :'' }`
                    },
                    {
                        title: '大地盾覆盖(施法)(5分)',
                        dataIndex: 'earthShield',
                        render: (text, record)=> record.type === 'Shaman' && `${text}(${record.earthShieldCast}),${record.g2Shaman || record.withShadowPriest ? (Number.parseFloat(text)>70 ? 5 : Number.parseFloat(text)<40 ? 0 : (Number.parseFloat(text)-40)/6).toFixed(2) : ''}分`
                    },
                    {
                        title: <Tooltip title="包括灵感在内">
                            <span>boss战坦克先祖<QuestionCircleOutlined /></span>
                        </Tooltip>,
                        width: 150,
                        render: (text, record)=> record.type === 'Shaman' && record.bossFightExtraArmorBuff?.map(item=><div key={item.id}>{item.name}: {(item.armorPercent*100).toFixed(1)}%</div>)
                    },
                ]
            },
            {
                title: '奶骑',
                children: [
                    {
                        title: '冲压没保护次数',
                        dataIndex: 'missed_bear_down',
                        render: (text, record)=> record.type === 'Paladin' && `${text} (需具体查看，不一定是奶骑问题)`
                    },
                    {
                        title: '圣光之赐覆盖',
                        dataIndex: 'lightGrace',
                        render: (text, record)=> record.type === 'Paladin' && `${text}`
                    },
                ]
            },

            {
                title: '奶牧',
                children: [
                    // {
                    //     title: <Tooltip title="坦克愈合祷言(包含过量)总和">
                    //         <span>坦克愈合(5分)<QuestionCircleOutlined /></span>
                    //     </Tooltip>,
                    //     dataIndex: 'pom',
                    //     render: (text, record)=> record.type === 'Priest' && `${text}(${record.pomPersecond.toFixed(1)})${globalConstants[`${record?.specs[0]==='Discipline'?'DISP_':'HOLY_'}POM_HPS_CAP`]-record.pomPersecond>0 ?
                    //         `${Math.max(0,(5-(globalConstants[`${record?.specs[0]==='Discipline'?'DISP_':'HOLY_'}POM_HPS_CAP`]-record.pomPersecond)/globalConstants.POM_COEFFICIENT)).toFixed(2)}分`: '5分'} `
                    // },
                    {
                        title: <Tooltip title="BOSS战所有坦克恢复buff覆盖率的总和">
                            <span>坦克恢复(5分)<QuestionCircleOutlined /></span>
                        </Tooltip>,
                        dataIndex: 'renewOnTank',
                        render: (text, record)=> record.type === 'Priest' && `${(text*100).toFixed(1)}%(${globalConstants[`${record?.specs[0]==='Discipline'?'DISP_':'HOLY_'}RENEW_CAP`]-text>0 ?
                            `${Math.max(0,(5-(globalConstants[`${record?.specs[0]==='Discipline'?'DISP_':'HOLY_'}RENEW_CAP`]-text)/0.04)).toFixed(2)}分`: '5分'}) `
                    },
                    {
                        title: <Tooltip title="每分钟套盾次数">
                            <span>套盾次数(5分)<QuestionCircleOutlined /></span>
                        </Tooltip>,
                        dataIndex: 'shieldCast',
                        render: (text, record)=> record.type === 'Priest' && `${text}(${record.shieldCastPerMinute?.toFixed(2)})${globalConstants[`${record?.specs[0]==='Discipline'?'DISP_':'HOLY_'}SHIELD_MINUTE_CAP`]-record.shieldCastPerMinute>0 ? 
                            `${Math.max(0,(5-(globalConstants[`${record?.specs[0]==='Discipline'?'DISP_':'HOLY_'}SHIELD_MINUTE_CAP`]-record.shieldCastPerMinute)/0.15)).toFixed(2)}分`: '5分'} `
                    },
                ]
            },
        ]
        return (
            <Fragment>
                <WelcomeBanner />

                <Card title={<Row type="flex" gutter={16} align="middle">
                    <img src={Logo} width={100}/>
                    <Col>
                        <Switch
                            checked={cnWCL}
                            onChange={this.handleLocaleChange}
                            checkedChildren="国服"
                            unCheckedChildren="外服"
                        />
                    </Col>
                    <Col>
                        <Input
                            style={{width: 400}}
                            placeholder="请粘贴reportID，例如: Jzx9tgnTKvVwAX"
                            onChange={event => this.setState({report: event.target.value})}/>
                    </Col>
                    <Col>
                        <Button disabled={!this.state.report} onClick={this.submit}>提交</Button>
                    </Col>
                </Row>}>

                    <Table
                        className="wcl_table"
                        rowClassName={record => record.type}
                        size="small"
                        loading={loading}
                        dataSource={dataSource}
                        columns={columns}
                        rowKey='id'
                        pagination={false}
                        scroll={{x:true}}
                    />
                </Card>
            </Fragment>
        )
    }
}

export default connect(state=>state.report) (DashboardPage)
