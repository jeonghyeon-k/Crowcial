package com.android.crowcial.datas

import com.google.gson.annotations.SerializedName

// UserSearchRouter 에 명시된 REST API로 서버에 통신할 때 서버로부터 받는 데이터들이다.
public class IDSearchModel {
    @SerializedName("id")
    var userid: String = ""
    @SerializedName("HAVE_ACCOUNT")
    var haveAccount: Boolean = false
}