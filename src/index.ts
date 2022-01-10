import { getOptions } from 'loader-utils'
import Rem2px from './rem2px'

export default function (this: any, source: any) {
    const options = getOptions(this)
    const rem2px = new Rem2px(options)
    return rem2px.generateRem(source)
}



