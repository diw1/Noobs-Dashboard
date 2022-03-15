import {Row, Col, Typography, } from 'antd'
import {HeartFilled} from '@ant-design/icons'

export const WelcomeBanner = () => {
    return (
        <div className="dashboard_alert">
            <div className="normal_alert alerts">
                <Row type="flex" align="middle" gutter={20}>
                    <Col>
                        <HeartFilled style={{fontSize:36}}/>
                    </Col>
                    <Col flex={1}>
                        <div className="title">Noobs双阵营竞速招募优秀治疗</div>
                        <div>详情请咨询招募小姐姐微信：<Typography.Text copyable style={{color: 'white'}}>zm_17th</Typography.Text></div>
                    </Col>
                </Row>

            </div>
        </div>
    )

}
