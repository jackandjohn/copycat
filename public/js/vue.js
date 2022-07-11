import { client } from './game.js'

const { createApp } = Vue

createApp({
  mounted() {
    this.connect()
  },
  data() {
    return {
      icons: [
        '🐱',
        '😹',
        '😻',
        '🙀',
      ],
      id: null,
      isPlaying: false,
      isFail: false,
      next: null,
      message: "Copy the Cat",
      level: 1,
      guessCount: 0,
    }
  },
  methods: {
    connect() {
      client.eventMap.connection = (data) => {
        this.id = data.id
      }

      client.eventMap.next = (data) => {
        this.next = data.next
        this.guessCount = 0
        
        if(data.message) this.message = data.message
        if(data.level) this.level = data.level
      }

      client.eventMap.fail = (data) => {
        console.log(data)
        this.isPlaying = false
        this.isFail = true
        this.score = data.sequence.length
        this.finalSequence = data.sequence
        this.finalGuess = data.guess
      }

      client.connect()
    },
    start() {
      this.isPlaying = !this.isPlaying
      this.isFail = false
      this.level = 1
      this.message = "Copy the Cat"
      this.finalSequence = []
      client.socket.send('start')
      this.guessCount = 0
    },
    send(event) {
      const value = parseInt(event.target.value)
      client.socket.send(value)
      this.message = null
      this.guessCount++
    },
    getNext() {
      client.socket.send('next')
    }
  }
}).mount('#app')