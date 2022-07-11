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
      message: null,
      score: 0,
    }
  },
  methods: {
    connect() {
      client.eventMap.connection = (data) => {
        this.id = data.id
      }

      client.eventMap.next = (data) => {
        console.log(data)
        this.next = data.next
        this.message = data.message
        this.score = data.score
      }

      client.eventMap.fail = (data) => {
        console.log(data)
        this.isPlaying = false
        this.isFail = true
        this.score = data.sequence.length - 1
        this.finalSequence = data.sequence
        this.finalGuess = data.guess
      }

      client.connect()
    },
    start() {
      this.isPlaying = !this.isPlaying
      this.isFail = false
      this.score = 0
      this.finalSequence = []
      client.socket.send('start')
    },
    send(event) {
      const value = parseInt(event.target.value)
      client.socket.send(value)
      this.message = null
    },
    getNext() {
      client.socket.send('next')
    }
  }
}).mount('#app')