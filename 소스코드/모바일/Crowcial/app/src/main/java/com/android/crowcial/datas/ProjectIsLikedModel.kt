package com.android.crowcial.datas

import com.google.gson.annotations.SerializedName

// ProjectRouter 에 명시된 REST API로 서버에 통신할 때 서버로부터 받는 데이터들이다.
// ProjectAdapter에서 뷰를 bind 할 때 해당 프로젝트를 사용자가 좋아요를 했는지 안했는지의 여부에 따라서 좋아요 이미지를 다르게 나타내기 위해서 사용한다.
public class ProjectIsLikedModel {
    @SerializedName("LIKED")
    var liked: Boolean = false
}