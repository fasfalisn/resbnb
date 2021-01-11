export class Reservation {
    constructor(
        public resid: number,
        public userid: number,
        public houseid: number,
        public paymentStatus: string,
        public status: string,
        public numguests: number,
        public bill: number,
        public date: Date,
        public Name: string
    ){}
}