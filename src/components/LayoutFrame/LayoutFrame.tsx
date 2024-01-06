/* 上财果团团 */

import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FreeKeyObject } from '../../utils/FreeKeyObject';
import './LayoutFrame.css'
import { globalData, resetGlobalData } from '../../common/GlobalData';
import { Button, Menu, message, Spin } from 'antd';
import URLNavigate from '../../utils/URLNavigate';
import { ArrowLeftOutlined, LeftOutlined, LogoutOutlined } from '@ant-design/icons';
import { request } from '../../utils/request';
import MacroDefines from '../../common/MacroDefines';
import { PageRouteData } from '../../common/PageRoutes';

type LayoutFrameState = {
    pageTitle: string,
    menuItems: Array<any>,
    menuSelectedKey: string,

    redirecting: boolean,

    dataLoading: boolean,
    pageIcon: string,

    onNavigateBack: boolean
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

        pageIcon: '',

        onNavigateBack: false
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

        if (this.state.onNavigateBack) {
            // todo: 目前仅能返回主页。
            return <Navigate to={ '/home' } replace={true} />
        }

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
                    paddingLeft: 8,
                    borderBottom: '1px solid #0004',
                    userSelect: 'none'
                }}>

                    { /* 返回。 */ }
                    <Button
                        shape='circle'
                        icon={<ArrowLeftOutlined />}
                        onClick={() => {
                            this.setState({
                                onNavigateBack: true
                            })
                        }}
                    />  

                    <div style={{ width: 16 }} />

                    <div
                        style={{
                            textAlign: 'center',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            maxWidth: 320
                        }}
                    >

                        { this.state.pageTitle }
                    </div>

                    <Spin 
                        spinning={this.state.dataLoading}
                        style={{
                            marginLeft: 10,
                        }}
                        size='small'
                    />
                    
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

    override componentDidMount() {
        if (currentRouteEntity !== undefined) {
            this.setCurrentPageEntity(currentRouteEntity)
        }

        if (pageTitle !== undefined) {
            this.setTitle(pageTitle)
        }
    }
}

let currentRouteEntity: PageRouteData | undefined = undefined
let pageTitle: string | undefined = undefined

export function loadPageToLayoutFrame(entity: PageRouteData) {
    currentRouteEntity = entity
    pageTitle = entity.title
    globalData.layoutFrameRef.current?.setCurrentPageEntity(entity)
}

export function setLayoutFrameTitle(title: string) {
    pageTitle = title
    globalData.layoutFrameRef.current?.setTitle(title)
}
