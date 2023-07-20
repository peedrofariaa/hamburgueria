const express = require('express')
const uuid = require('uuid')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

const orders = []
const checkUserId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(clientId => clientId.id === id)
    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.userIndex = index
    request.userId = id
    next()
}

const methodUrl = (request, response, next) => {
    const method = request.method
    const url = request.path
    console.log(`Method: ${method} URL: ${url}`)
    next()
}

app.get('/orders', methodUrl, (request, response) => {
    return response.json(orders)
})

app.post('/orders', methodUrl, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"
    const orderClient = { id: uuid.v4(), order, clientName, price, status}

    orders.push(orderClient)
    return response.status(201).json(orderClient)
})

app.put('/orders/:id', checkUserId, methodUrl, (request, response) => {
    const { order, clientName, price, status } = request.body
    const id = request.userId
    const updateOrder = { id, order, clientName, price, status}
    const index = request.userIndex

    orders[index] = updateOrder
    return response.json(updateOrder)
})

app.delete('/orders/:id', checkUserId, methodUrl, (request, response) => {
    const index = request.userIndex

    orders.splice(index, 1)
    return response.status(204).json()
})

app.get('/orders/:id', checkUserId, methodUrl, (request, response) =>{
    const index = request.userIndex
    const order = orders[index]

    return response.json(order)
})

app.patch('/orders/:id', checkUserId, methodUrl, (request, response) =>{
    const index = request.userIndex
    const {id, order, clientName, price} = orders[index]
    let status = orders[index].status
    status = "Pedido pronto"
    const finishedOrder = {id, order, clientName, price, status}
    orders[index] = finishedOrder

    return response.json(finishedOrder)
})

app.listen(3001, () => {
    console.log('🍔 Server started on port 3001')
})