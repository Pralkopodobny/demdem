package mood.domain

import java.time.Instant

enum MoodLevel:
    case Good
    case Neutral
    case Bad

case class MoodRecord(timestamp: Instant, moodLevel: MoodLevel)