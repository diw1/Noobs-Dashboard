import PageLayout from '../Layout'
import {actions, Link, connect} from 'mirrorx'
import ProTable from '@ant-design/pro-table'
import moment from 'moment'
import {globalConstants} from '../../globalConstants'
import {Fragment, useEffect} from 'react'
import {Descriptions, Badge } from 'antd'

const mapStateToProps = state => ({
    paramrole: state.common.paramrole,
    raidData: state.raid.raidData
})

const RaidPage = (props) => {
    const {raidId} = props.match.params
    useEffect(()=>{actions.raid.fetchRaid({id: raidId})},[raidId])
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
                title: '分数',
                dataIndex: 'score',
                sorter: (a, b) => a.score - b.score,
            },
            // {
            //     title: '创建时间',
            //     dataIndex: 'createtime',
            //     search: false,
            //     sorter: (a, b) => a.createtime - b.createtime,
            //     render: (text)=> moment(text* 1000).format(globalConstants.DATETIME_FORMAT)
            // },
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


    const description = (raidData) => {
        const raid = raidData?.raid

        return (
            <Descriptions title={raid.name}>
                <Descriptions.Item label="阵营">
                    <Badge
                        status={globalConstants.FACTION_STATUS[raid.paramcd_id]?.status.toLowerCase()}
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
            props.raidData && <Fragment>
                {description(props.raidData)}
                {playerTable(props.raidData)}
            </Fragment>
        )
    }
    return (
        <PageLayout
            content={content()}
        />
    )
}

export default connect(mapStateToProps,{})(RaidPage)
