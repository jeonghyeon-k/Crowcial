package com.android.crowcial.activities

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.text.format.Time
import android.util.Log
import android.view.View
import android.widget.Toast
import com.android.crowcial.R
import com.android.crowcial.adapters.ProjectAdapter
import com.android.crowcial.classes.ProjectClient
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.datas.ProjectDonationModel
import kotlinx.android.synthetic.main.activity_project_detail.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import java.util.*

class ProjectDetailActivity : AppCompatActivity() {
    companion object {
        var donateMoney: Long = 0
        var position: Int = 0
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_project_detail)

        // 디테일 액티비티 생성시 기본적인 정보들을 변경
        var projectnum = intent.getIntExtra("projectnum", 0)
        position = ProjectAdapter.positions?.elementAt(projectnum)!!
        Log.d("PROJECT NUM", projectnum.toString())
        Log.d("PROJECT POSITION", position.toString())
        txt_detail_name.text = ProjectAdapter.projects?.elementAt(position)?.project_name
        txt_detail_username.text = ProjectAdapter.projects?.elementAt(position)?.user_name
        txt_detail_content.text = ProjectAdapter.projects?.elementAt(position)?.project_content
        txt_detail_money.text = ProjectAdapter.projects?.elementAt(position)?.project_money.toString()
        txt_detail_duemoney.text = ProjectAdapter.projects?.elementAt(position)?.project_duemoney.toString()
        img_detail.setImageBitmap(ProjectAdapter.bitmaps?.get(position))

        // 후원 버튼 이벤트
        btn_submit.setOnClickListener {

            // 모금 기한이 안지났으면 금액을 입력하는 다이얼로그를 띄워줌
            val now = System.currentTimeMillis()
            val due = ProjectAdapter.projects?.elementAt(position)?.project_due?.time!!
            if (due - now > 0) {
                var intent = Intent(this@ProjectDetailActivity, DonateDialog::class.java)
                startActivityForResult(intent, 1)
            } else {
                Toast.makeText(this@ProjectDetailActivity, "모금 기한이 지났습니다.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (resultCode == 1) {
            Log.d("TEST MONEY", donateMoney.toString())

            // 서버에 후원 요청을 한다
            var router = ProjectClient.get()
            var call = router.post_project_donation(RetrofitClient.usernum.toInt(), ProjectAdapter.projects?.elementAt(position)?.project_num!!, donateMoney)
            Log.d("TEST PRO_NUM", ProjectAdapter.projects?.elementAt(position)?.project_num.toString())

            call.enqueue(object: Callback<ProjectDonationModel> {
                override fun onResponse(call: Call<ProjectDonationModel>, res: Response<ProjectDonationModel>) {
                    Log.d("TEST", "onSuccess()")
                    if (res.body()?.impossible == true) {
                        Toast.makeText(this@ProjectDetailActivity, "본인이 주최한 프로젝트에는 후원할 수 없습니다.", Toast.LENGTH_SHORT).show()
                        return
                    }
                    if (res.body()?.complete == false) {
                        Toast.makeText(this@ProjectDetailActivity, "후원 실패", Toast.LENGTH_SHORT).show()
                        return
                    }

                    Toast.makeText(this@ProjectDetailActivity, "후원 성공!", Toast.LENGTH_SHORT).show()

                    // LoginedActivity에 resultCode로 1을 보내고 showProjects() 호출해서 화면을 업데이트 하게된다.
                    setResult(1)
                    finish()
                }

                override fun onFailure(call: Call<ProjectDonationModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@ProjectDetailActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }
}
