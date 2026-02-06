package demdem.mood.db

import java.time.Instant
import scalasql.simple._
import scalasql.simple.PostgresDialect._
import java.util.UUID

object Schema {

  enum DbMoodLevel:
    case Good
    case Neutral
    case Bad

  object DbMoodLevel:
    given tm: TypeMapper[DbMoodLevel] = TypeMapper[String].bimap(
      x => x.toString(),
      str => DbMoodLevel.valueOf(str)
    )

  case class DbMoodUser(id: UUID)
  object DbMoodUser extends SimpleTable[DbMoodUser] {
    override def tableName = "users"
  }

  case class DbMoodRecord(id: UUID, userId: UUID, timestamp: Instant, moodLevel: DbMoodLevel)

  object DbMoodRecord extends SimpleTable[DbMoodRecord] {
    override def tableName = "moodRecords"
  }

}
