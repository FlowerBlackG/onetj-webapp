/*
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import Cookies from "universal-cookie";


/**
 * 基于 cookies 的简单 key - value 存储器。
 * 可以用于存储简单数据。
 * 
 * 本设施会自动在 cookie 名之前加入前缀。该过程对使用者透明。
 */
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

    static remove(key: string) {
        this.cookies.remove(this.makeKey(key))
    }
}
