import sbt._

object Dependencies {

  val zioVersion = "2.1.26"
  val zioHttpVersion = "3.11.2"

  val zioHttp     = "dev.zio" %% "zio-http"     % zioHttpVersion

  val zioTest     = "dev.zio" %% "zio-test"     % zioVersion % Test
  val zioTestSBT = "dev.zio" %% "zio-test-sbt" % zioVersion % Test
  val zioTestMagnolia = "dev.zio" %% "zio-test-magnolia" % zioVersion % Test  
}
