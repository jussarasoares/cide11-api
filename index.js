const express = require('express')
const cors = require('cors');
const config = require('./config')
const db = require('./services/db')
const measuresServices = require('./services/measures');
const { formatDateToSql } = require('./services/utils');
const { createUser, getUserLogin } = require('./services/users');

db.connectionDb(config.db)

const app = express()
app.use(cors());

const users = [
    {
        id: 1,
        name: "jussara",
        email: "email@email.com"
    },
    {
        id: 2,
        name: "teste",
        email: "email@email.com"
    },
    {
        id: 3,
        name: "bla",
        email: "email@email.com"
    }
]

app.use(express.json())

app.post('/register', async function (req, res) {
    const errors = []
    if (!req.body.name) {
        errors.push({name: "O nome é um item obrigatório"})
    }
    if (!req.body.email) {
        errors.push({email: "O email é um item obrigatório"})
    }
    if (!req.body.password) {
        errors.push({password: "A senha é um item obrigatório"})
    }
    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors,
            message: 'Preencha todos os campos'
        })
    }

    const user = req.body
    const data = await createUser(user)

    res.send({
        result: {
            id: data.insertId,
            name: user.name,
            email: user.email
        },
        message: "Usuário criado com sucesso"
    })
})

app.post('/login', async function (req, res) {
    try {
        const errors = []
        if (!req.body.email) {
            errors.push({ email: "O email é um item obrigatório" })
        }
        if (!req.body.password) {
            errors.push({ password: "A senha é um item obrigatório" })
        }
        if (errors.length > 0) {
            return res.status(400).send({
                errors: errors,
                message: 'Preencha todos os campos'
            })
        }

        const user = req.body
        const { data } = await getUserLogin(user.email, user.password)
        console.log(data)

        res.send({
            result: {
                id: data[0].id,
                name: data[0].name,
                email: data[0].email
            },
            message: "Login efetuado com sucesso"
        })
    } catch (err) {
        console.log(err)
        return res.status(400).send({
            message: 'Falha ao efetuar login!'
        });
    }
})

app.get('/user/:id', function (req, res) {
    const usersFilter = users.filter(user => user.id == req.params.id)
    
    if (usersFilter.length < 1) {
        return res.status(400).send({
            message: 'Usuário não encontrado!'
         });
    }
    res.send({
        result: usersFilter[0],
        message: "sucesso"
  })
})

app.post('/measure/:id', async function (req, res) {
    try {
        const errors = []
        if (!req.body.date) {
            errors.push({date: "A data é um item obrigatório"})
        }
        if (errors.length > 0) {
            return res.status(400).send({
                errors: errors,
                message: 'Preencha os campos obrigatórios'
            })
        }

        const measure = {
            date: formatDateToSql(req.body.date),
            fast: req.body.fast || 0,
            coffee: req.body.coffee || 0,
            lunch: req.body.lunch || 0,
            dinner: req.body.dinner || 0,
            note: req.body.note || "",
            userId: req.params.id
        }
        await measuresServices.createMeasure(measure)
        res.send({
            message: "Cadastro feito com sucesso"
        })
    } catch (err) {
        return res.status(400).send({
            message: 'Falha na consulta de dados!'
        });
    }
})

app.get('/user-measure/:userId', async function (req, res) {
    try {
        const { data } = await measuresServices.getUserMeasures({ userId: req.params.userId })

        if (data.length === 0) {
            return res.status(400).send({
                message: 'Dados do usuário não encontrados!'
            });
        }
        res.send({
            result: data,
            message: "sucesso"
        })
    } catch (err) {
        return res.status(400).send({
            message: 'Falha na consulta de dados!'
        });
    }
})

app.get('/measure/:id', async function (req, res) {
    try {
        const { data } = await measuresServices.getMeasureById(req.params.id)
        
        if (data.length === 0) {
            return res.status(400).send({
                message: 'Medida não encontrada!'
            });
        }
        res.send({
            result: data[0],
            message: "sucesso"
        })
    } catch (err) {
        return res.status(400).send({
            message: 'Falha na consulta de dados!'
        });
    }
})

app.put('/measure/edit/:id', async function (req, res) {
    try {
        const { data } = await measuresServices.getMeasureById(req.params.id)
            
        if (data.length === 0) {
            return res.status(400).send({
                message: 'Medida não encontrada!'
            });
        }

        const errors = []
        if (!req.body.date) {
            errors.push({ date: "A data é um item obrigatório" })
        }
        if (errors.length > 0) {
            return res.status(400).send({
                errors: errors,
                message: 'Preencha os campos obrigatórios'
            })
        }

        const measure = {
            ...data[0],
            date: formatDateToSql(req.body.date),
            fast: req.body.fast || 0,
            coffee: req.body.coffee || 0,
            lunch: req.body.lunch || 0,
            dinner: req.body.dinner || 0,
            note: req.body.note || "",
            userId: req.body.userId
        }
        await measuresServices.updateMeasure(req.params.id, measure)

        res.send({
            message: "Editado com sucesso"
        })
    } catch (err) {
        return res.status(400).send({
            message: 'Falha na consulta de dados!'
        });
    }
})

app.delete('/measure/:id', async function (req, res) {
    try {
        const { data } = await measuresServices.getMeasureById(req.params.id)

        if (data.length === 0) {
            return res.status(400).send({
                message: 'Não foi possível excluir!'
            });
        }

        await measuresServices.deleteMeasure(req.params.id)

        res.send({
            message: "Excluído com sucesso"
        })
    } catch (err) {
        return res.status(400).send({
            message: 'Falha na consulta de dados!'
        });
    }
})

app.listen(4000)