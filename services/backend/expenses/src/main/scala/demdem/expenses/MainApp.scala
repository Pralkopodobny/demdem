package com.example.expenses

import zio._
import zio.http._

object MainApp extends ZIOAppDefault {
  val routes = Routes(
    Method.GET / "health" -> handler(Response.text("Expenses service is alive!")),
    Method.GET / "hello"  -> handler(Response.text("Hello ZIO!")),
  )

  def run = Server
    .serve(routes)
    .provide(
      ZLayer.succeed(Server.Config.default.port(3137)),
      Server.live,
    )
}
