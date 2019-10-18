package com.android.crowcial.adapters

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.support.v7.widget.RecyclerView
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.android.crowcial.R
import com.android.crowcial.activities.ProjectDetailActivity
import com.android.crowcial.activities.ProjectDetailActivity.Companion.position
import com.android.crowcial.classes.ProjectClient
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.datas.ProjectGetModelData
import com.android.crowcial.datas.ProjectIsLikedModel
import com.android.crowcial.datas.ProjectLikeModel
import kotlinx.android.synthetic.main.list_item_project.view.*
import retrofit2.Call
import java.text.SimpleDateFormat
import retrofit2.Callback
import retrofit2.Response

// 프로젝트 조회 화면의 리사이클러뷰가 사용하는 어댑터 클래스이다.
class ProjectAdapter(): RecyclerView.Adapter<ProjectAdapter.ItemViewHolder>() {
    companion object {
        // 여기서 context, activity는 LoginedActivity의 context와 activity가 되야한다!
        var context: Context? = null
        var activity: Activity? = null
        var projectCount: Int = 0
        var projects: List<ProjectGetModelData>? = null // 서버로부터 조회해온 프로젝트의 정보들
        var bitmaps: Array<Bitmap?>? = null // 프로젝트의 이미지들
        var positions: Array<Int>? = null // 프로젝트의 번호를 가지고 그 프로젝트가 리사이클러뷰에 몇번째의 위치에 있는지 순서를 알아내기 위해서 사용하는 배열변수이다.
        var categories = arrayOf("전체", "장애인", "아동", "청소년", "다문화", "지구촌", "동물", "기타")
    }

    override fun getItemCount() = projectCount

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        val adapterView = LayoutInflater.from(parent.context).inflate(R.layout.list_item_project, parent, false)
        return ItemViewHolder(adapterView)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        holder.bind(projects?.elementAt(position)!!, position)
    }

    inner class ItemViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        fun bind(data: ProjectGetModelData, position: Int) {

            // 리사이클러뷰에 올라갈때 기본적인 정보들을 변경
            itemView.txt_name.text = data.project_name
            itemView.txt_category.text = categories[data.project_sort]
            itemView.txt_heart.text = data.project_like.toString()
            itemView.txt_due.text = SimpleDateFormat("yyyy/MM/dd").format(data.project_due)
            var progress = (data.project_money.toDouble() / data.project_duemoney.toDouble() * 100).toInt()
            itemView.txt_progress.text = "달성 " + progress + "%"
            itemView.progressBar.setProgress(progress)
            itemView.img_img.setImageBitmap(bitmaps?.get(position))
            Log.d("ARRAY", projectCount.toString());
            Log.d("ARRAY SIZE", positions?.size?.toString())
            positions?.set(data.project_num, position)
            Log.d("PROJECT SET", data.project_num.toString() + ": " + positions?.get(data.project_num))
            //positions?.set(data.project_num, position)

            // 사용자가 좋아요를 했느냐 안했느냐에 따라서 좋아요의 이미지를 다르게 보여줘야함.
            var router = ProjectClient.get()
            var call = router.get_project_like(RetrofitClient.usernum.toInt(), data.project_num)

            call.enqueue(object: Callback<ProjectIsLikedModel> {
                override fun onResponse(call: Call<ProjectIsLikedModel>, res: Response<ProjectIsLikedModel>) {
                    if (res.body()?.liked == true) {
                        itemView.img_heart.setImageResource(R.drawable.ic_like2)
                    } else {
                        itemView.img_heart.setImageResource(R.drawable.ic_like)
                    }
                }

                override fun onFailure(call: Call<ProjectIsLikedModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                }
            })

            // 좋아요 버튼 클릭시 이벤트
            itemView.img_heart.setOnClickListener {

                var router = ProjectClient.get()
                var call = router.post_project_like(RetrofitClient.usernum.toInt(), projects?.elementAt(position)?.project_num!!.toInt())

                call.enqueue(object: Callback<ProjectLikeModel> {
                    override fun onResponse(call: Call<ProjectLikeModel>, res: Response<ProjectLikeModel>) {

                        // 좋아요 이미지를 표시하고 좋아요 수치를 나타냄
                        if (res.body()?.inserted == true) {
                            itemView.img_heart.setImageResource(R.drawable.ic_like2)
                        } else {
                            itemView.img_heart.setImageResource(R.drawable.ic_like)
                        }
                        itemView.txt_heart.text = res.body()?.like_count.toString()
                    }

                    override fun onFailure(call: Call<ProjectLikeModel>, t: Throwable) {
                        Log.d("TEST LIKE", "onFailure()")
                    }
                })
            }

            // 프로젝트 이미지 클릭시 이벤트. 새로운 액티비티를 띄워줌
            itemView.img_img.setOnClickListener {
                var intent = Intent(context, ProjectDetailActivity::class.java)
                intent.putExtra("projectnum", data.project_num)
                activity?.startActivityForResult(intent, 1)
            }
        }
    }
}