package com.musicplayerfinal;

import android.database.Cursor;
import android.provider.MediaStore;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

public class MediaScannerModule extends ReactContextBaseJavaModule {

    MediaScannerModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "MediaScanner";
    }

    @ReactMethod
    public void getSongs(Promise promise) {

        try {

            WritableArray songs = Arguments.createArray();

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

                    WritableMap song = Arguments.createMap();

                    song.putString(
                            "id",
                            cursor.getString(
                                    cursor.getColumnIndexOrThrow(
                                            MediaStore.Audio.Media._ID
                                    )
                            )
                    );

                    song.putString(
                            "title",
                            cursor.getString(
                                    cursor.getColumnIndexOrThrow(
                                            MediaStore.Audio.Media.TITLE
                                    )
                            )
                    );
song.putString(
        "artist",
        cursor.getString(
                cursor.getColumnIndexOrThrow(
                        MediaStore.Audio.Media.ARTIST
                )
        )
);

song.putString(
        "album",
        cursor.getString(
                cursor.getColumnIndexOrThrow(
                        MediaStore.Audio.Media.ALBUM
                )
        )
);

long albumId =
        cursor.getLong(
                cursor.getColumnIndexOrThrow(
                        MediaStore.Audio.Media.ALBUM_ID
                )
        );

song.putString(
        "albumId",
        String.valueOf(albumId)
);

String artworkUri =
        "content://media/external/audio/albumart/"
        + albumId;

song.putString(
        "artwork",
        artworkUri
);

song.putString(
        "url",
        cursor.getString(
                cursor.getColumnIndexOrThrow(
                        MediaStore.Audio.Media.DATA
                )
        )
);
                    song.putDouble(
                            "duration",
                            cursor.getLong(
                                    cursor.getColumnIndexOrThrow(
                                            MediaStore.Audio.Media.DURATION
                                    )
                            ) / 1000.0
                    );

                    songs.pushMap(song);
                }

                cursor.close();
            }

            promise.resolve(songs);

        } catch (Exception e) {

            promise.reject(
                    "SCAN_ERROR",
                    e
            );
        }
    }
}