import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

type Game = {
  sequence: number[]
  guess: number[]
  lastAnsweredAt?: Date
}

const games: Record<string, Game> = {}

const port = parseInt(Deno.env.get('WEBSOCKET_PORT') || '8080')
const wss = new WebSocketServer(port);
wss.on("connection", function (ws: WebSocketClient) {
  const id = crypto.randomUUID()
  games[id] = { sequence: [], guess: [] }
  ws.send(JSON.stringify({ event: "connection", id }));

  ws.on("message", function (message: string|number) {
    const next = Math.floor(Math.random()*4)

    if(message === 'start') {
      games[id].sequence.push(next)
      ws.send(JSON.stringify({ event: "next", next}))
    } else if(message === 'next') {
      const next = games[id].sequence[games[id].sequence.length-1]
      ws.send(JSON.stringify({ event: "next", next}))
    } else {
      const guess = parseInt(message as string)
      if(isNaN(guess)) {
        ws.send(JSON.stringify({event: 'error', detail: `\`${guess}\` is not a valid guess`}))
        return
      }
      
      games[id].guess.push(guess)

      const compare = games[id].sequence.slice(0, games[id].guess.length)
      if(JSON.stringify(games[id].guess) !== JSON.stringify(compare)) {
        ws.send(JSON.stringify({event: "fail", sequence: games[id].sequence, guess: games[id].guess}))
        games[id].sequence = []
        games[id].guess = []
        return
      }

      if(compare.length === games[id].sequence.length) {
        games[id].sequence.push(next)
        games[id].guess = []
        ws.send(JSON.stringify({ event: "next", next, message: 'correct!', score: games[id].sequence.length - 1}))
      }
    }
  });

  ws.on("error", function (message: string) {
    console.error(message);
  });
});