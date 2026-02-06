package demdem.mood.db

import org.flywaydb.core.Flyway
import zio.*
import javax.sql.DataSource

final case class Migration(dataSource: DataSource) {

  val migrate: Task[Unit] =
    for {
      flyway <- loadFlyway
      _ <- ZIO.attempt(flyway.migrate())
    } yield ()

  val reset: Task[Unit] =
    for {
      _ <- ZIO.log("RESETTING DATABASE!")
      flyway <- loadFlyway
      _ <- ZIO.attempt(flyway.clean())
      _ <- ZIO.attempt(flyway.migrate())
    } yield ()

  private lazy val loadFlyway: Task[Flyway] =
    ZIO.attempt {
      Flyway
        .configure()
        .dataSource(dataSource)
        .baselineOnMigrate(true)
        .baselineVersion("0")
        .cleanDisabled(false)
        .load()
    }

}

object Migration {
  val live = ZLayer.derive[Migration]
}
