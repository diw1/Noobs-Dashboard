import PageLayout from '../Layout'
import {actions, Link, connect} from 'mirrorx'
import ProTable from '@ant-design/pro-table'
import moment from 'moment'
import {globalConstants} from '../../globalConstants'
import {useEffect, useState} from 'react'
import {Descriptions, Badge, Space} from 'antd'

const mapStateToProps = state => ({
    paramrole: state.common.paramrole,
    raidData: state.raid.raidData
})

const RaidPage = (props) => {
    const {raidId} = props.match.params
    const [roleData, setRoleData] = useState()
    useEffect(()=>{
        actions.raid.fetchRaid({id: raidId}).then(result=>{
            let sum = {}
            result?.data?.scoreres.map(record=>{
                const count = sum[record.paramroleid]?.count? sum[record.paramroleid].count+1 : 1
                const score = sum[record.paramroleid]?.score? sum[record.paramroleid].score+record.score: record.score
                sum[record.paramroleid] = {
                    paramroleid: record.paramroleid,
                    paramrolename: record.paramrolename,
                    count,
                    score,
                    avg: Number.parseInt(score/count)
                }
            })
            setRoleData(Object.values(sum))
        })
        return function cleanup(){
            actions.raid.save({raidData: null})
        }
    },[raidId])
    const playerTable = (raidData) =>{
        const columns = [
            {
                title: '队员名称',
                dataIndex: 'playername',
                render: (text, item)=> <Link to={`/player/${item.player_id}`}>{text}</Link>
            },
            {
                title: '出战账号名称',
                dataIndex: 'accountname',
            },
            {
                title: '职业天赋',
                dataIndex: 'paramrolename',
                sorter: (a, b) => a.paramroleid - b.paramroleid,
                render: (text, item)=> <Link to={`/role/${item.paramroleid}`}>{text}</Link>
            },
            {
                title: '分数',
                dataIndex: 'score',
                sorter: (a, b) => a.score - b.score,
                defaultSortOrder: 'descend'
            },
        ]
        return(
            <ProTable
                columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: 25,
                }}
                search={false}
                request={ () => {
                    return Promise.resolve( {
                        data: raidData?.scoreres,
                        success: true,
                    })
                }}
            />)
    }

    const roleTable = (roleData, raidData) =>{
        const columns = [
            {
                title: '职业天赋',
                dataIndex: 'paramrolename',
                render: (text, item)=> <Link
                    to={{pathname: `/role/${item.paramroleid}`, state: {faction: raidData.raid.paramfaction_id}}}
                >{text}</Link>
            },
            {
                title: '人数',
                dataIndex: 'count',
            },

            {
                title: '平均分',
                dataIndex: 'avg',
                sorter: (a, b) => a.avg - b.avg,
                defaultSortOrder: 'descend'
            },
        ]
        return(
            <ProTable
                columns={columns}
                rowKey="paramroleid"
                pagination={false}
                search={false}
                request={ () => {
                    return Promise.resolve( {
                        data: roleData,
                        success: true,
                    })
                }}
            />)
    }

    const description = (raidData) => {
        const raid = raidData?.raid

        return (
            <Descriptions title={raid.name}>
                <Descriptions.Item label="阵营">
                    <Badge
                        status={globalConstants.FACTION_STATUS[raid.paramfaction_id]?.status.toLowerCase()}
                        text={raid.pfname}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="CD">
                    {raid.pcname}
                </Descriptions.Item>
                <Descriptions.Item label="团长">
                    {raid.rlname}
                </Descriptions.Item>
                <Descriptions.Item label="时间">
                    {moment(raid.raidstarttime*1000).format(globalConstants.DATETIME_FORMAT)}
                </Descriptions.Item>
                <Descriptions.Item label="WCL地址">
                    {raid.wclcode && !raid.wclcode.includes('NULL') ?
                        <a href={globalConstants.WCL_BASE_URL+raid.wclcode} target="_blank" rel="noreferrer">{raid.wclcode}</a> : ''}
                </Descriptions.Item>
            </Descriptions>
        )
    }
    const content = () => {
        return (
            props.raidData && <Space direction="vertical">
                {description(props.raidData)}
                {playerTable(props.raidData)}
                {roleData && roleTable(roleData, props.raidData)}
            </Space>
        )
    }
    return (
        <PageLayout
            content={content()}
        />
    )
}

export default connect(mapStateToProps,{})(RaidPage)
