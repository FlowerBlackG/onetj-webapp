/*
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import { pageRoutes } from "./common/PageRoutes";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";
import AppMain from './AppMain';

import './index.css'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

root.render(
    <ConfigProvider
        theme={{
            token: {
                // 设置主题色。
                colorPrimary: '#20a162'
            }
        }}
    >
        <AppMain />
    </ConfigProvider>
)
