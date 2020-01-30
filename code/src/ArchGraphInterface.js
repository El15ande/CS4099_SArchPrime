export default class ArchGraphInterface {
    constructor(data) {
        this.jointInterface = {
            group: data.ipos,

            attrs: { text: { text: data.iname } }
        }

        this.itype = data.itype;
    };
}