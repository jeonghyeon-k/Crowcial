package com.android.crowcial.datas

import com.google.gson.annotations.SerializedName

// RegisterRouter 에 명시된 REST API로 서버에 통신할 때 서버로부터 받는 데이터들이다.
public class MailsendModel {
    @SerializedName("MESSAGE")
    var message: String = ""
    @SerializedName("ALREADY_MAIL")
    var alreadyMail: Boolean = false
    @SerializedName("CERTIFIED")
    var certified: Boolean = false
}