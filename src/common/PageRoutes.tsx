/* 上财果团团 */

import { ReactNode } from "react"
import LayoutFrame from "../components/LayoutFrame/LayoutFrame"
import { globalData } from "./GlobalData"
import IndexPage from "../pages/index/Index"
import { FreeKeyObject } from "../utils/FreeKeyObject"
import AboutPage from "../pages/about/About"
import TongjiOAuthPage from "../pages/tongji-oauth/TongjiOAuth"
import LoginPage from "../pages/login/Login"
import HomePage from "../pages/home/Home"


/**
 * 页面路由分类结构。
 */
export interface PageRouteCategory {
    key: string
    label: string
    title?: string
}

/**
 * 页面路由结构。
 */
export interface PageRouteData {

    /**
     * 页面路径，同时作为页面识别标记。需要不同。
     */
    path: string

    /**
     * 在侧边栏中展示的名称。
     */
    name: string

    icon?: string

    /**
     * 在页面标题上展示的名称。默认与 name 一致。
     */
    title?: string
    element: ReactNode

    inFrame?: boolean

    category?: string

    permissionCheckPassed?: () => boolean
}



/**
 * 页面路由表。
 * path: 页面路由。每个页面进入后，需要根据页面路由取到指向自己信息的实体结构。
 *       因此，修改 path 后，必须前往对应页面类修改相应代码。
 */
export const pageRoutes: Array<PageRouteData> = [

    /*{
        path: 'login',
        name: '登录',
        icon: '',
        element: <LoginPage />,
        inFrame: false,
        showInSidebar: false
    },
    
    {
        path: '',
        name: '首页',
        icon: 'https://guotuantuan.oss-cn-shanghai.aliyuncs.com/web-common-assets/fluent-emoji/seedling_color.svg',
        element: <RootPage />,
        inFrame: true,
    },

    {
        path: 'myPermissionList',
        name: '我的权限',
        icon: 'https://guotuantuan.oss-cn-shanghai.aliyuncs.com/web-common-assets/fluent-emoji/zipper-mouth_face_color.svg',
        element: <MyPermissionListPage />,
        category: categoryKeys.bUsers
    },*/
    
    {
        path: '',
        name: 'index',
        icon: '',
        element: <IndexPage />
        
    },

    {
        path: 'about',
        name: '关于',
        icon: '',
        element: <AboutPage />
    },

    {
        path: 'tongji-oauth',
        name: '开放平台登录',
        element: <TongjiOAuthPage />
    },

    {
        path: 'login',
        name: '登录',
        inFrame: false,
        element: <LoginPage />
    },

    {
        path: 'home',
        name: '主页',
        inFrame: false,
        element: <HomePage />
    }
    
    
]

export const pageRouteEntityMap: FreeKeyObject = {}

function isNullOrUndefined(e: any): boolean {
    return e === null || e === undefined
}

function preprocessRouteData(route: PageRouteData) {
    if (isNullOrUndefined(route.title)) {
        route.title = route.name
    }

    if (isNullOrUndefined(route.inFrame)) {
        route.inFrame = true
    }

    if (route.inFrame) {
        route.element = <LayoutFrame ref={ globalData.layoutFrameRef }>
            { route.element }
        </LayoutFrame>
    }

    if (isNullOrUndefined(route.permissionCheckPassed)) {
        route.permissionCheckPassed = () => { return true }
    }

    if (isNullOrUndefined(route.icon)) {
        route.icon = ''
    }

    pageRouteEntityMap[route.path] = route
}


function preprocess() {
    pageRoutes.forEach((route) => {
        preprocessRouteData(route)
    })
}

preprocess()
