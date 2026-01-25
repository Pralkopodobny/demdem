package endpoints

import sttp.tapir.ztapir.*
import sttp.tapir.json.pickler.*
import sttp.tapir.json.pickler.generic.auto.*
import sttp.tapir.EndpointIO.annotations.jsonbody
import zio.*

object GetMoodRecordsEndpoint {
  val endpointSchema = sttp.tapir.endpoint.get
    .in("mood")
    .out(jsonBody[List[String]])

  def layer = ZLayer.derive[GetMoodRecordsEndpoint]
}

case class GetMoodRecordsEndpoint() {
  import GetMoodRecordsEndpoint.endpointSchema

  val endpoint: ZServerEndpoint[Any, Any] = endpointSchema.zServerLogic(_ => ZIO.succeed(List("Happy", "Sad", "Excited2")))

}
