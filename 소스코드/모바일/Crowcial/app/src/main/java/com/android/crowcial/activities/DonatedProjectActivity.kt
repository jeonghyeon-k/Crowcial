package com.android.crowcial.activities

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v7.widget.LinearLayoutManager
import android.util.Log
import android.widget.LinearLayout
import android.widget.Toast
import com.android.crowcial.R
import com.android.crowcial.adapters.DonatedProjectAdapter
import com.android.crowcial.classes.ProjectClient
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.datas.ProjectDonationLookupModel
import kotlinx.android.synthetic.main.activity_donated_project.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DonatedProjectActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_donated_project)

        // 서버에게 사용자가 후원한 프로젝트들의 목록과 금액을 요청함.
        var router = ProjectClient.get()
        var call = router.get_project_donation_lookup(RetrofitClient.usernum.toInt())

        call.enqueue(object: Callback<ProjectDonationLookupModel> {
            override fun onResponse(call: Call<ProjectDonationLookupModel>, res: Response<ProjectDonationLookupModel>) {
                DonatedProjectAdapter.context = this@DonatedProjectActivity
                DonatedProjectAdapter.activity = this@DonatedProjectActivity
                DonatedProjectAdapter.projectCount = res.body()?.projects?.size!!
                DonatedProjectAdapter.projects = res.body()?.projects
                recycler_donated_project.adapter = DonatedProjectAdapter()
                recycler_donated_project.layoutManager = LinearLayoutManager(this@DonatedProjectActivity)
            }

            override fun onFailure(call: Call<ProjectDonationLookupModel>, t: Throwable) {
                Log.d("TEST DONATED", "onFailure()")
                Toast.makeText(this@DonatedProjectActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
            }
        })
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        when (resultCode) {
            1 -> {
                setResult(1)
                finish()
            }
            2 -> {
                // DonatedProjectAdapter에서 후원금 회수가 정상작동했으면 DonatedProjectActivity에 2를 resultCode로 반환하고
                // 다시 LoginedActivity에게 DonatedProjectActivity를 띄우도록 2번을 resultCode로 해서 요청한다.
                setResult(2)
                finish()
            }
        }
    }
}
