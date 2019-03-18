class UserController {

    constructor (formId, tableId) {

        this.formEl = $("#" + formId),
        this.formUpdateEl = $("#form-user-update")
        this.tableEl = $("#" + tableId)


        this.onSubmit()
        this.updateStatistics()
        this.btnCancelForm()
    }  

    btnCancelForm () {
        
        $("#container-user-update").querySelector("#btn-cancel").onclick = () => this.showCreateForm()

    }

    onSubmit () {
        
        this.formEl.onsubmit = e => {

            e.preventDefault()

            let btnSubmit = this.formEl.querySelector("[type=submit]")

            btnSubmit.disabled = true

            const user = this.getUser()

            if(user) this.getPhoto().then(response => { 
                
                user.photo = response

                this.addLine(user)

                this.formEl.reset()
                
            }).catch(error => err(error)).finally(() => btnSubmit.disabled = false)
            
            else btnSubmit.disabled = false

        }
        
    }

    getPhoto () {

        return new Promise((resolve, reject) => {

            const fileReader = new FileReader()

            const file = [...this.formEl.elements].filter( item => item.name === "photo")[0].files[0]

            if(!file) resolve("./dist/img/avatar.png")

            fileReader.readAsDataURL(file)

            fileReader.onload = () => resolve(fileReader.result)

            fileReader.onerror = (error) => reject(error)

        })
        
    }

    getUser () {
        let user = {}
        let isValid = true

        Array.from(this.formEl.elements).forEach(field => { 

            if(['password', 'email', 'name'].indexOf(field.name) > -1 && !field.value) {
                
                field.parentElement.classList.add("has-error")
                
                isValid = false

            } else field.parentElement.classList.remove("has-error")
            
            if (field.name === "gender") {
                
                if(field.checked) user[field.name] = field.value
        
            } else if (field.name === "admin") user[field.name] = field.checked

            else user[field.name] = field.value
        
        });

        if(!isValid) return false
    
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

        tr.dataset.userLevel = JSON.stringify(dataUser)
        
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin ? "Sim" : "Não"}</td>
            <td>${Utils.formatData(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat" id="btn-edit">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat" id="btn-delete">Excluir</button>
            </td>
        `

        tr.querySelector("#btn-edit").onclick = () => {

            let user = JSON.parse(tr.dataset.userLevel)
            
            for (let name in user) {

                let field = this.formUpdateEl.querySelector(`[name=${name.replace("_", "")}]`)

                if(field) {
                    switch (field.type) {
                        case 'file':
                            continue
                        
                        case 'radio':   
                            field = this.formUpdateEl.querySelector(`[name=${name.replace("_", "")}][value=${user[name]}]`)
                            field.checked = true
                            break

                        case 'checkbox':
                            field.checked = user[name]
                            break

                        default:
                            field.value = user[name]
                        
                    }
                }
            }

            this.showUpdateForm(tr.dataset.userLevel)
        }

        tr.querySelector("#btn-delete").onclick = e => {
            tr.remove()
        }
    
        this.tableEl.appendChild(tr)

        this.updateStatistics()
    }

    showUpdateForm (user) {

        $("#container-user-create").style.display = "none"
        $("#container-user-update").style.display = "block"

    }

    showCreateForm () {

        $("#container-user-create").style.display = "block"
        $("#container-user-update").style.display = "none"

    }

    updateStatistics () {

        let users = 0
        let admins = 0

        Array.from(this.tableEl.children).forEach( tr => {

            users++

            if(JSON.parse(tr.dataset.userLevel)._admin) admins++

        })

        $("#statistics_user h3").innerHTML = users

        $("#statistics_admin h3").innerHTML = admins

    }

}
