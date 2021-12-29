import PageLayout from '../Layout'
import {actions, connect, Link} from 'mirrorx'
import ProTable from '@ant-design/pro-table'
import moment from 'moment'
import {useEffect} from 'react'
import {globalConstants} from '../../globalConstants'

const mapStateToProps = state => ({
    paramrole: state.common.paramrole
})

const PlayersPage = (props) => {

    useEffect(()=>{
        !props.paramrole && actions.common.fetchAllParams()
    },[props.paramrole])

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
                title: '昵称',
                dataIndex: 'title',
                render: text=> text && text!== 'null' ? text : ''
            },
            {
                title: '考核状态',
                dataIndex: 'appraisalstatus',
                sorter: (a, b) => a.appraisalstatus - b.appraisalstatus,
                valueEnum: globalConstants.APPRAISAL_STATUS
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

export default connect(mapStateToProps,{})(PlayersPage)
