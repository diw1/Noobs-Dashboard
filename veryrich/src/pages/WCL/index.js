import {Component} from 'react'
import {Button, Input, Table, Card, Col, Row, Switch, Tooltip} from 'antd'
import {actions, connect} from 'mirrorx'
import {QuestionCircleOutlined} from '@ant-design/icons'
import {globalConstants} from '../../globalConstants'


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
        promises.push(actions.report.getEmergencyHealing(report))
        Promise.all(promises).then(()=>{
            promises = []
            promises.push(actions.report.getRunes(report))
            promises.push(actions.report.getManaPotion(report))
            promises.push(actions.report.getLifeBloomHealing(report))
            promises.push(actions.report.getEarthShield(report))
            promises.push(actions.report.getBossFightArmorBuff(report))
            promises.push(actions.report.getLightGraceBuff(report))
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

    generateSource = () => {
        const {healing, emergencyHealing, tankIds, healerIds, runes, manaPotion, bossFightDebuff, bossTrashDebuff, druidLifeBloom, shamanEarthShield, bossFightExtraArmorBuff, lightGraceBuff} = this.props
        return healing?.filter(entry=>healerIds?.find(id=>id===entry.id))?.map(entry=>{
            const emergency = emergencyHealing?.find(i=>i.id===entry.id)?.total || 0
            const runesCasts = runes?.find(trashEntry=>trashEntry.id===entry.id)?.runes
            const manaPotionCasts = manaPotion?.find(trashEntry=>trashEntry.id===entry.id)?.manaPotion || 0
            const bossFF = parseFloat(bossFightDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUptime/bossFightDebuff?.totalTime*100).toFixed(2)
            const bossFFCast = bossFightDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUses
            const trashFF = parseFloat(bossTrashDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUptime/bossTrashDebuff?.totalTime*100).toFixed(2)
            const trashFFCast = bossTrashDebuff?.auras.find(debuff=>debuff.guid===globalConstants.FAERIEFIRE_ID)?.totalUses
            const lifeBloom = this.calculateLifeBloom(tankIds,druidLifeBloom)
            const earthShield = shamanEarthShield?.find(trashEntry=>trashEntry.id===entry.id)?.buffPercent.toFixed(2) * 100
            const earthShieldCast = shamanEarthShield?.find(trashEntry=>trashEntry.id===entry.id)?.buffCast
            const lightGrace = parseFloat(lightGraceBuff?.auras?.find(trashEntry=>trashEntry.id===entry.id)?.totalUptime / lightGraceBuff?.totalTime*100).toFixed(1)
            return {
                id: entry.id,
                name: entry.name,
                type: entry.type,
                healing: entry.total,
                emergency,
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
                lightGrace
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
                dataIndex: 'healing',
                sorter: (a, b) => a.healing-b.healing,
                defaultSortOrder: 'descend',
            },
            {
                title: '坦克急救治疗',
                dataIndex: 'emergency',
                sorter: (a, b) => a.emergency-b.emergency,
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
                title: '奶德',
                children: [
                    {
                        title: <Tooltip title="坦克的绽放平均hot值（包含过量）*buff覆盖率的总和">
                            <span>坦克三花数据<QuestionCircleOutlined /></span>
                        </Tooltip>,
                        dataIndex: 'lifeBloom',
                        render: (text, record)=> record.type === 'Druid' && text
                    },
                    {
                        title: '精灵火覆盖率(施法)',
                        children: [{
                            title: 'Boss',
                            dataIndex: 'bossFF',
                            render: (text, record)=> record.type === 'Druid' && `${text}%(${record.bossFFCast})`
                        },{
                            title: '全程',
                            dataIndex: 'trashFF',
                            render: (text, record)=> record.type === 'Druid' && `${text}%(${record.trashFFCast})`
                        },]
                    },
                ]
            },
            {
                title: '奶萨',
                children: [
                    {
                        title: '大地盾覆盖率(施法)',
                        dataIndex: 'earthShield',
                        render: (text, record)=> record.type === 'Shaman' && `${text}%(${record.earthShieldCast})`
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
                        title: '圣光之赐覆盖率',
                        dataIndex: 'lightGrace',
                        render: (text, record)=> record.type === 'Paladin' && `${text}%`
                    },
                ]
            },

        ]
        return (
            <Card title={<Row type="flex" gutter={16}>
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
                    <Button onClick={this.submit}>提交</Button>
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
                />

            </Card>
        )
    }
}

export default connect(state=>state.report) (DashboardPage)
