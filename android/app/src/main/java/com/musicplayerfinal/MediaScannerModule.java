package com.musicplayerfinal;

import android.content.ContentValues;
import android.database.Cursor;
import android.provider.MediaStore;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.File;

public class MediaScannerModule extends ReactContextBaseJavaModule {

    private MediaDatabaseHelper dbHelper;

    MediaScannerModule(ReactApplicationContext context) {
        super(context);
        dbHelper = new MediaDatabaseHelper(context);
    }

    @Override
    public String getName() {
        return "MediaScanner";
    }

    @ReactMethod
    public void scanMedia(Promise promise) {
        try {
            Cursor cursor = getReactApplicationContext()
                    .getContentResolver()
                    .query(
                            MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                            null,
                            MediaStore.Audio.Media.IS_MUSIC + " != 0",
                            null,
                            MediaStore.Audio.Media.DATE_ADDED + " DESC"
                    );

            if (cursor != null) {
                while (cursor.moveToNext()) {
                    ContentValues values = new ContentValues();
                    
                    String id = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID));
                    values.put(MediaDatabaseHelper.COLUMN_ID, id);
                    
                    String title = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE));
                    values.put(MediaDatabaseHelper.COLUMN_TITLE, title != null ? title : "Unknown Title");
                    
                    String artist = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST));
                    values.put(MediaDatabaseHelper.COLUMN_ARTIST, artist != null ? artist : "Unknown Artist");
                    
                    String album = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM));
                    values.put(MediaDatabaseHelper.COLUMN_ALBUM, album != null ? album : "Unknown Album");
                    
                    long albumId = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID));
                    values.put(MediaDatabaseHelper.COLUMN_ALBUM_ID, String.valueOf(albumId));
                    
                    String artworkUri = "content://media/external/audio/albumart/" + albumId;
                    values.put(MediaDatabaseHelper.COLUMN_ARTWORK, artworkUri);
                    
                    String url = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA));
                    values.put(MediaDatabaseHelper.COLUMN_URL, url);
                    
                    double duration = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)) / 1000.0;
                    values.put(MediaDatabaseHelper.COLUMN_DURATION, duration);

                    String folderName = "Unknown";
                    if (url != null) {
                        File file = new File(url);
                        File parent = file.getParentFile();
                        if (parent != null) {
                            folderName = parent.getName();
                        }
                    }
                    values.put(MediaDatabaseHelper.COLUMN_FOLDER_NAME, folderName);
                    
                    long dateAdded = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_ADDED));
                    values.put(MediaDatabaseHelper.COLUMN_DATE_ADDED, dateAdded);
                    
                    dbHelper.insertOrUpdateSong(values);
                }
                cursor.close();
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("SCAN_ERROR", e);
        }
    }

    @ReactMethod
    public void getSongs(int offset, int limit, Promise promise) {
        try {
            WritableArray songs = dbHelper.getSongs(null, null, MediaDatabaseHelper.COLUMN_DATE_ADDED + " DESC", limit, offset);
            promise.resolve(songs);
        } catch (Exception e) {
            promise.reject("DB_ERROR", e);
        }
    }

    @ReactMethod
    public void getFilteredSongs(String folderId, int offset, int limit, Promise promise) {
        try {
            WritableArray songs;
            if ("all".equals(folderId)) {
                songs = dbHelper.getSongs(null, null, MediaDatabaseHelper.COLUMN_DATE_ADDED + " DESC", limit, offset);
            } else if ("favorites".equals(folderId)) {
                songs = dbHelper.getSongs(MediaDatabaseHelper.COLUMN_IS_FAVORITE + " = ?", new String[]{"1"}, MediaDatabaseHelper.COLUMN_TITLE + " ASC", limit, offset);
            } else if ("recent".equals(folderId)) {
                songs = dbHelper.getSongs(MediaDatabaseHelper.COLUMN_RECENT_DATE + " > ?", new String[]{"0"}, MediaDatabaseHelper.COLUMN_RECENT_DATE + " DESC", limit, offset);
            } else if ("mostplayed".equals(folderId)) {
                songs = dbHelper.getSongs(MediaDatabaseHelper.COLUMN_PLAY_COUNT + " > ?", new String[]{"0"}, MediaDatabaseHelper.COLUMN_PLAY_COUNT + " DESC", limit, offset);
            } else {
                songs = dbHelper.getSongs(MediaDatabaseHelper.COLUMN_FOLDER_NAME + " = ?", new String[]{folderId}, MediaDatabaseHelper.COLUMN_TITLE + " ASC", limit, offset);
            }
            promise.resolve(songs);
        } catch (Exception e) {
            promise.reject("DB_ERROR", e);
        }
    }

    @ReactMethod
    public void getFolders(Promise promise) {
        try {
            WritableArray folders = dbHelper.getFolders();
            promise.resolve(folders);
        } catch (Exception e) {
            promise.reject("DB_ERROR", e);
        }
    }

    @ReactMethod
    public void toggleFavorite(String id, Promise promise) {
        try {
            dbHelper.toggleFavorite(id);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("DB_ERROR", e);
        }
    }

    @ReactMethod
    public void addRecent(String id, Promise promise) {
        try {
            dbHelper.addRecent(id);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("DB_ERROR", e);
        }
    }

    @ReactMethod
    public void incrementPlayCount(String id, Promise promise) {
        try {
            dbHelper.incrementPlayCount(id);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("DB_ERROR", e);
        }
    }
}