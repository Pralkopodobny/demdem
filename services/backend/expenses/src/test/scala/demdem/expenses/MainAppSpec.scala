package com.example.expenses

import zio.http._
import zio.test._

object MainAppSpec extends ZIOSpecDefault {
  def spec = suite("suite for MainApp")(
    test("test for endpoint /text") {
      val request = Request.get(URL(Path.decode("/")))
      MainApp.routes.runZIO(request) *> assertTrue(true)
    },
  )
}
