export class Item {
    constructor(
        public itemid: number,
        public type: string,
        public description: string,
        public name: string,
        public price: number,
        public houseid: number
    ){}
}