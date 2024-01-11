/*
 * 同济开放平台接口封装。
 *
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import React, { useState } from "react";
import { later } from "../../utils/later";
import { globalData } from "../../common/GlobalData";
import { loadPageToLayoutFrame } from "../../components/LayoutFrame/LayoutFrame";
import HttpUrlUtils from "../../utils/HttpUrlUtils";
import { Navigate, useSearchParams } from "react-router-dom";
import TJApi from "../../utils/TJApi";
import { message } from "antd";
import PageRouteManager from "../../common/PageRoutes";
import { useConstructor } from "../../utils/react-functional-helpers";


interface TongjiOAuthPageState {
    errorMsg: string
    backToLogin: boolean
}

export default function TongjiOAuthPage() {
    const pageEntity = PageRouteManager.getRouteEntity('tongji-oauth')

    const [state, setState] = useState<TongjiOAuthPageState>({
        errorMsg: '',
        backToLogin: false
    })

    function constructor() {
   
        loadPageToLayoutFrame(pageEntity)
        processUrlData()
    }

    useConstructor(constructor)

    function redirectToTongjiLoginSite() {
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

    function processUrlData() {
        let urlData = HttpUrlUtils.getUrlData()

        if (urlData.args.size == 0) {
            redirectToTongjiLoginSite()
            return
        }

        let code = urlData.args.get('code')
        let error = urlData.args.get('error')

        if (code === undefined) {
            message.error('登录失败。')
        }

        if (error !== undefined) {
            state.errorMsg = error
            setState({...state})
        }

        if (code !== undefined) {
            TJApi.instance().code2token(code).then(res => {

                // 删掉 url 里的查询参数。
                let urlObj = new URL(window.document.location.href)
                let newHref = urlObj.href.replace(urlObj.search, '')
                window.history.replaceState('', '', newHref)

                state.backToLogin = true
                setState({ ...state })

            }).catch(err => {
                
                message.error('登录失败：'.concat(err))
            })
        }
    }

    /* render */

    if (state.errorMsg !== '') {
        return state.errorMsg
    }

    if (state.backToLogin) {
        return <Navigate to={'/login'} />
    }

    return 'please wait...' // todo    
    
}
