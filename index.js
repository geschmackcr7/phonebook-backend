const express = require("express")
const morgan = require("morgan")
const app = express()

let data = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  console.log(`Get persons data`)
  response.json(data)
})

app.get('/info', (request, response) => {
  const date = new Date()
  const st = `Phonebook has info for ${data.length} people <br><br> ${date}`
  response.send(st)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = data.find(person => person.id === id)

  if (person) {
    response.json({
      "statusCode": 200,
      "data": person
    })
  } else {
    response.status(404).json({
      "statusCode": 404,
      "data": null
    })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data = data.filter(person => person.id !== id)

  console.log(`delete id: ${id}`)
  console.log(data)

  response.status(204).end()
})

const generateId = () => {
  const maxId = data.length > 0 ? Math.max(...data.map(n => n.id)) : 0
  return maxId + 1;
}

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)
// app.use(morgan)

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: "name missing"
    })
  }

  if (data.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  data = data.concat(person)

  console.log(data)

  response.json(data)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)