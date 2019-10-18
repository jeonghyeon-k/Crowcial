package com.android.crowcial.interfaces

import com.android.crowcial.datas.SessionModel
import com.android.crowcial.datas.UserExitModel

import retrofit2.Call
import retrofit2.http.*

interface UserExitRouter {
    @FormUrlEncoded
    @POST("/android/user/exit")
    fun post_userexit(
            @Field("usernum") usernum: String)
            : Call<UserExitModel>
}