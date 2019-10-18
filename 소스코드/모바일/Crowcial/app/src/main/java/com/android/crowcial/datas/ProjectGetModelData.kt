package com.android.crowcial.datas

import com.google.gson.annotations.SerializedName
import java.util.*

// ProjectRouter 에 명시된 REST API로 서버에 통신할 때 서버로부터 받는 데이터들이다.
public class ProjectGetModelData {
    @SerializedName("PROJECT_NUM")
    var project_num: Int = 0
    @SerializedName("PROJECT_SORT")
    var project_sort: Int = 0
    @SerializedName("PROJECT_NAME")
    var project_name: String = ""
    @SerializedName("PROJECT_CONTENT")
    var project_content: String = ""
    @SerializedName("PROJECT_MONEY")
    var project_money: Long = 0
    @SerializedName("PROJECT_DUEMONEY")
    var project_duemoney: Long = 0
    @SerializedName("PROJECT_IMAGE")
    var project_image: String = ""
    @SerializedName("PROJECT_DUE")
    var project_due: Date? = null
    @SerializedName("PROJECT_LIKE")
    var project_like: Int = 0
    @SerializedName("USER_NAME")
    var user_name: String = ""
}