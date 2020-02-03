export default class ArchGraphInterface {
    constructor(data) {
        this.jointInterface = {
            group: data.ipos,

            attrs: { 
                text: { text: data.iname },
                '.custom-port': {
                    magnet: true,
                    d: this._getD(data.itype, data.ipos),
                    
                    stroke: '#000000',
                    fill: '#FFFFFF'
                }
            },

            markup: `<path class="custom-port"/>`
        }

        this.itype = data.itype;
    };

    _getD(itype, ipos) {
        let isInput = itype === 'Input';

        switch(ipos) {
            case 'Top': {
                return isInput 
                    ? 'M 0 -10 20 -10 10 10 Z'
                    : 'M 0 -10 20 -10 10 -10 Z';
            }
            case 'Bottom': {
                return isInput 
                    ? 'M 0 -10 20 -10 10 -10 Z'
                    : 'M 0 -10 20 -10 10 10 Z';
            }
            case 'Left': {
                return isInput
                    ? 'M -10 0 -10 20 10 10'
                    : 'M 10 0 10 20 -10 10';
            }
            case 'Right': {
                return isInput
                    ? 'M 10 0 10 20 -10 10'
                    : 'M -10 0 -10 20 10 10';
            }
            default: { return 'M 0 -10 20 -10 10 10 Z'; }
        }
    };
}