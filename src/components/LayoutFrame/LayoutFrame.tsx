/* 上财果团团 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { PageRouteData, pageRouteEntityMap, pageRoutes } from '../../common/PageRoutes';
import { FreeKeyObject } from '../../utils/FreeKeyObject';
import './LayoutFrame.css'
import { globalData, resetGlobalData } from '../../common/GlobalData';
import { Button, Menu, message, Spin } from 'antd';
import URLNavigate from '../../utils/URLNavigate';
import { LogoutOutlined } from '@ant-design/icons';
import { request } from '../../utils/request';
import MacroDefines from '../../common/MacroDefines';

type LayoutFrameState = {
    pageTitle: string,
    menuItems: Array<any>,
    menuSelectedKey: string,

    redirecting: boolean,

    dataLoading: boolean,
    pageIcon: string
}

export default class LayoutFrame extends React.Component<FreeKeyObject, LayoutFrameState> {
    constructor(props: FreeKeyObject) {
        super(props)

    }

    state: LayoutFrameState = {
        pageTitle: '',
        menuItems: [],
        menuSelectedKey: '',

        redirecting: false,
        dataLoading: false,

        pageIcon: ''
    }

    /**
     * 强制刷新组件。
     */
    update() {
        
        this.forceUpdate()
    }

    setTitle(title: string) {
        this.setState({
            pageTitle: title
        })
    }

    setCurrentPageEntity(entity: PageRouteData) {

        this.state.pageTitle = entity.title!
        this.state.menuSelectedKey = entity.path

        let pageIcon = entity.icon
        if (pageIcon === undefined) {
            pageIcon = ''
        }

        this.setState({
            pageTitle: entity.title!,
            menuSelectedKey: entity.path,
            dataLoading: false,
            pageIcon: pageIcon
        })
    }

    setDataLoading(loading: boolean) {
        this.setState({
            dataLoading: loading
        })
    }

    navigator(path: string) {
        this.setState({
            redirecting: false
        })

        return <Navigate to={'/' + path} />
    }

    override render(): React.ReactNode {
        return <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden'
        }}>

            <div style={{ 
                flex: 1,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
            }}>
                { /* 标题区域。 */ }
                <div style={{
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    color: '#000b',
                    fontSize: 20,
                    paddingLeft: 18,
                    borderBottom: '1px solid #0004'
                }}>
                    { this.state.pageTitle }

                    <Spin 
                        spinning={this.state.dataLoading}
                        style={{
                            marginLeft: 10,
                        }}
                        size='small'
                    />

                    { /* 退出登录。 */ }
                    <Button 
                        style={{
                            right: 8,
                            position: 'absolute'
                        }}
                        shape='round'
                        icon={<LogoutOutlined />}
                        onClick={() => {
                            // todo
                        }}
                    > 退出登录 </Button>
                    
                </div>

                { /* 页面主元素区域。 */ }

                <div style={{
                    flex: 1,
                    position: 'relative'
                }}>
                    { this.props.children }
                </div>
                
            </div>

            { /* 页面跳转。 */ }

            { this.state.redirecting &&
                this.navigator(this.state.menuSelectedKey)
            }

        </div>
    }
}


export function loadPageToLayoutFrame(entity: PageRouteData) {
    globalData.layoutFrameRef.current?.setCurrentPageEntity(entity)
}
