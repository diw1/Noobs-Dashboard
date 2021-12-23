import React, {Component} from 'react'
import _ from 'lodash'
import {Button, Input, Table, Card, Col, Row, Switch} from 'antd'
import {actions, connect} from 'mirrorx'
import {globalConstants} from './globalConstants'
import './index.css'
import ReactExport from 'react-data-export'
import TacticalTable from './Tactical'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

class DashboardPage extends Component{

    constructor(props) {
        super(props)
        this.state={
            report: null,
            loading: false,
            manual: [],
            tactical: false
        }
    }

    downloadExcel = () => {
        const {report} = this.state
        this.setState({loading: true})
        let promises = []
        promises.push(actions.report.getBOSSDmg(report))
        promises.push(actions.report.getFight(report))
        Promise.all(promises).then(()=>{
            actions.report.getFightsData(report).then(()=>{this.setState({loading: false})})
        })
    }

    submit = () => {
        const {tactical, report} = this.state
        let promises = []
        this.setState({loading: true})
        promises.push(actions.report.getBOSSDmg(report))
        // promises.push(actions.report.getFight(report))
        promises.push(actions.report.getAlarDebuff(report))
        promises.push(actions.report.getLurkerSpout(report))
        promises.push(actions.report.getKaelFlame(report))
        promises.push(actions.report.getVashjCleave(report))
        Promise.all(promises).then(()=>{
            promises = []
            // if (tactical){
            //     return
            // }else {
            //     const trashIds = this.findTargetIds(globalConstants.TRASHIDS, this.props.fight)
            //     const removedBossIds = this.findTargetIds(globalConstants.REMOVEBOSSIDS, this.props.fight)
            //     promises.push(actions.report.getBossTrashDmg({trashIds, reportId: report, removedBossIds}))
            // }
            Promise.all(promises).then(()=>{
                this.setState({loading: false})
            })

        })
    }

    findTargetIds = (trashIds, fight) => {
        const enemies = fight?.enemies
        return enemies.map(enemy=>trashIds.includes(enemy.guid)&&enemy.id).filter(id=>!!id)
    }

    generateSource = () => {
        const {bossDmg, alarDebuff, lurkerSpout, kaelFlame, vashjCleave} = this.props
        let source = bossDmg?.map(entry=>{
            const alar = parseInt(alarDebuff?.filter(id=>id===entry.id).length)
            const lurker = lurkerSpout?.includes(entry.id)
            const kael = kaelFlame?.find(i=>i.id===entry.id)?.total || 0
            const vashj = vashjCleave?.find(i=>i.id===entry.id)?.total || 0
            console.log(parseInt(kael*globalConstants.KAEL_FINE))
            return {
                id: entry.id,
                name: entry.name,
                type: entry.type,
                bossDmg: entry.total,
                alarDebuff: alar,
                lurkerSpout: lurker,
                kaelFlame:kael,
                vashjCleave: vashj,
                final:Number(alar*globalConstants.ALAR_FINE)+Number(lurker ?globalConstants.LURKER_FINE:0)+
                parseInt(kael*globalConstants.KAEL_FINE)+ (vashj>0?globalConstants.VASHJ_FINE:0)
            }
        })

        return source
    }

    mergeTactics = () => {
        const {slimeTactics, thaddiusTactics, fourTactics, spiderTactics} = this.props
        const tacticsArray = [slimeTactics, thaddiusTactics, fourTactics, spiderTactics]
        return tacticsArray.reduce((sum,item)=>_.zipWith(sum, item, (a,b,)=>({...a,...b})))
    }

    render() {
        const {fightsData} = this.props
        const tactics = this.mergeTactics()
        const {tactical, loading} = this.state
        const dataSource =  this.generateSource()
        const excelDataSource = fightsData
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
                title: 'Boss伤害',
                dataIndex: 'bossDmg',
                sorter: (a, b) => a.bossDmg-b.bossDmg,
            },
            {
                title: `奥踩火三秒以上(${globalConstants.ALAR_FINE}G/次)`,
                dataIndex: 'alarDebuff',
                render: (text, record) => record.alarDebuff>0 ? text+'次': null
            },
            {
                title: '王子烈焰风暴(1000伤害80G)',
                dataIndex: 'kaelFlame',
                sorter: (a, b) => a.kaelFlame-b.kaelFlame,
            },
            {
                title: `鱼斯拉喷涌(${globalConstants.LURKER_FINE}G)`,
                dataIndex: 'lurkerSpout',
                render: (text, record) => record.lurkerSpout && '菜逼被喷飞'
            },
            {
                title: `瓦斯琪顺劈伤害(有伤害即${globalConstants.VASHJ_FINE}G)`,
                dataIndex: 'vashjCleave',
                sorter: (a, b) => a.vashjCleave-b.vashjCleave,
            },
            {
                title: '瓦斯琪踩毒两秒以上(300G/次)',
                dataIndex: 'alarDebuff',
                render: (text, record) => record.alarDebuff>0 ? text+'次': null
            },
            {
                title: '总罚款',
                dataIndex: 'final',
                sorter: (a, b) => a.final-b.final,
            },
        ]
        return (
            <Card title={<Row type="flex" gutter={16}>
                {/*<Col>*/}
                {/*    <Switch*/}
                {/*        checked={tactical}*/}
                {/*        onChange={(checked)=>this.setState({tactical: checked})}*/}
                {/*        checkedChildren="战术动作"*/}
                {/*        unCheckedChildren="伤害统计"*/}
                {/*    />*/}
                {/*</Col>*/}
                <Col>
                    <Input
                        style={{width: 400}}
                        placeholder="请粘贴reportID，例如: Jzx9tgnTKvVwAX"
                        onChange={event => this.setState({report: event.target.value})}/>
                </Col>
                <Col>
                    <Button onClick={this.submit}>提交</Button>
                </Col>
                {!tactical && <Col><Button onClick={this.downloadExcel}>生成下载链接</Button></Col>}
                {excelDataSource &&  <Col><ExcelFile element={<Button>下载</Button>}>
                    <ExcelSheet data={excelDataSource} name="原始数据">
                        <ExcelColumn label="mark" value="mark"/>
                        <ExcelColumn label="BattleID" value="BattleID"/>
                        <ExcelColumn label="BattleName" value="BattleName"/>
                        <ExcelColumn label="StartTime" value="StartTime"/>
                        <ExcelColumn label="EndTime" value="EndTime"/>
                        <ExcelColumn label="class" value="class"/>
                        <ExcelColumn label="name" value="name"/>
                        <ExcelColumn label="damage-done" value="damageDone"/>
                        <ExcelColumn label="healing" value="healing"/>
                    </ExcelSheet>
                </ExcelFile>
                </Col>}
            </Row>}>
                {tactical ?
                    <TacticalTable
                        loading={loading}
                        tactics={tactics}
                    /> :
                    <Table
                        rowClassName={record => record.type}
                        size="small"
                        loading={loading}
                        dataSource={dataSource}
                        columns={columns}
                        rowKey='id'
                        pagination={false}
                    />
                }
            </Card>
        )
    }
}

export default connect(state=>state.report) (DashboardPage)
