/* eslint-disable new-cap */
import lws from 'local-web-server'
import { AfterAll, BeforeAll } from '@cucumber/cucumber'

let ws

BeforeAll(async () => {
  ws = await lws.create({ port: 8888 })
})

AfterAll(() => ws.server.close())
