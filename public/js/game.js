import Client from './client.js'

const url = window.location.protocol === 'https:' ? `wss://${window.location.host}/ws` : 'ws://localhost:8080'
const game = {}
const client = new Client(url, game)

export default game
export { client}