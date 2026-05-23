use chrono::{DateTime, Utc};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use utoipa::ToSchema;
use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::expression::AsExpression;
use diesel::pg::{Pg, PgValue};
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::sql_types::Text;
use std::io::Write;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, ToSchema, AsExpression, FromSqlRow)]
#[diesel(sql_type = Text)]
#[serde(rename_all = "lowercase")]
pub enum MoodLevel {
    Bad,
    Mid,
    Good,
    Unset,
}

impl ToSql<Text, Pg> for MoodLevel {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        match *self {
            MoodLevel::Bad => out.write_all(b"bad")?,
            MoodLevel::Mid => out.write_all(b"mid")?,
            MoodLevel::Good => out.write_all(b"good")?,
            MoodLevel::Unset => out.write_all(b"unset")?,
        }
        Ok(IsNull::No)
    }
}

impl FromSql<Text, Pg> for MoodLevel {
    fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
        match bytes.as_bytes() {
            b"bad" => Ok(MoodLevel::Bad),
            b"mid" => Ok(MoodLevel::Mid),
            b"good" => Ok(MoodLevel::Good),
            b"unset" => Ok(MoodLevel::Unset),
            _ => Err("Unrecognized mood level".into()),
        }
    }
}

#[derive(Queryable, Selectable, Debug, Serialize, Deserialize, ToSchema)]
#[diesel(table_name = crate::schema::moods)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Mood {
    pub id: Uuid,
    pub timestamp: DateTime<Utc>,
    pub moodlevel: MoodLevel,
}
