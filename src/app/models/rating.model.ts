export class Rating {
    constructor(
        public userid: number,
        public houseid: number,
        public description: string,
        public rating: number,
        public date: Date
    ){}
}