/*
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import React from "react"
import { pageRouteEntityMap } from "../../common/PageRoutes"
import { Navigate } from "react-router-dom"


type IndexPageState = {

}

export default class IndexPage extends React.Component<any, IndexPageState> {

    pageEntity = pageRouteEntityMap['']

    constructor(props: any) {
        super(props)
    }

    override render(): React.ReactNode {
        return <Navigate to={'/login'} />
    }

}
