import PageLayout from '../Layout'
import {actions, connect, Link} from 'mirrorx'
import ProTable from '@ant-design/pro-table'
import {Heatmap} from '@ant-design/charts'
import moment from 'moment'
import {Fragment, useEffect, useState} from 'react'
import {globalConstants} from '../../globalConstants'
import {Space, Select, Radio} from 'antd'

const mapStateToProps = state => ({
    paramrole: state.common.paramrole,
    roleData: state.role.roleData
})

const AttendanceHeatmap = (props) => {
    const config = {
        data: props.data,
        yField: 'name',
        xField: 'cd',
        colorField: 'attendance',
        shape: 'square',
        sizeRatio: 0.5,
        color: ['#0d5fbb', '#7eadfc', '#fd8b6f', '#aa3523'],
        label: {
            style: {
                fill: '#fff',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)',
            },
        },
    }

    return <Heatmap {...config} />
}


const RolePage = (props) => {
    const {paramrole} = props
    const [role, setRole] = useState()
    const [faction, setFaction] = useState(1)
    const [allianceAttendance, setAllianceAttendance] = useState()
    const selectRole = (v) => {
        setRole(v)
        actions.role.fetchRole({paramrole_id:v}).then(result=>{
            setAllianceAttendance(mapToAttendance(result?.data?.allianceroleattendres))
        })
    }

    const mapToAttendance = (data) =>{
        let result = []
        data.map(record=>{
            result = result.concat(record.attend.map(attend=>({
                name: record.playername,
                cd: Object.keys(attend)[0],
                attendance: attend[Object.keys(attend)[0]]
            })))
        })
        return result
    }
    useEffect(()=>{
        !paramrole && actions.common.fetchAllParams()
    },[paramrole])

    const roleOptions =  paramrole?.map(role=>(
        <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
    ))

    const playerTable = () =>{
        const columns = [
            {
                dataIndex: 'id',
                valueType: 'indexBorder',
                width: 36,
            },
            {
                title: '队员名称',
                dataIndex: 'name',
                render: (text, item)=> <Link to={`/player/${item.id}`}>{text}</Link>
            },
            {
                title: '考核状态',
                dataIndex: 'appraisalstatus',
                sorter: (a, b) => a.appraisalstatus - b.appraisalstatus,
                valueEnum: globalConstants.APPRAISAL_STATUS
            },
            {
                title: '创建时间',
                dataIndex: 'createtime',
                search: false,
                sorter: (a, b) => a.createtime - b.createtime,
                render: (text)=> moment(text* 1000).format(globalConstants.DATETIME_FORMAT)
            },
        ]
        return(
            <ProTable
                columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: 25,
                }}
                request={async (params) => {
                    const result = await actions.player.fetchAllPlayers({
                        page: params.current,
                        limit: params.pageSize,
                        ...params
                    })
                    return {
                        data: result?.data?.playerres,
                        success: result?.code===1,
                        total: result?.data?.playercount
                    }
                }}
            />)
    }



    return (
        <PageLayout content={
            <Fragment>
                <Space>
                    <Select
                        placeholder="请选择职业天赋进行查看"
                        style={{width: 250}}
                        size="large"
                        value={role}
                        onSelect={selectRole}
                    >{roleOptions}</Select>
                    {role && <Radio.Group value={faction} buttonStyle="solid" size="large" onChange={e=>setFaction(e.target.value)}>
                        <Radio.Button value={1}>联盟</Radio.Button>
                        <Radio.Button value={2}>部落</Radio.Button>
                    </Radio.Group>}
                </Space>
                {allianceAttendance && faction === 1 && <AttendanceHeatmap data={allianceAttendance}/>}
                {allianceAttendance && faction === 1 && <AttendanceHeatmap data={allianceAttendance}/>}
            </Fragment>}
        />
    )
}

export default connect(mapStateToProps,{})(RolePage)
