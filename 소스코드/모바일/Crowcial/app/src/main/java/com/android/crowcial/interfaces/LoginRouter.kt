package com.android.crowcial.interfaces

import com.android.crowcial.datas.LoginModel
import com.android.crowcial.datas.LoginUserMoneyModel
import okhttp3.Response
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.http.*

interface LoginRouter {
    @FormUrlEncoded
    @POST("/auth/userlogin")
    fun post_userlogin(
            @Field("userid") userid: String,
            @Field("password") password: String)
            : Call<LoginModel>

    // 유저의 돈 정보를 가져옴
    @GET("/auth/userlogin/money")
    fun get_usermoney(
            @Query("usernum") usernum: String)
            : Call<LoginUserMoneyModel>

    // 유저의 이미지 파일을 가져옴
    @GET("/images/profiles/{imageName}.jpg")
    fun get_userImage(@Path("imageName") imageName: String): Call<ResponseBody>
}