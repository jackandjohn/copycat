## dev

    deno run --watch --allow-net --allow-env server.ts
  
## prod

    deno run --watch --allow-net=0.0.0.0:8080 --allow-env=WEBSOCKET_PORT server.ts