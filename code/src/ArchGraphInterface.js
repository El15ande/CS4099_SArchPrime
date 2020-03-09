export default class ArchGraphInterface {
    constructor(data, intera) {
        this.jointPort = {
            group: data.ipos,

            attrs: { 
                text: { text: data.iname },
                '.custom-port': {
                    magnet: true,
                    d: this._getD(data.itype, data.ipos),
                    
                    stroke: intera ? '#9FA8DA' : '#000000',
                    strokeWidth: intera ? 2 : 1,
                    fill: intera ? '#9FA8DA' : '#ffffff'
                },
                
                iid: data.iid,
                itype: data.itype
            },

            markup: `<path class="custom-port"/>`
        }
    }

    _getD = function(itype, ipos) {
        let isInput = itype === 'Input';

        if(itype === 'Non-directional') {
            return (ipos === 'Top' || ipos === 'Bottom')
                ? 'M 0 -10 -10 0 0 10 10 0 Z'
                : 'M 0 0 -10 10 0 20 10 10 Z';
        }

        switch(ipos) {
            case 'Top': {
                return isInput 
                    ? 'M 0 -10 20 -10 10 10 Z'
                    : 'M 0 10 20 10 10 -10 Z';
            }
            case 'Bottom': {
                return isInput 
                    ? 'M 0 10 20 10 10 -10 Z'
                    : 'M 0 -10 20 -10 10 10 Z';
            }
            case 'Left': {
                return isInput
                    ? 'M -10 0 -10 20 10 10 Z'
                    : 'M 10 0 10 20 -10 10 Z';
            }
            case 'Right': {
                return isInput
                    ? 'M 10 0 10 20 -10 10 Z'
                    : 'M -10 0 -10 20 10 10 Z';
            }
            default: { return 'M 0 -10 20 -10 10 10 Z'; }
        }
    }
}