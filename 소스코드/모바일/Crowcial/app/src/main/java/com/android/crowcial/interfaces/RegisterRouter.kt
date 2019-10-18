package com.android.crowcial.interfaces

import com.android.crowcial.datas.MailcertModel
import com.android.crowcial.datas.MailsendModel
import com.android.crowcial.datas.RegisterModel
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.http.*

interface RegisterRouter {
    @FormUrlEncoded
    @POST("/auth/register/mailsend")
    fun post_mailsend(
            @Field("sessionid") sessionid: String, // sessionid를 String 형태로 서버로 전송하게 됨
            @Field("mailleft") mailleft: String, // mailleft를 String 형태로 서버로 전송하게 됨
            @Field("mailright") mailright: String) // mailright를 String 형태로 서버로 전송하게 됨
            : Call<MailsendModel> // 서버로부터 반환되는 데이터들은 MailsendModel 클래스의 내용

    @FormUrlEncoded
    @POST("/auth/register/mailcert")
    fun post_mailcert(
            @Field("sessionid") sessionId: String,
            @Field("mailcert") mailcert: String)
            : Call<MailcertModel>

    @Multipart
    @POST("/auth/register")
    fun post_register(
            @Part("sessionid") sessionid: RequestBody,
            @Part image: MultipartBody.Part,
            @Part("username") username: RequestBody,
            @Part("userid") userid: RequestBody,
            @Part("password") password: RequestBody,
            @Part("password2") password2: RequestBody,
            @Part("mailleft") mailleft: RequestBody,
            @Part("mailright") mailright: RequestBody,
            @Part("mailcert") mailcert: RequestBody,
            @Part("bank") bank: RequestBody,
            @Part("bankaccount") bankaccount: RequestBody
    ) : Call<RegisterModel>
}