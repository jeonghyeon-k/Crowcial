package com.android.crowcial.classes

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

// 서버와 HTTP 통신을 하게 해주는 OkHttpClient와 REST API 방식의 통신을 쉽게 하게 해주는 Retrofit, 그리고 서버로부터 발급받은 세션 ID 등이 이 클래스에 있다.
class RetrofitClient {
    companion object {
        val BASE_URL: String = "http://203.249.127.32:65004"
        var sessionid: String = ""
        var userid: String = ""
        var username: String = ""
        var usernum: String = ""
        var imagename: String = ""
        var usermoney: Long = 0
        var client: OkHttpClient = OkHttpClient()
        var retrofit: Retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
    }
}