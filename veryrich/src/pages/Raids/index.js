import PageLayout from '../Layout'
import {actions, Link} from 'mirrorx'
import ProTable from '@ant-design/pro-table'
import {globalConstants} from '../../globalConstants'

const RaidsPage = () => {

    const raidTable = () =>{
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
                    pageSize: 25,
                }}
                request={async (params) => {
                    const result = await actions.raid.fetchAllRaids({
                        page: params.current,
                        limit: params.pageSize,
                        ...params
                    })
                    return {
                        data: result?.data?.raidres,
                        success: result?.code===1,
                        total: result?.data?.raidcount
                    }
                }}
            />)
    }

    return (
        <PageLayout
            content={raidTable()}
        />
    )
}

export default RaidsPage
