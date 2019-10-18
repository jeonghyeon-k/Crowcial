package com.android.crowcial.datas

import com.google.gson.annotations.SerializedName

// LoginRouter 에 명시된 REST API로 서버에 통신할 때 서버로부터 받는 데이터들이다.
public class LoginModel {
    @SerializedName("sessionId")
    var sessionid: String = ""
    @SerializedName("userid")
    var userid: String = ""
    @SerializedName("username")
    var username: String = ""
    @SerializedName("usernum")
    var usernum: String = ""
    @SerializedName("imageName")
    var imageName: String = ""
    @SerializedName("LOGIN_COMPLETE")
    var loginComplete: Boolean = false
    @SerializedName("WRONG_PASSWORD")
    var wrongPassword: Boolean = true
    @SerializedName("UNKNOWN_USERID")
    var unknownUserid: Boolean = true
    @SerializedName("STOPPED_ID")
    var stoppedId: Boolean = false
}