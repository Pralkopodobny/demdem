package demdem.mood.domain

import java.time.Instant
import java.util.UUID

enum MoodLevel:
  case Good
  case Neutral
  case Bad

case class MoodRecord(id: UUID, userId: UUID, timestamp: Instant, moodLevel: MoodLevel)
case class MoodUser(id: UUID, name: String)
