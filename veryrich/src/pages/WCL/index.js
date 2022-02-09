import {Component} from 'react'
import {Button, Input, Table, Card, Col, Row, Switch, Tooltip} from 'antd'
import {actions, connect} from 'mirrorx'
import {QuestionCircleOutlined} from '@ant-design/icons'
import {globalConstants} from '../../globalConstants'
import Logo from '../../image/logo_with_title.png'


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
        promises.push(actions.report.getHealing(report))
        promises.push(actions.report.getSummary(report))
        promises.push(actions.report.getFightDebuff(report))
        promises.push(actions.report.getemergencyHealingTank(report))
        promises.push(actions.report.getEmergencyHealingNonTank(report))
        Promise.all(promises).then(()=>{
            promises = []
            promises.push(actions.report.getRunes(report))
            promises.push(actions.report.getManaPotion(report))
            promises.push(actions.report.getLifeBloomHealing(report))
            promises.push(actions.report.getPOMHealing(report))
            promises.push(actions.report.getEarthShield(report))
            promises.push(actions.report.getBossFightArmorBuff(report))
            promises.push(actions.report.getLightGraceBuff(report))
            promises.push(actions.report.getDispels(report))
            promises.push(actions.report.getL5Arcane(report))
            promises.push(actions.report.checkG4Shaman(report))
            // promises.push(actions.report.checkPaladinHealing(report))
            promises.push(actions.report.checkHealingToTank(report))
            Promise.all(promises).then(()=>{
                this.setState({loading: false})
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

    calculatePOM = (tankIds, pom) => {
        let sum = 0
        tankIds.map(tankId=>{
            const tankEntry = pom?.entries.find(entry=>tankId===entry.id)
            if (tankEntry) sum = sum + tankEntry.total
        })
        return sum
    }

    calculatePercentScore = (record) => {
        let pass = 0
        let max = 0
        switch (record.type){
        case 'Paladin':
            pass = globalConstants.PALADIN_PERCENT
            max = globalConstants.PALADIN_HEALING_MAX
            break
        case 'Druid' :
            pass=globalConstants.DREAMSTATE_DRUID_PERCENT
            max = globalConstants.DREAMSTATE_DRUID_HEALING_MAX
            break
        case 'Priest':
            pass = record.icon==='Priest-Holy' ? globalConstants.HOLY_PRIEST_PERCENT : globalConstants.DISCIPLINE_PRIEST_PERCENT
            max = globalConstants.PRIEST_HEALING_MAX
            break
        case 'Shaman':
            pass = record.withShadowPriest ? globalConstants.G4_SHAMAN_PERCENT : globalConstants.G2_SHAMAN_PERCENT
            max = globalConstants.SHAMAN_HEALING_MAX
        }
        return record.percent > pass ? `大于${pass*100}%,合格` : `小于${pass*100}%,不合格,扣${(Math.min(max,(pass-record.percent)/0.002)).toFixed(0)}分`
    }

    generateSource = () => {
        const {healing, dispels, emergencyHealingTank, emergencyHealingNonTank, tankIds, healerIds, runes, manaPotion, bossFightDebuff,missed_l5_arcane, bossTrashDebuff, prayOfMending, druidLifeBloom, shamanEarthShield, bossFightExtraArmorBuff, lightGraceBuff} = this.props
        return healing?.filter(entry=>healerIds?.find(id=>id===entry.id))?.map(entry=>{
            const emergency = emergencyHealingTank?.find(i=>i.id===entry.id)?.total || 0
            const emergencyPercent = emergencyHealingTank?.find(i=>i.id===entry.id)?.percent || 0
            const emergencyNonTank = emergencyHealingNonTank?.find(i=>i.id===entry.id)?.total || 0
            const emergencyNonTankPercent = emergencyHealingNonTank?.find(i=>i.id===entry.id)?.percent || 0
            const runesCasts = runes?.find(trashEntry=>trashEntry.id===entry.id)?.runes
            const manaPotionCasts = manaPotion?.find(trashEntry=>trashEntry.id===entry.id)?.manaPotion || 0
            const bossFF = parseFloat(bossFightDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUptime/bossFightDebuff?.totalTime*100).toFixed(2)
            const bossFFCast = bossFightDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUses
            const trashFF = parseFloat(bossTrashDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUptime/bossTrashDebuff?.totalTime*100).toFixed(2)
            const trashFFCast = bossTrashDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUses
            const lifeBloom = this.calculateLifeBloom(tankIds,druidLifeBloom)
            const pom = this.calculatePOM(tankIds,prayOfMending)
            const earthShield = shamanEarthShield?.find(trashEntry=>trashEntry.id===entry.id)?.buffPercent.toFixed(2) * 100
            const earthShieldCast = shamanEarthShield?.find(trashEntry=>trashEntry.id===entry.id)?.buffCast
            const lightGrace = parseFloat(lightGraceBuff?.auras?.find(trashEntry=>trashEntry.id===entry.id)?.totalUptime / lightGraceBuff?.totalTime*100).toFixed(1)
            const dispelCasts = dispels?.find(trashEntry=>trashEntry.id===entry.id)?.total
            return {
                ...entry,
                emergency,
                emergencyPercent,
                emergencyNonTank,
                emergencyNonTankPercent,
                runesCasts,
                manaPotionCasts,
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
                missed_l5_arcane,
                pom
            }
        })

    }

    handleLocaleChange = (v) => {
        localStorage.setItem('cnWCL', JSON.stringify(v))
        this.setState({cnWCL: v})
    }

    render() {
        const {loading, cnWCL} = this.state
        const dataSource =  this.generateSource()
        const columns = [
            {
                title: 'ID',
                dataIndex: 'name',
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
                render: (text, record)=> <span><div>{text}</div><div>{(record.percent*100).toFixed(2)}%,{this.calculatePercentScore(record)}</div></span>
            },
            {
                title: <Tooltip title="括号中第一个值是你对坦克的治疗占你治疗的百分比，第二个值是你对坦克的治疗占坦克受到治疗的百分比。">
                    <span>坦克治疗量<QuestionCircleOutlined /></span>
                </Tooltip>,
                dataIndex: 'healingToTank',
                sorter: (a, b) => a.healingToTank-b.healingToTank,
                render: (text, record)=> <span><div>{text}</div><div>{record.healingToTankPercent}%,{record.tankHealingReceivedPercent}%</div></span>
            },
            {
                title: <Tooltip title="对坦克血在50%以下时的直接治疗量">
                    <span>坦克急救<QuestionCircleOutlined /></span>
                </Tooltip>,
                dataIndex: 'emergency',
                sorter: (a, b) => a.emergency-b.emergency,
                render: (text, record)=> `${text}(${record.emergencyPercent}%)`
            },
            {
                title: <Tooltip title="对非坦克目标血在50%以下时的直接治疗量">
                    <span>团血急救<QuestionCircleOutlined /></span>
                </Tooltip>,
                dataIndex: 'emergencyNonTank',
                sorter: (a, b) => a.emergencyNonTank-b.emergencyNonTank,
                render: (text, record)=> `${text}(${record.emergencyNonTankPercent}%)`
            },
            {
                title: '大蓝',
                dataIndex: 'manaPotionCasts',
                sorter: (a, b) => a.manaPotionCasts-b.manaPotionCasts,
            },
            {
                title: '符文',
                dataIndex: 'runesCasts',
                sorter: (a, b) => a.runesCasts-b.runesCasts,
            },
            {
                title: '驱散',
                dataIndex: 'dispelCasts',
                sorter: (a, b) => a.dispelCasts-b.dispelCasts,
            },
            {
                title: '奶德',
                children: [
                    {
                        title: <Tooltip title="坦克的绽放平均hot值（包含过量）*buff覆盖率的总和">
                            <span>坦克三花(10分)<QuestionCircleOutlined /></span>
                        </Tooltip>,
                        dataIndex: 'lifeBloom',
                        render: (text, record)=> record.type === 'Druid' && `${text}(${record.lifeBloom>globalConstants.LIFEBLOOM_MAX?10 : (record.lifeBloom/globalConstants.LIFEBLOOM_COEFFICIENT).toFixed(0)}分)`
                    },
                    {
                        title: '精灵火覆盖率(施法)',
                        children: [{
                            title: 'Boss(10分)',
                            dataIndex: 'bossFF',
                            render: (text, record)=> record.type === 'Druid' && `${text}%(${record.bossFFCast}次,${(Number.parseFloat(text)/10).toFixed(0)}分)`
                        },{
                            title: '全程(覆盖和施法各5)',
                            dataIndex: 'trashFF',
                            render: (text, record)=> record.type === 'Druid' && `${text}%,${(Number.parseFloat(text)/20).toFixed(0)}分(${record.trashFFCast}次,${Math.min(5,(record.trashFFCast/50)).toFixed(0)}分)`
                        },]
                    },
                ]
            },
            {
                title: '奶萨',
                children: [
                    {
                        title: '大地盾覆盖(施法)(5分)',
                        dataIndex: 'earthShield',
                        render: (text, record)=> record.type === 'Shaman' && `${text}%(${record.earthShieldCast}),${(Number.parseFloat(text)>70? 5 : Number.parseFloat(text)<40 ? 0 : (Number.parseFloat(text)-40)/6).toFixed(0)}分`
                    },
                    {
                        title: <Tooltip title="包括灵感在内">
                            <span>boss战坦克先祖<QuestionCircleOutlined /></span>
                        </Tooltip>,
                        render: (text, record)=> record.type === 'Shaman' && record.bossFightExtraArmorBuff?.map(item=><div key={item.id}>{item.name}: {(item.armorPercent*100).toFixed(1)}%</div>)
                    },
                ]
            },
            {
                title: '奶骑',
                children: [
                    {
                        title: '圣光之赐覆盖',
                        dataIndex: 'lightGrace',
                        render: (text, record)=> record.type === 'Paladin' && `${text}%`
                    },
                    {
                        title: '坦克治疗(占比)',
                        dataIndex: 'healingToTank',
                        render: (text, record)=> record.type === 'Paladin' && `${text}(${record.healingToTankPercent}%)`
                    },
                ]
            },

            {
                title: '奶牧',
                children: [
                    {
                        title: '5级奥术充能没盾次数',
                        dataIndex: 'missed_l5_arcane',
                        render: (text, record)=> record.type === 'Priest' && `${text} ${Number.parseInt(text)>0 ? `扣${text}分`:''}`
                    },
                    {
                        title: <Tooltip title="坦克愈合祷言(包含过量)总和">
                            <span>坦克愈合数据(5分)<QuestionCircleOutlined /></span>
                        </Tooltip>,
                        dataIndex: 'pom',
                        render: (text, record)=> record.type === 'Priest' && `${text}`
                    },
                ]
            },
        ]
        return (
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
        )
    }
}

export default connect(state=>state.report) (DashboardPage)
