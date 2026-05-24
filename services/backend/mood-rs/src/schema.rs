// @generated automatically by Diesel CLI.

diesel::table! {
    moods (id) {
        id -> Uuid,
        day -> Date,
        moodlevel -> Text,
    }
}
