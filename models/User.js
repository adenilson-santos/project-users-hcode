class User {

    constructor (name, gender, birth, country, email, password, photo, admin) {

        this._name       = name,
        this._gender     = gender,
        this._birth      = birth,
        this._country    = country,
        this._email      = email,
        this._password   = password,
        this._photo      = photo,
        this._admin      = admin
        this._register   = new Date()

    }

    static save (users) {

        if(users && users.length >= 0) {
            
            localStorage.setItem(
                "users", 
                JSON.stringify(users)
            )

        } else {

            localStorage.setItem(
                "users", 
                JSON.stringify([...this.getAll(), users])
            )

        } 

    }

    static delete (user) {
        
        let users = this.getAll()

        users = users.filter(item => item._email != user._email)

        this.save(users)

    }

    static update (user) {

        let users = this.getAll()

        users = users.map(item => {

            if(item._email == user._email) {
                return item = user
            } else {
                return item
            }

        })

        log(users)

        this.save(users)

    }

    static getAll () {
        
        return JSON.parse(localStorage.getItem("users")) || []

    }

    get name () {

        return this._name    

    }

    get gender () {

        return this._gender  

    }

    get birth () {

        return this._birth   

    }

    get country () {

        return this._country 

    }

    get email () {

        return this._email   

    }

    get password () {

        return this._password

    }

    get admin () {

        return this._admin   

    }

    get register () {

        return this._register

    }

    get photo () {

        return this._photo   

    }

    set photo (value) {

        this._photo = value

    }

}