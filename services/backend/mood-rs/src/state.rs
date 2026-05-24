use deadpool::managed;
use diesel_async::AsyncPgConnection;
use diesel_async::pooled_connection::AsyncDieselConnectionManager;

pub(crate) struct AppState {
    pub pool: managed::Pool<AsyncDieselConnectionManager<AsyncPgConnection>>,
}
