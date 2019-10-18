package com.android.crowcial.datas

import com.google.gson.annotations.SerializedName

// ProjectRouter 에 명시된 REST API로 서버에 통신할 때 서버로부터 받는 데이터들이다.
public class ProjectModel {
    @SerializedName("COMPLETE")
    var complete: Boolean = false
}