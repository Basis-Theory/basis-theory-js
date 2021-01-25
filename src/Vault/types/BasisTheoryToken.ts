export interface Token {
    token: string;
}

export class BasisTheoryToken implements Token {
    token: string = "";

    constructor(token: string) {
        this.token = token;
    }
}