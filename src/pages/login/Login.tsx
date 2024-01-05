/*
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import { ReactNode } from "react";
import { pageRouteEntityMap } from "../../common/PageRoutes";
import { loadPageToLayoutFrame } from "../../components/LayoutFrame/LayoutFrame";
import { later } from "../../utils/later";
import React from "react";
import { Button } from "antd";

import './Login.css'
import Version from "../../common/Version";
import { Navigate } from "react-router-dom";
import HttpUrlUtils from "../../utils/HttpUrlUtils";
import TJApi from "../../utils/TJApi";


interface LoginPageState {
    toOAuthPage: boolean
    toHomePage: boolean
}

export default class LoginPage extends React.Component<
    any, LoginPageState
> {
    pageEntity = pageRouteEntityMap['login']
    state: LoginPageState = {
        toOAuthPage: false,
        toHomePage: false
    }

    constructor(props: any) {
        super(props)

        later(() => {
            loadPageToLayoutFrame(this.pageEntity)

            let args = HttpUrlUtils.getUrlData().args
            if (!args.has('forceStay')) {
                this.tryAutoLogin()
            }
            
        })
    }

    tryAutoLogin() {
        if (TJApi.instance().tokenAvailable()) {
            this.state.toHomePage = true
            this.setState({})
        }
    }

    override render(): React.ReactNode {
        if (this.state.toOAuthPage) {
            return <Navigate to={'/tongji-oauth'} />
        } else if (this.state.toHomePage) {
            return <Navigate to={'/home'} />
        }

        return <div
            style={{
                backgroundSize: 'cover',
                backgroundImage: 'url(https://canfish.oss-cn-shanghai.aliyuncs.com/app/onetj-webapp/login-page-background.webp)',

                width: '100%',
                height: '100%',
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 360,
                    background: '#ffffff44',
                    borderRadius: 24,
                    padding: 24,
                    boxSizing: 'border-box'
                }}
            >
                <div
                    className="button"
                    onClick={() => {
                        this.state.toOAuthPage = true
                        this.setState({})
                    }}
                >
                    统一身份认证登录
                </div>
            </div>


            { /* 版本信息 */ }

            <div
                style={{
                    position: 'absolute',
                    bottom: 4,
                    color: '#fff'
                }}
            >
                Version: { Version.tag } ({ Version.code })  
            </div>

        </div>
    }
}
