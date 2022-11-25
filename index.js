const express = require('express')
const cors = require('cors');
const config = require('./config')
const db = require('./services/db')
const measuresServices = require('./services/measures')

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

const measures = [
    {
        id: 10,
        date: new Date(),
        measure: {
            fast: 100,
            coffee: 100,
            lunch: 100,
            dinner: 100
        },
        note: "refrigerante",
        userId: 1
    },
    {
        id: 20,
        date: new Date(),
        measure: {
            fast: 100,
            coffee: 100,
            lunch: 100,
            dinner: 100
        },
        note: "refrigerante",
        userId: 1
    },
    {
        id: 30,
        date: new Date(),
        measure: {
            fast: 100,
            coffee: 100,
            lunch: 100,
            dinner: 100
        },
        note: "refrigerante",
        userId: 1
    },
]

app.use(express.json())

app.post('/user', function (req, res) {
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

    const user = { id: users.length+1, name: req.body.name, email: req.body.email }
    users.push(user)

    res.send({
        result: user,
        message: "Usuário criado com sucesso"
    })
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
        if (!req.body.measure || (req.body.measure && Object.keys(req.body.measure).length < 1)) {
            errors.push({measure: "Você precisa ter pelo menos uma medida"})
        }
        if (errors.length > 0) {
            return res.status(400).send({
                errors: errors,
                message: 'Preencha os campos obrigatórios'
            })
        }

        const measure = {
            date: req.body.date,
            fast: req.body.measure.fast || 0,
            coffee: req.body.measure.coffee || 0,
            lunch: req.body.measure.lunch || 0,
            dinner: req.body.measure.dinner || 0,
            note: req.body.note || "",
            userId: req.params.id
        }
        const { data } = await measuresServices.createMeasure(measure)

        res.send({
            result: data,
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
        if (!req.body.measure || (req.body.measure && Object.keys(req.body.measure).length < 1)) {
            errors.push({ measure: "Você precisa ter pelo menos uma medida" })
        }
        if (errors.length > 0) {
            return res.status(400).send({
                errors: errors,
                message: 'Preencha os campos obrigatórios'
            })
        }

        const measure = {
            ...data[0],
            date: req.body.date,
            fast: req.body.measure.fast || 0,
            coffee: req.body.measure.coffee || 0,
            lunch: req.body.measure.lunch || 0,
            dinner: req.body.measure.dinner || 0,
            note: req.body.note || "",
            userId: req.params.id
        }
        const result = await measuresServices.updateMeasure(req.params.id, measure)

        res.send({
            result: result.data,
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