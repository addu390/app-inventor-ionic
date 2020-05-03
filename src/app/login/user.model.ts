export class User {
    constructor(public email: string, public userId: string, private _accessToken: string, private _expiresIn: Date) {

    }

    get token() {
        if (!this._expiresIn || new Date() > this._expiresIn) {
            return null;
        }
        return this._accessToken;
    }
}