class UserController {

    constructor (formId, formUpdateId, tableId) {

        this.formEl = $("#" + formId),
        this.formUpdateEl = $("#" + formUpdateId)
        this.tableEl = $("#" + tableId)


        this.onSubmit()
        this.updateStatistics()
        this.updateLines()
    }  

    onEdit (tr) {
        const defaultPhoto = JSON.parse(tr.dataset.userLevel)._photo

        this.formUpdateEl.onsubmit = e => {

            e.preventDefault()

            let btnSubmit = this.formUpdateEl.querySelector("[type=submit]")

            btnSubmit.disabled = true

            const user = this.getUser(this.formUpdateEl)

            if(user) this.getPhoto(this.formUpdateEl, defaultPhoto).then(response => { 
                
                user.photo = response
                
                tr.dataset.userLevel = JSON.stringify(user)
        
                User.update(user)

                this.updateLines()

                this.formUpdateEl.reset()
                
            }).catch(error => err(error)).finally(() => btnSubmit.disabled = false)
            
            else btnSubmit.disabled = false

        }

    }

    onSubmit () {
        
        this.formEl.onsubmit = e => {

            e.preventDefault()

            let btnSubmit = this.formEl.querySelector("[type=submit]")

            btnSubmit.disabled = true

            const user = this.getUser(this.formEl)

            if(user) this.getPhoto(this.formEl, ).then(response => { 
                
                user.photo = response

                this.addLine(null, user)

                User.save(user)

                this.formEl.reset()
                
            }).catch(error => err(error)).finally(() => btnSubmit.disabled = false)
            
            else btnSubmit.disabled = false

        }
        
    }

    getPhoto (formEl, defaultPhoto = "./dist/img/avatar.png") {

        return new Promise((resolve, reject) => {

            const fileReader = new FileReader()

            const file = [...formEl.elements].filter( item => item.name === "photo")[0].files[0]

            if(!file) resolve(defaultPhoto)

            fileReader.readAsDataURL(file)

            fileReader.onload = () => resolve(fileReader.result)

            fileReader.onerror = (error) => reject(error)

        })
        
    }

    getUser (form) {
        let user = {}
        let isValid = true

        Array.from(form.elements).forEach(field => { 

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

    templateTable (tr, dataUser) {

            if(!tr) {

                tr = document.createElement("tr")

                tr.dataset.userLevel = JSON.stringify(dataUser)
                
            }

            tr.innerHTML = `
                <td><img src="${dataUser.photo || dataUser._photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name || dataUser._name}</td>
                <td>${dataUser.email || dataUser._email}</td>
                <td>${dataUser.admin || dataUser._admin ? "Sim" : "Não"}</td>
                <td>${Utils.formatData(new Date(dataUser.register || dataUser._register))}</td>
                <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat" id="btn-edit">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat" id="btn-delete">Excluir</button>
                </td>
            `

            let user = JSON.parse(tr.dataset.userLevel)

            tr.querySelector("#btn-edit").onclick = () => {
                
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

                this.onEdit(tr)

                this.showUpdateForm(tr.dataset.userLevel)

            }

            tr.querySelector("#btn-delete").onclick = e => {
                User.delete(user)
                this.updateLines()
            }

            this.tableEl.appendChild(tr)
            

    }

    updateLines () {

        const users = User.getAll()

        this.tableEl.innerHTML = ""

        if(users.length < 1) return 
            
        users.forEach(dataUser => {   

            this.templateTable(null, dataUser)
            
        })

        this.updateStatistics()

    }

    addLine (tr, dataUser) {

        this.templateTable(tr, dataUser)

        this.updateStatistics()

    }

    showUpdateForm (user) {

        $("#container-user-create").style.display = "none"
        $("#container-user-update").style.display = "block"

        $("#container-user-update #btn-cancel").onclick = () => this.showCreateForm()

    }

    showCreateForm () {

        $("#container-user-create").style.display = "block"
        $("#container-user-update").style.display = "none"

        $("#container-user-update #btn-cancel").removeEventListener("click", () => this.showCreateForm())

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
