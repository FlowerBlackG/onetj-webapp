/*
 * 同济开放平台接口封装。
 *
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import React from "react";
import { later } from "../../utils/later";
import { globalData } from "../../common/GlobalData";
import { loadPageToLayoutFrame } from "../../components/LayoutFrame/LayoutFrame";
import HttpUrlUtils from "../../utils/HttpUrlUtils";
import { Navigate } from "react-router-dom";
import TJApi from "../../utils/TJApi";
import { message } from "antd";
import PageRouteManager from "../../common/PageRoutes";


interface TongjiOAuthPageState {
    errorMsg: string
    backToLogin: boolean
}

export default class TongjiOAuthPage extends React.Component<
    any, TongjiOAuthPageState
> {
    pageEntity = PageRouteManager.getRouteEntity('tongji-oauth')

    state: TongjiOAuthPageState = {
        errorMsg: '',
        backToLogin: false
    }

    constructor(props: any) {
        super(props)

        later(() => {
            loadPageToLayoutFrame(this.pageEntity)
            this.processUrlData()
        })

        
    }

    redirectToTongjiLoginSite() {
        let target = TJApi.BASE_URL.concat(
            '/keycloak/realms/OpenPlatform/protocol/openid-connect/auth'
        )

        target += '?redirect_uri='.concat(TJApi.getOAuthRedirectUrl())
        target += '&client_id='.concat(TJApi.CLIENT_ID)
        target += '&response_type=code'

        let scopeList = TJApi.SCOPE_LIST
        let scope = ''
        for (let it of scopeList) {
            if (scope === '') {
                scope = it
            } else {
                scope += ' '
                scope += it
            }
        }

        target += '&scope='.concat(scope)

        window.location.href = target
    }

    processUrlData() {
        let urlData = HttpUrlUtils.getUrlData()
        if (urlData.args.size == 0) {
            this.redirectToTongjiLoginSite()
            return
        }

        let code = urlData.args.get('code')
        let error = urlData.args.get('error')

        if (code === undefined) {
            message.error('登录失败。')
        }

        if (error !== undefined) {
            this.state.errorMsg = error
            this.setState({ errorMsg: error })
        }

        if (code !== undefined) {
            TJApi.instance().code2token(code).then(res => {

                this.state.backToLogin = true
                this.setState({ backToLogin: true })

            }).catch(err => {
                
                message.error('登录失败：'.concat(err))
            })
        }
    }

    override render(): React.ReactNode {

        if (this.state.errorMsg !== '') {
            return this.state.errorMsg
        }

        if (this.state.backToLogin) {
            return <Navigate to={'/login'} />
        }

        return 'please wait...' // todo    
    }
}
