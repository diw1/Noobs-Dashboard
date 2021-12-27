import PageLayout from '../Layout'
import {actions, Link, connect} from 'mirrorx'
import ProTable from '@ant-design/pro-table'
import moment from 'moment'
import {globalConstants} from '../../globalConstants'
import {Fragment, useEffect} from 'react'
import {Descriptions, Badge } from 'antd'

const mapStateToProps = state => ({
    paramrole: state.common.paramrole,
    playerData: state.player.playerData
})

const PlayerPage = (props) => {
    const {playerId} = props.match.params
    useEffect(()=>{actions.player.fetchPlayer({id: playerId})},[playerId])
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
                valueEnum: {
                    1: { text: '正式队员', status: 'Success' },
                    2: { text: '考核队员', status: 'Processing' },
                    3: { text: '冷冻队员', status: 'Error' },
                },
            },
            {
                title: '创建时间',
                dataIndex: 'createtime',
                search: false,
                sorter: (a, b) => a.createtime - b.createtime,
                render: (text)=> moment(text* 1000).format('YYYY-MM-DD HH:mm')
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

    const raidTable = (playerData) =>{
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
                title: 'RL名称',
                dataIndex: 'rlname',
                search: false
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
                renderText: (text)=> `第${text}CD`
            },
            {
                title: '完成状态',
                dataIndex: 'finishstatus',
                valueEnum: {
                    1: { text: '已完成评分', status: 'Success' },
                    2: { text: '尚未开始', status: 'Error' },
                    3: { text: '评分阶段', status: 'Processing' },
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
            <Fragment>
                {description()}
                {props.playerData && raidTable(props.playerData)}
            </Fragment>
        )
    }
    return (
        <PageLayout
            content={content()}
        />
    )
}

export default connect(mapStateToProps,{})(PlayerPage)
