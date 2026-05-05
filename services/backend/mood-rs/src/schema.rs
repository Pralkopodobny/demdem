// @generated automatically by Diesel CLI.

diesel::table! {
    moods (id) {
        id -> Uuid,
        timestamp -> Timestamptz,
        moodlevel -> Text,
    }
}
