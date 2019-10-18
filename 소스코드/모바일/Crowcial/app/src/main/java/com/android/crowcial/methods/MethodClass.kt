package com.android.crowcial.methods

import android.graphics.Bitmap
import android.util.Log
import com.android.crowcial.activities.RegisterActivity
import java.io.File.separator
import okhttp3.ResponseBody
import java.io.*
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream


public class MethodClass {
    companion object {

        // 비트맵의 크기를 변경해서 반환
        fun resizeBitmap(original: Bitmap): Bitmap {
            var resizeWidth = 1200;

            var aspectRatio: Double = original.height.toDouble() / original.width.toDouble()
            var targetHeight: Int = (resizeWidth * aspectRatio).toInt()
            var result: Bitmap = Bitmap.createScaledBitmap(original, resizeWidth, targetHeight, false)
            if (result != original)
                original.recycle()

            return result
        }
    }
}