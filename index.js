const express = require('express')
const app = express()

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
        data: new Date(),
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
        data: new Date(),
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
        data: new Date(),
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

app.post('/measure/:id', function (req, res) {
    const usersFilter = users.filter(user => user.id == req.params.id)

    if (usersFilter.length < 1) {
        return res.status(400).send({
            message: 'Usuário não encontrado!'
         });
    }

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

    const measure = { id: measures.length + 1, date: req.body.date, measure: req.body.measure, note: req.body.note, userId: req.params.id }
    measures.push(measure)

    res.send({
        result: measure,
        message: "Cadastro feito com sucesso"
    })
})

app.get('/measure/:userId', function (req, res) {
    const measureIdFilter = measures.filter(measure => measure.userId == req.params.userId)

    if (measureIdFilter.length < 1) {
        return res.status(400).send({
            message: 'Dados não encontrados!'
         });
    }
    res.send({
        result: measures,
        message: "sucesso"
  })
})

app.put('/measure/edit/:id', function (req, res) {
    const measuresFilter = measures.filter(measure => measure.id == req.params.id)

    if (measuresFilter.length < 1) {
        return res.status(400).send({
            message: 'Medida não encontrada!'
         });
    }

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

    const newMeasure = { ...measuresFilter[0], ...req.body }
    const index = measures.findIndex(measure => measure.id == req.params.id)
    measures[index] = newMeasure

    res.send({
        result: newMeasure,
        message: "Editado com sucesso"
    })
})

app.delete('/measure/delete/:id', function (req, res) {
    const measuresFilter = measures.filter(measure => measure.id == req.params.id)

    if (measuresFilter.length < 1) {
        return res.status(400).send({
            message: 'Não foi possível excluir!'
         });
    }

    measures.splice(measuresFilter[0], 1);

    res.send({
        message: "Excluído com sucesso"
    })
})

app.listen(4000)