import zio.*
import endpoints.GetMoodRecordsEndpoint
import sttp.tapir.server.http4s.ztapir.ZHttp4sServerInterpreter
import sttp.tapir.ztapir.*
import org.http4s.blaze.server.BlazeServerBuilder
import zio.interop.catz.*
import org.http4s.server.Router
import org.http4s.HttpApp
import org.http4s.HttpRoutes
import sttp.tapir.server.ServerEndpoint
import sttp.tapir.swagger.bundle.SwaggerInterpreter
import sttp.shared.Identity
import org.http4s.server.middleware.CORS

object Main extends ZIOAppDefault {

  def logic = for {
    getMoodRecordsEndpoint <- ZIO.serviceWith[GetMoodRecordsEndpoint](_.endpoint)

    endpoints = List(
      getMoodRecordsEndpoint
    )

    swaggerEndpoints = SwaggerInterpreter().fromEndpoints[Task](
      List(getMoodRecordsEndpoint.endpoint),
      "Mood API",
      "1.0.0"
    )

    routes: HttpRoutes[Task] = ZHttp4sServerInterpreter()
      .from(
        endpoints ++ swaggerEndpoints
      )
      .toRoutes

    cors = CORS.policy.withAllowOriginAll.withAllowMethodsAll
      .withAllowCredentials(false)
      .apply(routes)

    _ <- ZIO.executor.flatMap(executor =>
      BlazeServerBuilder[Task]
        .withExecutionContext(executor.asExecutionContext)
        .bindHttp(8080, "0.0.0.0")
        .withHttpApp(Router("/" -> cors).orNotFound)
        .serve
        .compile
        .drain
    )
  } yield ()

  def run = logic.provide(
    GetMoodRecordsEndpoint.layer
  )
}
