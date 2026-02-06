package demdem.mood.db

import demdem.mood.domain.MoodLevel
import demdem.mood.domain.MoodRecord

object Conversions {
  extension (moodLevel: MoodLevel) {
    def toDb: Schema.DbMoodLevel = moodLevel match {
      case MoodLevel.Good    => Schema.DbMoodLevel.Good
      case MoodLevel.Neutral => Schema.DbMoodLevel.Neutral
      case MoodLevel.Bad     => Schema.DbMoodLevel.Bad
    }
  }

  extension (dbMoodLevel: Schema.DbMoodLevel) {
    def toDomain: MoodLevel = dbMoodLevel match {
      case Schema.DbMoodLevel.Good    => MoodLevel.Good
      case Schema.DbMoodLevel.Neutral => MoodLevel.Neutral
      case Schema.DbMoodLevel.Bad     => MoodLevel.Bad
    }
  }

  extension (dbMoodRecord: Schema.DbMoodRecord) {
    def toDomain: MoodRecord = MoodRecord(
      id = dbMoodRecord.id,
      userId = dbMoodRecord.userId,
      timestamp = dbMoodRecord.timestamp,
      moodLevel = dbMoodRecord.moodLevel.toDomain
    )
  }

  extension (moodRecord: MoodRecord) {
    def toDb: Schema.DbMoodRecord = Schema.DbMoodRecord(
      id = moodRecord.id,
      userId = moodRecord.userId,
      timestamp = moodRecord.timestamp,
      moodLevel = moodRecord.moodLevel.toDb
    )
  }
}
