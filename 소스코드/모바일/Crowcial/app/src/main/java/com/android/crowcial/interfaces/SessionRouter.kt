package com.android.crowcial.interfaces

import com.android.crowcial.datas.SessionCheckModel
import com.android.crowcial.datas.SessionModel
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Query

interface SessionRouter {
    // 서버에게 세션ID의 발급을 요청함
    @GET("/phone/session")
    fun get_session()
            : Call<SessionModel>

    // 갖고 있는 세션ID가 유효한지 서버에게 질의함
    @GET("/phone/session/check")
    fun get_session_check(@Query("sessionid") sessionid: String)
            : Call<SessionCheckModel>
}