import {Component, Fragment} from 'react'
import {Button, Input, Card, Col, Row, List, Spin, message} from 'antd'
import {actions, connect} from 'mirrorx'
import Logo from '../../image/logo_with_title.png'
import {WelcomeBanner} from '../Layout/Banner'


class SinStonePage extends Component{

    constructor(props) {
        super(props)
        this.state={
            report: null,
            loading: false,
        }
    }

    submit = () => {
        const { report} = this.state
        this.setState({loading: true})
        actions.sinStone.fetchSinStone(report).catch(()=>message.error('Something went wrong. Please try again')).finally(()=>{
            this.setState({loading: false})
        })
    }


    render() {
        const {sinStone} = this.props
        const {loading} = this.state

        return (
            <Fragment>
                <WelcomeBanner />

                <Card title={<Row type="flex" gutter={16} align="middle">
                    <img src={Logo} width={100} alt="logo"/>
                    <Col>
                        <Input
                            style={{width: 400}}
                            placeholder="请粘贴reportID，例如: Jzx9tgnTKvVwAX"
                            onChange={event => this.setState({report: event.target.value})}/>
                    </Col>
                    <Col>
                        <Button disabled={!this.state.report} onClick={this.submit}>刻碑</Button>
                    </Col>
                </Row>}>
                    <Spin spinning={loading}>
                        <Row gutter={[12,12]}>
                            {sinStone && Object.keys(sinStone)?.map(item=> <Col xs={24} lg={12} xl={8} xxl={6} key={item}>
                                <Card title={item}>
                                    {sinStone[item] &&
                                    <List
                                        dataSource={sinStone[item]}
                                        renderItem={item => <List.Item>{item}</List.Item>}
                                    />
                                    }
                                </Card>
                            </Col>
                            )}
                        </Row>
                    </Spin>
                </Card>
            </Fragment>
        )
    }
}

export default connect(state=>state.sinStone) (SinStonePage)
