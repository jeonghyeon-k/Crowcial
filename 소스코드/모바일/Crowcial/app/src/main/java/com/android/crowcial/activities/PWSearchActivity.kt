package com.android.crowcial.activities

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import com.android.crowcial.R
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.classes.UserSearchClient
import com.android.crowcial.datas.PWNewModel
import kotlinx.android.synthetic.main.activity_pwsearch.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class PWSearchActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pwsearch)
        var userid = intent.getStringExtra("userid")
        textView1.text = userid + "님\n 새로운 비밀번호를\n입력하세요!"
        btn_submit.setOnClickListener(SubmitClick())
    }

    inner class SubmitClick : View.OnClickListener {
        override fun onClick(v: View?) {
            if (edit_password.text.length == 0 || edit_password2.text.length == 0) {
                Toast.makeText(this@PWSearchActivity, "새로운 비밀번호를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_password.text.toString() != edit_password2.text.toString()) {
                Toast.makeText(this@PWSearchActivity, "비밀번호와 비밀번호 재확인을 같게 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }

            val router = UserSearchClient.get()
            val call = router.post_user_search_pw_new(RetrofitClient.sessionid, edit_password.text.toString())

            call.enqueue(object: Callback<PWNewModel> {
                override fun onResponse(call: Call<PWNewModel>, res: Response<PWNewModel>) {
                    if (res.code() == 400) {
                        Toast.makeText(this@PWSearchActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        return
                    }
                    if (res.body()?.passChanged == false) {
                        Toast.makeText(this@PWSearchActivity, "비밀번호 변경 실패", Toast.LENGTH_SHORT).show()
                        return
                    }

                    Toast.makeText(this@PWSearchActivity, "비밀번호가 변경되었습니다.", Toast.LENGTH_SHORT).show()
                    finish()
                }

                override fun onFailure(call: Call<PWNewModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@PWSearchActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }
}
