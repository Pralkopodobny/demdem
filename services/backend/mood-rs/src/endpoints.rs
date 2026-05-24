use diesel::prelude::*;
use std::sync::Arc;
use axum::extract::{Path, Query, State};
use axum::http::StatusCode;
use axum::Json;
use axum::response::IntoResponse;
use crate::models::Mood;
use crate::schema::moods::dsl::moods;

use diesel::insert_into;
use diesel_async::RunQueryDsl;
use uuid::Uuid;
use crate::{CreateMood, MoodRangeQuery};
use crate::state::AppState;

#[utoipa::path(
    get,
    path = "/moods",
    responses(
        (status = 200, description = "List all moods", body = [Mood])
    ),
    tag = "mood"
)]
pub(crate) async fn get_moods_handler(
    State(state): State<Arc<AppState>>,
) -> Result<impl IntoResponse, StatusCode> {
    let mut connection = state
        .pool
        .get()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let result = moods
        .select(Mood::as_select())
        .load(&mut connection)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(result))
}

#[utoipa::path(
    get,
    path = "/moods/range",
    params(
        MoodRangeQuery
    ),
    responses(
        (status = 200, description = "List moods between dates", body = [Mood])
    ),
    tag = "mood"
)]
pub(crate) async fn get_moods_between_dates_handler(
    State(state): State<Arc<AppState>>,
    Query(query): Query<MoodRangeQuery>,
) -> Result<impl IntoResponse, StatusCode> {
    use crate::schema::moods::dsl::*;

    let mut connection = state
        .pool
        .get()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let result = moods
        .filter(day.ge(query.from))
        .filter(day.le(query.to))
        .select(Mood::as_select())
        .load(&mut connection)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(result))
}


#[utoipa::path(
    get,
    path = "/moods/{id}",
    params(
        ("id" = Uuid, Path, description = "Mood id")
    ),
    responses(
        (status = 200, description = "Mood found", body = Mood),
        (status = 404, description = "Mood not found")
    ),
    tag = "mood"
)]
pub(crate) async fn get_mood_by_id_handler(
    State(state): State<Arc<AppState>>,
    Path(id_param): Path<Uuid>,
) -> Result<impl IntoResponse, StatusCode> {
    use crate::schema::moods::dsl::*;

    let mut connection = state
        .pool
        .get()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let result = moods
        .filter(id.eq(id_param))
        .select(Mood::as_select())
        .first(&mut connection)
        .await
        .optional()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match result {
        Some(mood) => Ok(Json(mood)),
        None => Err(StatusCode::NOT_FOUND),
    }
}


#[utoipa::path(
    post,
    path = "/moods",
    request_body = CreateMood,
    responses(
        (status = 200, description = "Mood created successfully", body = usize)
    ),
    tag = "mood"
)]
pub(crate) async fn post_moods_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateMood>,
) -> Result<impl IntoResponse, StatusCode> {
    use crate::schema::moods::dsl::*;

    let mut connection = state
        .pool
        .get()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let result = insert_into(moods)
        .values((
            moodlevel.eq(payload.moodlevel),
            day.eq(payload.day),
            id.eq(Uuid::new_v4()),
        ))
        .execute(&mut connection)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(result))
}