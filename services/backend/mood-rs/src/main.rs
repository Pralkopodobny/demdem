pub mod models;
pub mod schema;
pub mod endpoints;
pub mod state;

use axum::routing::post;
use axum::{routing::get, Router};
use chrono::NaiveDate;
use deadpool::managed;
use diesel::{Connection, PgConnection};
use diesel_async::pooled_connection::deadpool::Pool;
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::AsyncPgConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenvy::dotenv;
use serde::{Deserialize, Serialize};
use std::env;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

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


use crate::state::AppState;

use utoipa::ToSchema;

use crate::models::MoodLevel;

#[derive(Serialize, Deserialize, ToSchema)]
pub struct CreateMood {
    pub day: NaiveDate,
    pub moodlevel: MoodLevel,
}

#[derive(Serialize, Deserialize, ToSchema, utoipa::IntoParams)]
pub struct MoodRangeQuery {
    pub from: NaiveDate,
    pub to: NaiveDate,
}

use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

#[derive(OpenApi)]
#[openapi(
    paths(
        endpoints::get_moods_handler,
        endpoints::get_moods_between_dates_handler,
        endpoints::get_mood_by_id_handler,
        endpoints::post_moods_handler,
    ),
    components(
        schemas(models::Mood, models::MoodLevel, CreateMood, MoodRangeQuery)
    ),
    tags(
        (name = "mood", description = "Mood management endpoints")
    ),
    info(
        title = "DemDem Mood API",
        version = "1.0.0",
        description = "API for tracking and managing daily moods in the DemDem application.",
        license(
            name = "MIT",
            url = "https://opensource.org/licenses/MIT"
        )
    )
)]
struct ApiDoc;

#[tokio::main]
async fn main() {
    let c = &mut establish_single_connection();
    let _ = c.run_pending_migrations(MIGRATIONS);
    let pool = establish_connection();

    let state = Arc::new(AppState { pool });

    let cors_layer = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // build our application with a single route
    let app = Router::new()
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .route("/", get(|| async { "Hello, World!" }))
        .route("/moods", get(endpoints::get_moods_handler))
        .route("/moods/range", get(endpoints::get_moods_between_dates_handler))
        .route("/moods/{id}", get(endpoints::get_mood_by_id_handler))
        .route("/moods", post(endpoints::post_moods_handler))
        .with_state(state)
        .layer(cors_layer);

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
