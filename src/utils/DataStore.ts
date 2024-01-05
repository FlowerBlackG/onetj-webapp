/*
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import Cookies from "universal-cookie";



export default class DataStore {
    protected constructor() {}

    static cookies = new Cookies(null, { path: '/' })
    static DATA_STORE_KEY_PREFIX = '__dataStore_'

    static makeKey(key: string): string {
        return DataStore.DATA_STORE_KEY_PREFIX.concat(key)
    }

    static put(key: string, value: any) {
        this.cookies.set(this.makeKey(key), value)
    }

    static get(key: string): any | undefined {
        let raw = this.cookies.get(this.makeKey(key))

        if (raw === undefined) {
            return undefined
        }

        return raw
    }
}
