package com.android.crowcial.activities

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import com.android.crowcial.R
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.classes.UserSearchClient
import com.android.crowcial.datas.IDSearchModel
import com.android.crowcial.datas.PWSearchModel
import kotlinx.android.synthetic.main.activity_user_search.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class UserSearchActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_search)
        btn_submit1.setOnClickListener(IDSubmitClick())
        btn_mailsend.setOnClickListener(MailsendClick())
        btn_mailcert.setOnClickListener(MailcertClick())
        btn_submit2.setOnClickListener(PWSubmitClick())
    }

    // ID 찾기 전송버튼 클릭 이벤트 리스너
    inner class IDSubmitClick : View.OnClickListener {
        override fun onClick(v: View?) {
            if (edit_name1.text.length == 0) {
                Toast.makeText(this@UserSearchActivity, "이름을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_mailleft1.text.length == 0 || edit_mailright1.text.length == 0) {
                Toast.makeText(this@UserSearchActivity, "이메일을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }

            val router = UserSearchClient.get()
            val call = router.get_user_search_id(edit_name1.text.toString(), edit_mailleft1.text.toString(), edit_mailright1.text.toString())

            call.enqueue(object: Callback<IDSearchModel> {
                override fun onResponse(call: Call<IDSearchModel>, res: Response<IDSearchModel>) {
                    if (res.body()?.haveAccount == false) {
                        Toast.makeText(this@UserSearchActivity, "가입하신 계정이 없습니다.", Toast.LENGTH_SHORT).show()
                        return
                    }
                    Toast.makeText(this@UserSearchActivity, "가입하신 계정은 " + res.body()?.userid + " 입니다.", Toast.LENGTH_SHORT).show()
                }

                override fun onFailure(call: Call<IDSearchModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@UserSearchActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }

    // 메일 전송 클릭 이벤트 리스너
    inner class MailsendClick : View.OnClickListener {
        override fun onClick(v: View?) {
            if (edit_name2.text.length == 0) {
                Toast.makeText(this@UserSearchActivity, "이름을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_userid2.text.length == 0) {
                Toast.makeText(this@UserSearchActivity, "아이디를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_mailleft2.text.length == 0 || edit_mailright2.text.length == 0) {
                Toast.makeText(this@UserSearchActivity, "이메일을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }

            val router = UserSearchClient.get()
            val call = router.get_user_search_mailsend(
                    RetrofitClient.sessionid, edit_name2.text.toString(), edit_userid2.text.toString(),
                    edit_mailleft2.text.toString(), edit_mailright2.text.toString())

            call.enqueue(object: Callback<PWSearchModel> {
                override fun onResponse(call: Call<PWSearchModel>, res: Response<PWSearchModel>) {
                    if (res.code() == 400) {
                        Toast.makeText(this@UserSearchActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        return
                    }
                    if (res.body()?.message != "") {
                        Toast.makeText(this@UserSearchActivity, res.body()?.message, Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<PWSearchModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@UserSearchActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }

    // 인증 확인 클릭 이벤트 리스너
    inner class MailcertClick : View.OnClickListener {
        override fun onClick(v: View?) {
            if (edit_mailcert.text.length == 0) {
                Toast.makeText(this@UserSearchActivity, "인증번호를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }

            val router = UserSearchClient.get()
            val call = router.get_user_search_mailcert(RetrofitClient.sessionid, edit_mailcert.text.toString())

            call.enqueue(object: Callback<PWSearchModel> {
                override fun onResponse(call: Call<PWSearchModel>, res: Response<PWSearchModel>) {
                    if (res.code() == 400) {
                        Toast.makeText(this@UserSearchActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        return
                    }
                    if (res.body()?.message != "") {
                        Toast.makeText(this@UserSearchActivity, res.body()?.message, Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<PWSearchModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@UserSearchActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }

    // PW 찾기 전송버튼 클릭 이벤트 리스너
    inner class PWSubmitClick : View.OnClickListener {
        override fun onClick(v: View?) {
            val router = UserSearchClient.get()
            val call = router.get_user_search_pw_new(RetrofitClient.sessionid)

            call.enqueue(object: Callback<PWSearchModel> {
                override fun onResponse(call: Call<PWSearchModel>, res: Response<PWSearchModel>) {
                    if (res.code() == 400) {
                        Toast.makeText(this@UserSearchActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        return
                    }
                    if (res.body()?.certified != true) {
                        Toast.makeText(this@UserSearchActivity, "이메일 인증이 필요합니다.", Toast.LENGTH_SHORT).show()
                        return
                    }

                    // 새로운 액티비티를 띄워서 사용자가 새로운 비밀번호를 입력하도록 함
                    val intent = Intent(this@UserSearchActivity, PWSearchActivity::class.java)
                    intent.putExtra("userid", res.body()?.userid)
                    startActivity(intent)
                }

                override fun onFailure(call: Call<PWSearchModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@UserSearchActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }
}
