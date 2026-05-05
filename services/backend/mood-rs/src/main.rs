pub mod models;
pub mod schema;

use crate::models::Mood;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use axum::{Json, Router, routing::get};
use chrono::Utc;
use deadpool::managed;
use diesel::{Connection, PgConnection, insert_into};
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::pooled_connection::deadpool::Pool;
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};
use dotenvy::dotenv;
use serde::{Deserialize, Serialize};
use std::env;
use std::sync::Arc;
use uuid::Uuid;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

pub fn establish_connection() -> managed::Pool<AsyncDieselConnectionManager<AsyncPgConnection>> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let config = AsyncDieselConnectionManager::<AsyncPgConnection>::new(database_url);
    let pool = Pool::builder(config)
        .build()
        .expect("Failed to create pool");
    pool
}

pub fn establish_single_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

use diesel::prelude::*;

#[derive(Serialize, Deserialize)]
struct CreateMood {
    moodlevel: String,
}

#[tokio::main]
async fn main() {
    println!("Siemano");
    use self::schema::moods::dsl::*;

    let c = &mut establish_single_connection();
    let _ = c.run_pending_migrations(MIGRATIONS);
    let pool = establish_connection();

    struct AppState {
        pool: managed::Pool<AsyncDieselConnectionManager<AsyncPgConnection>>,
    }

    let state = Arc::new(AppState { pool });

    // let results = moods.select(Mood::as_select()).load(connection);

    async fn get_moods_handler(
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

    async fn post_moods_handler(
        State(state): State<Arc<AppState>>,
        Json(payload): Json<CreateMood>,
    ) -> Result<impl IntoResponse, StatusCode> {
        use schema::moods::dsl::*;

        let mut connection = state
            .pool
            .get()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        let result = insert_into(moods)
            .values((
                moodlevel.eq(payload.moodlevel),
                timestamp.eq(Utc::now()),
                id.eq(Uuid::new_v4()),
            ))
            .execute(&mut connection)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        Ok(Json(result))
    }

    // build our application with a single route
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/moods", get(get_moods_handler))
        .route("/moods", post(post_moods_handler))
        .with_state(state);

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
