package demdem.mood.db

import zio.*
import scalasql.simple._
import scalasql.simple.PostgresDialect._
import demdem.mood.db.Conversions.*
import demdem.mood.domain.MoodLevel
import java.time.Instant
import java.util.UUID
import demdem.mood.domain.MoodRecord
import demdem.mood.db.Schema.DbMoodRecord

case class Repository(dbClient: scalasql.DbClient) {
  import Repository.*

  def moodRecordsForAllUsers = ZIO.attempt {
    dbClient
      .transaction { tx =>
        tx.run(Schema.DbMoodRecord.select)
      }
      .map(_.toDomain)
  }

  def addMoodRecord(dbMoodRecord: DbMoodRecord): Task[Unit] = {
    ZIO.attempt {
      dbClient.transaction { tx =>
        tx.run(Schema.DbMoodRecord.insert.values(dbMoodRecord))
      }
    }.unit
  }
}

object Repository {

  def live = ZLayer.derive[Repository]
}
