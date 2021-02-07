const info = (...params) => {
    console.log(...params)
}

const run = (port) => {
    console.log(`Server running on port ${port}`)
}

const req = (request) => {
    console.log(`Recieved ${request.method} request at ${request.path}`)
}

const error = (msg, error) => {
    console.error(`${error.name}: ${msg}\n`, `reason: ${error.message}`)
}

module.exports = {
    info,
    run, 
    req,
    error
}