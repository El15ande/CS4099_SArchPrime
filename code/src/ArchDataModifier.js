import { AxiosRequest } from './main.js';

export default class ArchDataModifier {
    constructor(data) {
        this.data = data;
    }

    save() {
        let _this = this;

        AxiosRequest('POST', `arch/${_this.data.name}`, this.data, function(res) {
            console.log(res);
        });
    }
}