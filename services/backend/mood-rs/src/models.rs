use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Queryable, Selectable, Debug, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::moods)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Mood {
    pub id: Uuid,
    pub timestamp: NaiveDateTime,
    pub moodlevel: String,
}
