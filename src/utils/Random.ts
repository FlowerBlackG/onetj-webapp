/*
 * 2051565 GTY
 * 创建于2024年1月7日 广东省珠海市
 */

export default class Random {
    protected constructor() {}

    static randInt(min: number, max: number) {
        let rand = Math.random()
        return Math.floor(rand * (max - min + 1)) + min
    }

    static randElement<T>(list: T[]): T {
        let idx = this.randInt(0, list.length - 1)
        return list[idx]
    }
}
