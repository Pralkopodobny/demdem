package demdem.mood.api

import sttp.tapir.ztapir.*
import sttp.tapir.json.zio.*
import sttp.tapir.generic.auto.*
import zio.*
import zio.json.*
import demdem.mood.domain.MoodRecord
import java.util.UUID
import java.time.Instant
import demdem.mood.db.Repository

object GetMoodRecordsEndpoint {

  case class MoodRecordResponse(
      userId: UUID,
      timestamp: Instant,
      moodLevel: String
  ) derives JsonCodec

  val endpointSchema = sttp.tapir.endpoint.get
    .in("mood")
    .out(jsonBody[List[MoodRecordResponse]])

  def layer = ZLayer.derive[GetMoodRecordsEndpoint]
}

case class GetMoodRecordsEndpoint(repository: Repository) {
  import GetMoodRecordsEndpoint.endpointSchema

  val endpoint: ZServerEndpoint[Any, Any] = endpointSchema.zServerLogic(_ =>
    for {
      records <- repository.moodRecordsForAllUsers.orDie
      response = records
        .map(r =>
          GetMoodRecordsEndpoint.MoodRecordResponse(
            userId = r.userId,
            timestamp = r.timestamp,
            moodLevel = r.moodLevel.toString()
          )
        )
        .toList
    } yield response
  )

}
