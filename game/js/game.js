import Client from './client.js'

const url = 'ws://localhost:8080'
const game = {}
const client = new Client(url, game)

export default game
export { client}