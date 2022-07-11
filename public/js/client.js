export default class Client {
  eventMap = {
    "connection": (data) => {
      this.game.id = data.id
    }
  }

  constructor(url, game) {
    this.game = game
    this.url = url
  }

  connect() {
    const socket = new WebSocket(this.url)
    console.log(socket)
    socket.onopen = () => {
      // socket.send('hello world!')
    }

    socket.onmessage = (ws) => {
      const data = JSON.parse(ws.data)
      const event = data.event

      if(event in this.eventMap) {
          this.eventMap[event](data)
      } else {
          throw Error(`event ${event} not recognized`)
      }
    }

    this.socket = socket
  }
}