interface OptionObject {
    [key: string]: null | false | true | string;
}
declare class Rem2px {
    config: any;
    constructor(options: OptionObject);
    getCalcValue(type: string, value: string): string;
    generateRem(cssText: string): string;
}
export default Rem2px;
