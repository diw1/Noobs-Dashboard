import PageLayout from '../Layout'
import {actions, Link, connect} from 'mirrorx'
import ProTable from '@ant-design/pro-table'
import {globalConstants} from '../../globalConstants'
import {useEffect} from 'react'
import {Descriptions, Badge, Space } from 'antd'

const mapStateToProps = state => ({
    paramrole: state.common.paramrole,
    paramcd: state.common.paramcd,
    playerData: state.player.playerData
})

const PlayerPage = (props) => {
    const {playerId} = props.match.params
    useEffect(()=>{actions.player.fetchPlayer({id: playerId})},[playerId])
    const roleTable = (playerData) =>{
        const columns = [
            {
                title: '队员职业天赋名称',
                dataIndex: 'name',
                render: (text, item)=> <Link to={`/role/${item.paramrole_id}`}>{text}</Link>
            },
        ]
        return(
            <ProTable
                style={{width: 300}}
                columns={columns}
                rowKey="id"
                headerTitle="考核列表"
                pagination={false}
                search={false}
                options={false}

                request={ () => {
                    return Promise.resolve( {
                        data: playerData?.roleres,
                        success: true,
                    })
                }}
            />)
    }

    const raidTable = (playerData) =>{
        const cdEnum = props.paramcd?.reduce((result,item)=>{
            result[item.id]=item.name
            return result
        },{})
        const columns = [
            {
                dataIndex: 'id',
                valueType: 'indexBorder',
                width: 36,
            },
            {
                title: '活动名称',
                dataIndex: 'name',
                render: (text, item)=> <Link to={`/raid/${item.id}`}>{text}</Link>
            },
            {
                title: 'WCL地址',
                dataIndex: 'wclcode',
                search: false,
                renderText: (text) => text && !text.includes('NULL') ?
                    <a href={globalConstants.WCL_BASE_URL+text} target="_blank" rel="noreferrer">{text}</a> : ''
            },
            {
                title: '阵营',
                dataIndex: 'paramfaction_id',
                valueEnum: {
                    1: { text: '联盟', status: 'Processing' },
                    2: { text: '部落', status: 'Error' },
                },
            },
            {
                title: 'CD',
                dataIndex: 'paramcd_id',
                valueEnum: cdEnum
            },
            {
                title: '完成状态',
                dataIndex: 'finishstatus',
                valueEnum: {
                    1: { text: '已完成评分', status: 'Success' },
                    2: { text: '尚未开始', status: 'Error' },
                    3: { text: '评分阶段', status: 'Processing' },
                    4: { text: '待导入', status: 'Processing' },
                    5: { text: '导入中', status: 'Processing' },
                    6: { text: '导入完毕', status: 'Processing' },
                },
                search: false,
            },

        ]
        return(
            <ProTable
                columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                }}
                headerTitle="活动列表"
                search={false}
                request={ () => {
                    return Promise.resolve( {
                        data: playerData?.raidres,
                        success: true,
                    })
                }}
            />)
    }

    const description = () => {
        return (
            <Descriptions title={props.playerData?.player?.name}>
                <Descriptions.Item label="昵称">{props.playerData?.player?.title}</Descriptions.Item>
                <Descriptions.Item label="考核状态">
                    <Badge
                        status={globalConstants.APPRAISAL_STATUS[props.playerData?.player?.appraisalstatus]?.status.toLowerCase()}
                        text={globalConstants.APPRAISAL_STATUS[props.playerData?.player?.appraisalstatus]?.text}
                    />
                </Descriptions.Item>
            </Descriptions>
        )
    }
    const content = () => {
        return (
            <Space direction="vertical">
                {description()}
                {props.playerData && roleTable(props.playerData)}
                {props.playerData && raidTable(props.playerData)}
            </Space>
        )
    }
    return (
        <PageLayout
            content={content()}
        />
    )
}

export default connect(mapStateToProps,{})(PlayerPage)
