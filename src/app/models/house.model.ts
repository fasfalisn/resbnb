export class House {
    constructor(
        public houseid: number,
        public description: string,
        public name: string,
        public type: string,
        public street: string,
        public zip: number,
        public city: string,
        public hostid: number
    ){}
}