package com.android.crowcial.activities

import android.content.Context
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.WindowManager
import android.widget.Toast
import com.android.crowcial.R
import com.android.crowcial.activities.ProjectDetailActivity.Companion.position
import com.android.crowcial.adapters.DonatedProjectAdapter
import com.android.crowcial.adapters.ProjectAdapter
import com.android.crowcial.classes.ProjectClient
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.datas.ProjectDonationRetrievingModel
import kotlinx.android.synthetic.main.activity_retrieve_dialog.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RetrieveDialog : AppCompatActivity() {
    companion object {
        var projectnum: Int = 0
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_retrieve_dialog)

        projectnum = intent.getIntExtra("projectnum", 0)
        Log.d("Retreive projectnum", projectnum.toString())

        // 다이얼로그가 화면에 표시될 위치와 크기 지정
        setTitle("")
        val display = (getSystemService(Context.WINDOW_SERVICE) as WindowManager).defaultDisplay
        val width = (display.width * 1.0) //Display 사이즈의 100%
        val height = (display.height * 0.4)  //Display 사이즈의 40%
        window.attributes.width = width.toInt()
        window.attributes.height = height.toInt()

        btn_ok.setOnClickListener(OkClick())
        btn_cancel.setOnClickListener(CancelClick())
    }

    inner class OkClick: View.OnClickListener {
        override fun onClick(v: View?) {
            if (edit_money.text.length == 0) {
                Toast.makeText(this@RetrieveDialog, "금액을 입력해주세요", Toast.LENGTH_SHORT).show()
                return
            }
            // TODO: DonatedProjectAdapter.loginedActivityContext를 이용해서 서버에서 돈정보를 가져오고
            // TODO: LoginedActivity의 돈 표시하는 텍스트뷰를 수정하자.
            var router = ProjectClient.get()
            var call = router.post_project_donation_retrieving(RetrofitClient.usernum?.toInt(), projectnum, edit_money.text.toString().toLong())

            call.enqueue(object: Callback<ProjectDonationRetrievingModel> {
                override fun onResponse(call: Call<ProjectDonationRetrievingModel>, res: Response<ProjectDonationRetrievingModel>) {
                    Log.d("Retreive", "onSuccess()")
                    if (res.body()?.alreadyFinish == true) {
                        Toast.makeText(this@RetrieveDialog, "이미 모금 지급된 프로젝트는 회수 불가합니다", Toast.LENGTH_SHORT).show()
                        return
                    }
                    if (res.body()?.notEnough == true) {
                        Toast.makeText(this@RetrieveDialog, "회수하시려는 금액은 기부하신 금액보다 적어야합니다", Toast.LENGTH_SHORT).show()
                        return
                    }
                    if (res.body()?.complete == false) {
                        Toast.makeText(this@RetrieveDialog, "후원금 회수 실패", Toast.LENGTH_SHORT).show()
                        return
                    }
                    Toast.makeText(this@RetrieveDialog, "후원금 회수 완료", Toast.LENGTH_SHORT).show()

                    // TODO: DonatedProjectAdapter에 있는 context를 이용해서 LogineActivity의 금액정보를 업데이트한다.
                    // TODO: 그리고 DonatedProjectAdapter의 아이템뷰의 금액부분도 수정해야한다 어떻게해야할지 고민하자
                    // TODO: setResult를 2번으로해서 finish 시키면 내가 후원한 프로젝트창이 다시뜨면서 될듯
                    setResult(2)
                    finish()
                }

                override fun onFailure(call: Call<ProjectDonationRetrievingModel>, t: Throwable) {
                    Log.d("Retreive", "onFailure()")
                    Toast.makeText(this@RetrieveDialog, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                    return
                }
            })

        }
    }

    inner class CancelClick : View.OnClickListener {
        override fun onClick(v: View?) {
            finish()
        }
    }
}
