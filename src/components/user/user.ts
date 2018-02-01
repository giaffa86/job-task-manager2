export interface IUser {
    uid: string;
    name: string;
    surname: string;
    roles: string;
    email: string;
    pushToken: string;
}

export class User {


    constructor(public initData: IUser) {
    }

    get data(): IUser { return this.initData; }
    get uid(): string { return this.initData.uid; }
    get name(): string { return this.initData.name; }
    get surname(): string { return this.initData.surname; }
    get roles(): string { return this.initData.roles; }
    get email(): string { return this.initData.email; }
    get pushToken(): string { return this.initData.pushToken; }
    set pushToken(pushToken: string) { this.initData.pushToken = pushToken; }

    get fullname(): string {
        let fullname = "";
        if (this.name != null && this.surname != null) {
            fullname = this.name + ' ' + this.surname;
        }
        else if (this.name != null) {
            fullname = this.name;
        }
        else if (this.surname != null) {
            fullname = this.surname;
        }
        else {
            fullname = this.email;
        }

        return fullname;
    }
}