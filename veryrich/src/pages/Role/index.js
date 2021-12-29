import PageLayout from '../Layout'
import {actions, connect, Link} from 'mirrorx'
import ProTable from '@ant-design/pro-table'
import {Fragment, useEffect, useState} from 'react'
import {globalConstants} from '../../globalConstants'
import {Space, Select, Radio, Card, Badge} from 'antd'

const mapStateToProps = state => ({
    paramrole: state.common.paramrole,
    paramcd: state.common.paramcd,
    roleData: state.role.roleData
})

const checkAttendance = (status) => {
    return !status?.includes('请假') && !status?.includes('未满足')
}

const attendanceTable = (cdres, attendance) =>{
    const columns = [
        {
            title: '队员名称',
            dataIndex: 'playername',
            render: (text, item)=> <Link to={`/player/${item.player_id}`}>{text}</Link>
        }
    ].concat(cdres?.map(cd=>({
        title: cd.name,
        dataIndex: cd.name,
        render: text=>  <Badge
            status={globalConstants.ATTENDANCE_STATUS[text]?.status}
            text={text}
        />
    }))).concat([{
        title: '应到',
        dataIndex: 'sum',
    },{
        title: '实到',
        dataIndex: 'attends',
    },{
        title: '出勤率',
        dataIndex: 'rate',
        sorter: (a,b)=>a.attends/a.sum-b.attends/b.sum
    }])

    return(
        <Card title="出战情况" size="small">
            <ProTable
                columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                }}
                options={false}
                search={false}
                request={ () => {
                    return Promise.resolve( {
                        data: attendance,
                        success: true,
                    })
                }}
            /></Card>)
}

const scoreTable = (raidres, score) =>{
    const columns = [
        {
            title: '队员名称',
            dataIndex: 'playername',
            render: (text, item)=> <Link to={`/player/${item.player_id}`}>{text}</Link>
        }
    ].concat(raidres?.map(raid=>({
        title: raid.name,
        dataIndex: raid.name,
    }))).concat([{
        title: '场次',
        dataIndex: 'count',
    },{
        title: '总分',
        dataIndex: 'sum',
    },{
        title: '平均分',
        dataIndex: 'avg',
        sorter: (a,b)=>a.avg-b.avg,
        defaultSortOrder: 'descend'
    }])

    return(
        <Card title="评分情况" size="small">
            <ProTable
                columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                }}
                options={false}
                search={false}
                request={ () => {
                    return Promise.resolve( {
                        data: score,
                        success: true,
                    })
                }}
            /></Card>)
}

const RolePage = (props) => {
    const {paramrole, match} = props
    const [role, setRole] = useState(match.params?.roleId ? Number.parseInt(match.params?.roleId): undefined)
    const [faction, setFaction] = useState(1)
    const [allianceAttendance, setAllianceAttendance] = useState()
    const [cdres, setCdres] = useState()
    const [hordeAttendance, setHordeAttendance] = useState()
    const [allianceScore, setAllianceScore] = useState()
    const [allianceRaids, setAllianceRaids] = useState()
    const [hordeScore, setHordeScore] = useState()
    const [hordeRaids, setHordeRaids] = useState()

    const selectRole = (v) => {
        setRole(v)
        actions.role.fetchRole({paramrole_id:v}).then(result=>{
            setStates(result)
        })
    }

    const setStates = (result) => {
        setCdres(result?.data?.cdres)
        setAllianceAttendance(mapToAttendance(result?.data?.allianceroleattendres))
        setHordeAttendance(mapToAttendance(result?.data?.horderoleattendres))
        setAllianceRaids(result?.data?.allianceraidres)
        setAllianceScore(mapToScore(result?.data?.alliancerolescoreres))
        setHordeRaids(result?.data?.horderaidres)
        setHordeScore(mapToScore(result?.data?.horderolescoreres))
    }

    const mapToAttendance = (data) =>{
        let result
        result = data!=='' && data?.map(record=>{
            let attend = record.attend?.reduce((acc,item)=>Object.assign(acc,item),{})
            attend.sum = record.attend?.length
            attend.miss = record.attend?.reduce((acc,item)=>acc + checkAttendance(Object.values(item)[0]) ? 0 : 1 ,0)
            attend.attends = attend.sum - attend.miss
            attend.rate =  (attend.attends/attend.sum).toLocaleString('en', {style: 'percent'})
            return Object.assign(record, attend)
        })
        return result
    }

    const mapToScore = (data) =>{
        let result
        result = data!=='' && data?.map(record=>{
            let score = record.score?.reduce((acc,item)=>Object.assign(acc,item),{})
            score.count = record.score?.reduce((acc,item)=>acc + (Object.values(item)[0]=== '' ? 0 : 1) ,0)
            score.sum = record.score?.reduce((acc,item)=>acc + Object.values(item)[0] ,0)
            score.avg =  (score.sum/score.count).toFixed(1)
            return Object.assign(record, score)
        })
        return result
    }

    useEffect(()=>{
        !paramrole && actions.common.fetchAllParams()
    },[paramrole])

    useEffect(()=>{
        match.params.roleId && actions.role.fetchRole({paramrole_id:match.params.roleId}).then(result=>{
            setStates(result)
        })
        return actions.role.save({roleData: null})
        // eslint-disable-next-line
    },[match.params.roleId])

    const roleOptions =  paramrole?.map(role=>(
        <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
    ))

    return (
        <PageLayout content={
            <Fragment>
                <Space direction="vertical">
                    <Space>
                        {paramrole && <Select
                            placeholder="请选择职业天赋进行查看"
                            style={{width: 250}}
                            size="large"
                            value={role}
                            onSelect={selectRole}
                        >{roleOptions}</Select>
                        }
                        {role && <Radio.Group value={faction} buttonStyle="solid" size="large" onChange={e=>setFaction(e.target.value)}>
                            <Radio.Button value={1}>联盟</Radio.Button>
                            <Radio.Button value={2}>部落</Radio.Button>
                        </Radio.Group>}
                    </Space>

                    {allianceAttendance && faction === 1 && attendanceTable(cdres,allianceAttendance)}
                    {hordeAttendance && faction === 2 && attendanceTable(cdres,hordeAttendance)}
                    {allianceScore && faction === 1 && scoreTable(allianceRaids,allianceScore)}
                    {hordeScore && faction === 2 && scoreTable(hordeRaids,hordeScore)}
                </Space>
            </Fragment>}
        />
    )
}

export default connect(mapStateToProps,{})(RolePage)
