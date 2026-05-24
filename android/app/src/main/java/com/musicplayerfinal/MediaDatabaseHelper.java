package com.musicplayerfinal;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

public class MediaDatabaseHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "MusicPlayerCache.db";
    private static final int DATABASE_VERSION = 1;

    public static final String TABLE_SONGS = "songs";

    public static final String COLUMN_ID = "id";
    public static final String COLUMN_TITLE = "title";
    public static final String COLUMN_ARTIST = "artist";
    public static final String COLUMN_ALBUM = "album";
    public static final String COLUMN_ALBUM_ID = "albumId";
    public static final String COLUMN_ARTWORK = "artwork";
    public static final String COLUMN_URL = "url";
    public static final String COLUMN_DURATION = "duration";
    public static final String COLUMN_FOLDER_NAME = "folderName";
    public static final String COLUMN_DATE_ADDED = "dateAdded";
    
    // Playback state info
    public static final String COLUMN_IS_FAVORITE = "isFavorite";
    public static final String COLUMN_RECENT_DATE = "recentDate";
    public static final String COLUMN_PLAY_COUNT = "playCount";

    public MediaDatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String createSongsTable = "CREATE TABLE " + TABLE_SONGS + " (" +
                COLUMN_ID + " TEXT PRIMARY KEY, " +
                COLUMN_TITLE + " TEXT, " +
                COLUMN_ARTIST + " TEXT, " +
                COLUMN_ALBUM + " TEXT, " +
                COLUMN_ALBUM_ID + " TEXT, " +
                COLUMN_ARTWORK + " TEXT, " +
                COLUMN_URL + " TEXT, " +
                COLUMN_DURATION + " REAL, " +
                COLUMN_FOLDER_NAME + " TEXT, " +
                COLUMN_DATE_ADDED + " INTEGER, " +
                COLUMN_IS_FAVORITE + " INTEGER DEFAULT 0, " +
                COLUMN_RECENT_DATE + " INTEGER DEFAULT 0, " +
                COLUMN_PLAY_COUNT + " INTEGER DEFAULT 0" +
                ")";
        db.execSQL(createSongsTable);
        
        // Create indexes for faster queries
        db.execSQL("CREATE INDEX IF NOT EXISTS idx_title ON " + TABLE_SONGS + "(" + COLUMN_TITLE + ")");
        db.execSQL("CREATE INDEX IF NOT EXISTS idx_artist ON " + TABLE_SONGS + "(" + COLUMN_ARTIST + ")");
        db.execSQL("CREATE INDEX IF NOT EXISTS idx_album ON " + TABLE_SONGS + "(" + COLUMN_ALBUM + ")");
        db.execSQL("CREATE INDEX IF NOT EXISTS idx_folder ON " + TABLE_SONGS + "(" + COLUMN_FOLDER_NAME + ")");
        db.execSQL("CREATE INDEX IF NOT EXISTS idx_is_favorite ON " + TABLE_SONGS + "(" + COLUMN_IS_FAVORITE + ")");
        db.execSQL("CREATE INDEX IF NOT EXISTS idx_recent_date ON " + TABLE_SONGS + "(" + COLUMN_RECENT_DATE + ")");
        db.execSQL("CREATE INDEX IF NOT EXISTS idx_play_count ON " + TABLE_SONGS + "(" + COLUMN_PLAY_COUNT + ")");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_SONGS);
        onCreate(db);
    }

    public void insertOrUpdateSong(ContentValues values) {
        SQLiteDatabase db = this.getWritableDatabase();
        // Check if exists
        Cursor cursor = db.query(TABLE_SONGS, new String[]{COLUMN_ID}, COLUMN_ID + "=?", new String[]{values.getAsString(COLUMN_ID)}, null, null, null);
        if (cursor != null && cursor.moveToFirst()) {
            // Update metadata but keep favorite, recentDate, playCount
            db.update(TABLE_SONGS, values, COLUMN_ID + "=?", new String[]{values.getAsString(COLUMN_ID)});
            cursor.close();
        } else {
            if (cursor != null) cursor.close();
            db.insert(TABLE_SONGS, null, values);
        }
    }

    public void toggleFavorite(String id) {
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.query(TABLE_SONGS, new String[]{COLUMN_IS_FAVORITE}, COLUMN_ID + "=?", new String[]{id}, null, null, null);
        if (cursor != null && cursor.moveToFirst()) {
            int isFav = cursor.getInt(0);
            ContentValues values = new ContentValues();
            values.put(COLUMN_IS_FAVORITE, isFav == 1 ? 0 : 1);
            db.update(TABLE_SONGS, values, COLUMN_ID + "=?", new String[]{id});
            cursor.close();
        }
    }

    public void addRecent(String id) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_RECENT_DATE, System.currentTimeMillis());
        db.update(TABLE_SONGS, values, COLUMN_ID + "=?", new String[]{id});
    }

    public void incrementPlayCount(String id) {
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.query(TABLE_SONGS, new String[]{COLUMN_PLAY_COUNT}, COLUMN_ID + "=?", new String[]{id}, null, null, null);
        if (cursor != null && cursor.moveToFirst()) {
            int count = cursor.getInt(0);
            ContentValues values = new ContentValues();
            values.put(COLUMN_PLAY_COUNT, count + 1);
            db.update(TABLE_SONGS, values, COLUMN_ID + "=?", new String[]{id});
            cursor.close();
        }
    }

    public WritableArray getSongs(String selection, String[] selectionArgs, String orderBy, int limit, int offset) {
        SQLiteDatabase db = this.getReadableDatabase();
        WritableArray songs = Arguments.createArray();

        String limitClause = null;
        if (limit > 0) {
            limitClause = limit + " OFFSET " + offset;
        }

        Cursor cursor = db.query(TABLE_SONGS, null, selection, selectionArgs, null, null, orderBy, limitClause);
        if (cursor != null) {
            while (cursor.moveToNext()) {
                WritableMap song = Arguments.createMap();
                song.putString("id", cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_ID)));
                song.putString("title", cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_TITLE)));
                song.putString("artist", cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_ARTIST)));
                song.putString("album", cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_ALBUM)));
                song.putString("albumId", cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_ALBUM_ID)));
                song.putString("artwork", cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_ARTWORK)));
                song.putString("url", cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_URL)));
                song.putDouble("duration", cursor.getDouble(cursor.getColumnIndexOrThrow(COLUMN_DURATION)));
                song.putString("folderName", cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_FOLDER_NAME)));
                
                // Add state mapping for RN
                song.putBoolean("isFavorite", cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_IS_FAVORITE)) == 1);
                song.putInt("playCount", cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_PLAY_COUNT)));
                
                songs.pushMap(song);
            }
            cursor.close();
        }
        return songs;
    }

    public WritableArray getFolders() {
        SQLiteDatabase db = this.getReadableDatabase();
        WritableArray folders = Arguments.createArray();

        String query = "SELECT " + COLUMN_FOLDER_NAME + ", COUNT(" + COLUMN_ID + ") as count FROM " + TABLE_SONGS + " GROUP BY " + COLUMN_FOLDER_NAME + " ORDER BY " + COLUMN_FOLDER_NAME + " ASC";
        Cursor cursor = db.rawQuery(query, null);
        
        if (cursor != null) {
            while (cursor.moveToNext()) {
                WritableMap folder = Arguments.createMap();
                folder.putString("id", cursor.getString(0));
                folder.putString("title", cursor.getString(0));
                folder.putInt("count", cursor.getInt(1));
                folders.pushMap(folder);
            }
            cursor.close();
        }
        return folders;
    }
}
