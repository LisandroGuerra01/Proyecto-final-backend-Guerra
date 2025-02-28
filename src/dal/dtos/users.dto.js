export class UsersDTO {
    constructor(user) {
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this.age = user.age;
        this.role = user.role;
        this.status = user.status;
        this.cart = user.cart || null;
        this.orders = user.orders || [];
    }
}

export class UsersViewDTO {
    constructor(user) {
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
    }
}

export class UsersViewID {
    constructor(user) {
        this.id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.cart = user.cart;
    }
}