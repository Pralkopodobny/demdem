package demdem.mood.db

import zio.*
import java.util.Properties
import com.zaxxer.hikari.{HikariConfig, HikariDataSource}

object Database {

  val dbClient = ZLayer {
    import scalasql._, PostgresDialect._
    for {
      ds <- ZIO.service[HikariDataSource]
      client = new scalasql.DbClient.DataSource(
        ds,
        config = new scalasql.Config {
          override def nameMapper(v: String) = v
          override def logSql(sql: String, file: String, line: Int) = println(s"$file:$line $sql")
        }
      )
    } yield client
  }

  val postgresFromEnv = for {
    props <- ZLayer.fromZIO(for {
      db_user <- System.env("DB_USER").someOrElse("postgres")
      db_password <- System.env("DB_PASSWORD").someOrElse("postgres")
      db_host <- System.env("DB_HOST").someOrElse("localhost")
      db_port <- System.env("DB_PORT").someOrElse("54322")
    } yield {
      val props = new Properties()
      props.setProperty("dataSourceClassName", "org.postgresql.ds.PGSimpleDataSource")
      props.setProperty("dataSource.user", db_user)
      props.setProperty("dataSource.password", db_password)
      props.setProperty(s"dataSource.serverName", db_host)
      props.setProperty(s"dataSource.portNumber", db_port)
      HikariDataSource(HikariConfig(props))
    })
  } yield props
}
