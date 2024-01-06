/*
 * 2051565 GTY
 * 创建于2024年1月6日 湖南省衡阳市（高铁线）
 */

export default class FluentUIEmojiProxy {
    protected constructor() {}

    static STORAGE_ROOT = 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji'

    static colorSvg(s: string): string {
        return this.STORAGE_ROOT.concat('/color-svg/target/')
            .concat(s)
            .concat('.svg')
    }
}
