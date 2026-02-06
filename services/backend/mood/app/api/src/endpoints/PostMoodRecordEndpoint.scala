package demdem.mood.api

import sttp.tapir.ztapir.*
import sttp.tapir.json.zio.*
import zio.*
import zio.json.*
import demdem.mood.domain.MoodRecord
import java.util.UUID
import java.time.Instant
import demdem.mood.db.Repository
import demdem.mood.db.Schema.DbMoodRecord
import demdem.mood.db.Schema

object PostMoodRecordEndpoint {

  import sttp.tapir.generic.auto.*

  case class MoodRecordRequest(
      userId: UUID,
      timestamp: Instant,
      moodLevel: String
  ) derives JsonCodec

  val endpointSchema = sttp.tapir.endpoint.post
    .in("mood")
    .in(jsonBody[MoodRecordRequest])

  def layer = ZLayer.derive[PostMoodRecordEndpoint]
}

case class PostMoodRecordEndpoint(repository: Repository) {
  import PostMoodRecordEndpoint.endpointSchema

  val endpoint: ZServerEndpoint[Any, Any] = endpointSchema.zServerLogic(request =>
    for {
      id <- Random.nextUUID
      records <- repository
        .addMoodRecord(
          DbMoodRecord(
            id = id,
            userId = request.userId,
            timestamp = request.timestamp,
            moodLevel = request.moodLevel match
              case "Good"    => Schema.DbMoodLevel.Good
              case "Neutral" => Schema.DbMoodLevel.Neutral
              case "Bad"     => Schema.DbMoodLevel.Bad
          )
        )
        .orDie
    } yield ()
  )

}
