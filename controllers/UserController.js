class UserController {

    constructor (formId, tableId) {

        this.formEl = $("#" + formId),
        this.tableEl = $("#" + tableId)

        this.onSubmit()
    }

    onSubmit () {
        
        this.formEl.onsubmit = e => {

            e.preventDefault()

            const user = this.getUser()

            this.getPhoto((result) => {
                log(result)
                user.photo = result

                this.addLine(user)
                
            })

        }
        
    }

    getPhoto (callback) {

        const fileReader = new FileReader()

        const file = Array.from(this.formEl.elements).filter( item => item.name === "photo")[0].files[0]

        if(!file) return callback("./dist/img/avatar.png")

        fileReader.readAsDataURL(file)

        fileReader.onload = () => {

            callback(fileReader.result)

        }

    }

    getUser () {

        let user = {}

        Array.from(this.formEl.elements).forEach(field => { 
            
            if (field.name === "gender") {
                
                if(field.checked) user[field.name] = field.value
        
            } else if (field.name === "admin") user[field.name] = field.selected ? "Sim" : "Não"

            else user[field.name] = field.value
        
        });
    
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        )

    }

    addLine (dataUser) {
    
        const tr = document.createElement("tr")
        
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${dataUser.birth}</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `
    
        this.tableEl.appendChild(tr)
    }

}
