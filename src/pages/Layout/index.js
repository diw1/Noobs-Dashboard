import ProLayout, { PageContainer } from '@ant-design/pro-layout'
import {TeamOutlined, FireOutlined, HomeOutlined, DashboardOutlined} from '@ant-design/icons'
import {Link} from 'mirrorx'
import '@ant-design/pro-layout/dist/layout.css'
import Logo from '../../image/logo.png'


const route = {
    path: '/player',
    routes:  [
        {
            path: '/',
            name: '首页',
            icon: <HomeOutlined />,
        },
        {
            path: '/players',
            name: '队员列表',
            icon: <TeamOutlined />,
        },
        {
            path: '/raids',
            name: '活动列表',
            icon: <FireOutlined />,
        },
        {
            path: '/roles',
            name: '考核组列表',
            icon: <DashboardOutlined />,
        },
    ]}


// eslint-disable-next-line react/display-name
export default (props) => {

    return (<ProLayout
        menuItemRender={(item, dom) => (
            <Link to={item.path}>
                {dom}
            </Link>
        )}
        style={{
            height: '100vh',
            border: '1px solid #ddd',
        }}
        title="Noobs"
        logo={Logo}
        route={route}
    >

        <PageContainer content={props?.content} />
    </ProLayout>)
}
