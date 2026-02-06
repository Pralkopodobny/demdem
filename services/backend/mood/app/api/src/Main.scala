package demdem.mood.api

import zio.*
import demdem.mood.api.GetMoodRecordsEndpoint
import demdem.mood.db.Migration
import demdem.mood.db.Database
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
import demdem.mood.db.Repository

object Main extends ZIOAppDefault {

  def logic = for {
    getMoodRecordsEndpoint <- ZIO.serviceWith[GetMoodRecordsEndpoint](_.endpoint)
    postMoodRecordEndpoint <- ZIO.serviceWith[PostMoodRecordEndpoint](_.endpoint)

    endpoints = List(
      getMoodRecordsEndpoint,
      postMoodRecordEndpoint
    )

    swaggerEndpoints = SwaggerInterpreter().fromEndpoints[Task](
      endpoints.map(_.endpoint),
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

    _ <- Console.printLine("Starting server on http://localhost:8080")
    _ <- ZIO.serviceWithZIO[Migration](_.reset)
    _ <- ZIO.serviceWithZIO[Migration](_.migrate)
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

  def run = logic.debug.provide(
    GetMoodRecordsEndpoint.layer,
    PostMoodRecordEndpoint.layer,
    Repository.live,
    Migration.live,
    Database.postgresFromEnv,
    Database.dbClient
  )
}
