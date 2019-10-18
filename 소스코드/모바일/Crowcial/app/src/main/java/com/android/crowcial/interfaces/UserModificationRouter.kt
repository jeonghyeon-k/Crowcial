package com.android.crowcial.interfaces

import com.android.crowcial.datas.UserGetModel
import com.android.crowcial.datas.UserModel
import com.android.crowcial.datas.UserPostModel
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.*

interface UserModificationRouter {

    // 내 정보 수정 화면에서 기본적으로 보여줘야 할 사용자 정보들을 가져옴
    @GET("/android/user")
    fun get_user(
            @Query("usernum") usernum: String
    ) : Call<UserGetModel>

    // 내 정보 수정 확인버튼을 누르면 서버에 정보를 업데이트하도록 요청
    @Multipart
    @POST("/android/user")
    fun post_user(
            @Part image: MultipartBody.Part,
            @Part("usernum") usernum: RequestBody,
            @Part("username") username: RequestBody,
            @Part("password") password: RequestBody,
            @Part("userbank") userbank: RequestBody,
            @Part("userbankaccount") userbankaccount: RequestBody
    ) : Call<UserPostModel>

}