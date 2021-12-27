import PageLayout from '../Layout'
import {actions, Link} from 'mirrorx'
import ProTable from '@ant-design/pro-table'
import moment from 'moment'

const PlayersPage = () => {

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
                title: '微信ID',
                dataIndex: 'wxid',
                copyable: true,
                search: false
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

    return (
        <PageLayout
            content={playerTable()}
        />
    )
}

export default PlayersPage
