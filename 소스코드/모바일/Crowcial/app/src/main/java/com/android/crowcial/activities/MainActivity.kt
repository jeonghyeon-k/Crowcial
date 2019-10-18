package com.android.crowcial.activities

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.ImageView
import android.widget.Toast
import com.android.crowcial.R
import com.android.crowcial.activities.LoginedActivity.Companion.bitmap
import com.android.crowcial.classes.LoginClient
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.classes.RetrofitClient.Companion.sessionid
import com.android.crowcial.classes.SessionClient
import com.android.crowcial.datas.LoginModel
import com.android.crowcial.datas.SessionCheckModel
import com.android.crowcial.datas.SessionModel
import kotlinx.android.synthetic.main.activity_logined.*
import kotlinx.android.synthetic.main.activity_main.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import java.io.*

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val pref = getSharedPreferences("session", MODE_PRIVATE)
        val editor = pref.edit()

        // SharedPreferences에 저장된 세션ID가 있는지 확인
        if (pref.contains("id")) {
            Login(pref.getString("id", ""), pref.getString("password", ""))
        } else {
            Log.d("TEST", "저장된 id, pw 없음");
        }

        // 버튼 이벤트 등록
        btn_login.setOnClickListener(LoginClick())
        btn_register.setOnClickListener(RegisterClick())
        btn_search.setOnClickListener(SearchClick())
    }

    // 로그인 시키는 함수이다.
    fun Login(id: String="", password: String="") {

        var id = id
        var password = password

        // id, password에 빈 값이 들어왔으면 로그인 창에 입력한 값으로 변경
        // 빈 값이 아니라면 처음 실행할때 SharedPreferences에서 id, pw값을 가져온걸로 로그인 시도하게 된다.
        if (id == "") {
            id = edit_userid.text.toString()
        }
        if (password == "") {
            password = edit_password.text.toString()
        }

        // 서버에 로그인 정보를 보냄.
        val router = LoginClient.get()
        val call = router.post_userlogin(id, password)
        call.enqueue(object: Callback<LoginModel> {
            override fun onResponse(call: Call<LoginModel>, res: Response<LoginModel>) {
                Log.d("TEST", "session onResponse()")
                if (res.body()?.unknownUserid == true) {
                    Toast.makeText(this@MainActivity, "그런 아이디는 없습니다.", Toast.LENGTH_SHORT).show()
                    return
                }
                if (res.body()?.wrongPassword == true) {
                    Toast.makeText(this@MainActivity, "비밀번호가 틀렸습니다.", Toast.LENGTH_SHORT).show()
                    return
                }
                if (res.body()?.stoppedId == true) {
                    Toast.makeText(this@MainActivity, "정지된 계정입니다.", Toast.LENGTH_SHORT).show()
                    return
                }
                if (res.body()?.loginComplete == true) {
                    Toast.makeText(this@MainActivity, "로그인 성공!", Toast.LENGTH_SHORT).show()
                    RetrofitClient.sessionid = "" // 회원가입, 아이디/비밀번호 찾기에서만 세션이 이용됨
                    RetrofitClient.userid = res.body()!!.userid
                    RetrofitClient.username = res.body()!!.username
                    RetrofitClient.usernum = res.body()!!.usernum
                    RetrofitClient.imagename = res.body()!!.imageName

                    // 접속한 ID와 PW를 SharedPreferences에 저장해둠. (다음에 앱을 켰을때 자동 로그인)
                    val pref = getSharedPreferences("session", MODE_PRIVATE)
                    val editor = pref.edit()
                    editor.putString("id", id)
                    editor.putString("password", password)
                    editor.commit()

                    Log.d("SESSION usernum", RetrofitClient.usernum)

                    // 서버에서 사용자의 프로필 이미지를 가져옴.
                    val router = LoginClient.get()
                    val call = router.get_userImage(RetrofitClient.imagename)
                    call.enqueue(object: Callback<ResponseBody> {
                        override fun onResponse(call: Call<ResponseBody>, res: Response<ResponseBody>) {
                            if (res.isSuccessful) {

                                // 캐시에서 profile이라는 이름으로 파일을 생성
                                LoginedActivity.imgfile = File(cacheDir, "profile")
                                LoginedActivity.imgfile?.createNewFile()

                                // 파일을 읽고 LoginedActivity의 imgfile, bitmap에 저장함
                                var inputStream: InputStream? = null
                                var outputStream: OutputStream? = null
                                val fileReader = ByteArray(4096)
                                val fileSize = res.body()?.contentLength()
                                var fileSizeDownloaded: Long = 0

                                inputStream = res.body()?.byteStream()
                                outputStream = FileOutputStream(LoginedActivity.imgfile)

                                while (true) {
                                    val read = inputStream!!.read(fileReader)
                                    if (read == -1) {
                                        break
                                    }
                                    outputStream!!.write(fileReader, 0, read)
                                    fileSizeDownloaded += read.toLong()
                                    Log.d("File Download: ", "$fileSizeDownloaded of $fileSize")
                                }

                                outputStream!!.flush()
                                LoginedActivity.bitmap = BitmapFactory.decodeFile(LoginedActivity.imgfile?.path)

                                // 기존의 모든 액티비티를 닫고 새로운 액티비티를 시작함
                                finishAffinity()
                                val intent = Intent(this@MainActivity, LoginedActivity::class.java)
                                startActivity(intent)
                            }
                        }

                        override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                            Log.d("TEST", "onFailure()")
                            Toast.makeText(this@MainActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        }
                    })
                }
            }

            override fun onFailure(call: Call<LoginModel>, t: Throwable) {
                Log.d("TEST", "session onFailure()")
                Toast.makeText(this@MainActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
            }
        })
    }

    // 로그인 버튼
    inner class LoginClick : View.OnClickListener {
        override fun onClick(v: View?) {
            if (edit_userid.text.length == 0) {
                Toast.makeText(this@MainActivity, "아이디를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_password.text.length == 0) {
                Toast.makeText(this@MainActivity, "비밀번호를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }

            Login()
        }
    }

    // 회원가입 버튼을 누르면 서버로부터 새로운 세션 ID를 발급받고 회원가입 액티비티로 이동
    inner class RegisterClick : View.OnClickListener {
        override fun onClick(v: View?) {
            val router = SessionClient.get()
            val call = router.get_session()

            call.enqueue(object: Callback<SessionModel> {
                override fun onResponse(call: Call<SessionModel>, res: Response<SessionModel>) {
                    Log.d("TEST", "session onResponse()")

                    if (res.code() == 400) {
                        Toast.makeText(this@MainActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        return
                    }

                    RetrofitClient.sessionid = res.body()!!.sessionid
                    val intent = Intent(this@MainActivity, RegisterActivity::class.java)
                    startActivity(intent)
                }

                override fun onFailure(call: Call<SessionModel>, t: Throwable) {
                    Log.d("TEST", "session onFailure()")
                    Toast.makeText(this@MainActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }

    // 아이디/비밀번호 찾기 버튼을 누르면 서버로부터 새로운 세션 ID를 발급받고 회원가입 액티비티로 이동
    inner class SearchClick : View.OnClickListener {
        override fun onClick(v: View?) {
            val router = SessionClient.get()
            val call = router.get_session()

            call.enqueue(object: Callback<SessionModel> {
                override fun onResponse(call: Call<SessionModel>, res: Response<SessionModel>) {
                    Log.d("TEST", "session onResponse()")

                    if (res.code() == 400) {
                        Toast.makeText(this@MainActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        return
                    }

                    RetrofitClient.sessionid = res.body()!!.sessionid
                    var intent = Intent(this@MainActivity, UserSearchActivity::class.java)
                    startActivity(intent)
                }

                override fun onFailure(call: Call<SessionModel>, t: Throwable) {
                    Log.d("TEST", "session onFailure()")
                    Toast.makeText(this@MainActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }
}
