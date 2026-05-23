use diesel::prelude::*;
use std::sync::Arc;
use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use axum::response::IntoResponse;
use crate::models::Mood;
use crate::schema::moods::dsl::moods;

use diesel::insert_into;
use diesel_async::RunQueryDsl;
use uuid::Uuid;
use crate::CreateMood;
use crate::state::AppState;

#[utoipa::path(
    get,
    path = "/moods",
    responses(
        (status = 200, description = "List all moods", body = [Mood])
    )
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
    post,
    path = "/moods",
    request_body = CreateMood,
    responses(
        (status = 200, description = "Mood created successfully", body = usize)
    )
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
            timestamp.eq(payload.timestamp),
            id.eq(Uuid::new_v4()),
        ))
        .execute(&mut connection)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(result))
}