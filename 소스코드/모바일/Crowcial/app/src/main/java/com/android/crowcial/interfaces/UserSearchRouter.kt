package com.android.crowcial.interfaces

import com.android.crowcial.datas.IDSearchModel
import com.android.crowcial.datas.PWNewModel
import com.android.crowcial.datas.PWSearchModel
import retrofit2.Call
import retrofit2.http.*

interface UserSearchRouter {
    @GET("/auth/user/search/id")
    fun get_user_search_id(
            @Query("username") username: String,
            @Query("mailleft") mailleft: String,
            @Query("mailright") mailright: String)
            : Call<IDSearchModel>

    @GET("/auth/user/search/mailsend")
    fun get_user_search_mailsend(
            @Query("sessionid") sessionid: String,
            @Query("username") username: String,
            @Query("userid") userid: String,
            @Query("mailleft") mailleft: String,
            @Query("mailright") mailright: String)
            : Call<PWSearchModel>

    @GET("/auth/user/search/mailcert")
    fun get_user_search_mailcert(
            @Query("sessionid") sessionid: String,
            @Query("mailcert") username: String)
            : Call<PWSearchModel>

    @GET("/auth/user/search/pw/new")
    fun get_user_search_pw_new(
            @Query("sessionid") sessionid: String)
            : Call<PWSearchModel>

    @FormUrlEncoded
    @POST("/auth/user/search/pw/new")
    fun post_user_search_pw_new(
            @Field("sessionid") sessionid: String,
            @Field("password") password: String)
            : Call<PWNewModel>
}