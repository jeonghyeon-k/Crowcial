package com.android.crowcial.interfaces

import com.android.crowcial.datas.*
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.*

interface ProjectRouter {

    // 프로젝트 등록
    @Multipart
    @POST("/android/project/content")
    fun post_project_content(
            @Part("sessionid") sessionid : RequestBody,
            @Part("usernum") usernum : RequestBody,
            @Part("name") name : RequestBody,
            @Part("content") content : RequestBody,
            @Part image: MultipartBody.Part,
            @Part("duemoney") duemoney: RequestBody,
            @Part("category") category: RequestBody,
            @Part("year") year: RequestBody,
            @Part("month") month: RequestBody,
            @Part("day") day: RequestBody
    ) : Call<ProjectModel>

    // 프로젝트 후원
    @FormUrlEncoded
    @POST("/android/project/donation")
    fun post_project_donation(
            @Field("usernum") usernum: Int,
            @Field("projectnum") projectnum: Int,
            @Field("money") money: Long
    ) : Call<ProjectDonationModel>

    // 후원한 금액 환불
    @FormUrlEncoded
    @POST("/android/project/donation/retrieving")
    fun post_project_donation_retrieving(
            @Field("usernum") usernum: Int,
            @Field("projectnum") projectnum: Int,
            @Field("money") money: Long
    ) : Call<ProjectDonationRetrievingModel>

    // 사용자가 후원한 프로젝트의 정보와 후원한 금액을 조회함
    @GET("/android/project/donation/lookup")
    fun get_project_donation_lookup(
            @Query("usernum") usernum: Int
    ) : Call<ProjectDonationLookupModel>

    // 프로젝트 좋아요 표시
    @FormUrlEncoded
    @POST("/android/project/like")
    fun post_project_like(
            @Field("usernum") usernum: Int,
            @Field("projectnum") projectnum: Int
    ) : Call<ProjectLikeModel>

    // 해당 사용자가 해당 프로젝트에 좋아요를 눌렀는지의 여부를 조회함
    @GET("/android/project/like")
    fun get_project_like(
            @Query("usernum") usernum: Int,
            @Query("projectnum") projectnum: Int
    ) : Call<ProjectIsLikedModel>

    // 프로젝트 조회
    @GET("/android/project/content")
    fun get_project_content(
            @Query("usernum") usernum: String,
            @Query("category") category: Long, // category가 0이면 전체보기, 1~x는 특정 카테고리만 보기
            @Query("sort") sort: Long // sort가 0이면 최신순, 1이면 좋아요순으로 정렬
    ) : Call<ProjectGetModel>

    // 프로젝트의 이미지 파일을 가져옴
    @GET("/images/projects/{imageName}.jpg")
    fun get_projectImage(@Path("imageName") imageName: String): Call<ResponseBody>
}