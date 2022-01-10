import css from 'css'
import extend from 'extend'

interface OptionObject {
    [key: string]: null | false | true | string;
}

const defaultConfig = {
    transFormType: 'px',
    sdw: 1920,
    ddw: 1920,
    srfs: 100,
    drfs: 100,
    forbidComment: 'no',
    precision: 4,
    remLimit: 0
}

const remRegExp = /\b(\d+(\.\d+)?)rem\b/

class Rem2px {

    config: any

    constructor(options : OptionObject) {
        this.config = {}
        extend(this.config, defaultConfig, options)
    }

    getCalcValue(type: string, value: string): string {
        const { srfs, drfs, ddw, sdw, precision } = this.config
        const remGlobalRegExp = new RegExp(remRegExp.source, 'g')
        const generateValue = (val: number): string => {
            const _val = parseFloat(Number(val).toFixed(precision))
            return Number(_val) === 0 ? String(_val): _val + type
        }
        return value.replace(remGlobalRegExp, (m, p1) => {
            if (type === 'px') {
                return generateValue(Number(p1) * srfs * (ddw / sdw))
            } else {
                if(Number(p1) <= this.config.remLimit) {
                    return Number(p1) === 0 ? '0' : (`${p1}px`)
                } else {
                    return generateValue(Number(p1) * srfs * ( sdw / ddw ) / drfs)
                }
            }
        })
    }

    generateRem(cssText: string): string {
        const astObj = css.parse(cssText)
        const rules = astObj.stylesheet?.rules || []
        const processRules = (rules: Array<any>): string => {
            for (let i = 0; rules.length < i; i++) {
                const rule = rules[i]
                if (rule.type === 'media') {
                    processRules(rule.rules)
                } else if (rule.type === 'keyframes') {
                    processRules(rule.keyframes)
                }
                const declarations = rule.declarations
                for (let j = 0; j < declarations.length; j++) {
                    const declaration = declarations[j]
                    if (declaration.type === 'declaration' && remRegExp.test(declaration.value)) {
                        const nextDeclaration = rule.declaration[j + 1]
                        if (nextDeclaration && nextDeclaration.type === 'comment') {
                            if (nextDeclaration.comment.trim() === this.config?.forbidComment) {
                                declarations.splice(j + 1, 1)
                            }
                        }
                    }
                    declaration.value = this.getCalcValue(this.config.transFormType, declaration.value)
                }
            }
            return ''
        }
        processRules(rules)
        return css.stringify(astObj)
    }
}

export default Rem2px
