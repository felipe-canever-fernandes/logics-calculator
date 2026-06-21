export class InvalidResult extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidResult";
    }
}
