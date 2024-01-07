/*
 * 2051565 GTY
 * 创建于2024年1月7日 广东省珠海市
 */

import { useState } from "react";


export const useConstructor = (callback = () => {}) => {
    const [hasBeenCalled, setHasBeenCalled] = useState(false)
    if (hasBeenCalled) {
        return
    }

    callback()

    setHasBeenCalled(true)
}
