package com.android.crowcial.activities

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import com.android.crowcial.R
import com.android.crowcial.classes.RegisterClient
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.datas.MailcertModel
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import com.android.crowcial.datas.MailsendModel
import com.android.crowcial.datas.RegisterModel
import com.android.crowcial.methods.MethodClass
import kotlinx.android.synthetic.main.activity_register.*
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream

class RegisterActivity : AppCompatActivity() {
    companion object {
        var imgfile: File? = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)
        btn_upload.setOnClickListener(UploadClick())
        btn_mailsend.setOnClickListener(MailsendClick())
        btn_mailcert.setOnClickListener(MailcertClick())
        btn_submit.setOnClickListener(SubmitOnClick())
    }

    // 이미지 찾기 버튼 클릭 이벤트 리스너
    inner class UploadClick : View.OnClickListener {
        override fun onClick(v: View?) {
            var imageIntent = Intent(Intent.ACTION_PICK)
            imageIntent.setType(android.provider.MediaStore.Images.Media.CONTENT_TYPE)
            startActivityForResult(imageIntent, 1)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        Log.d("TEST", "onActivityResult()")

        // 인텐트를 통해 실행된 갤러리에서 파일을 정상적으로 선택하면 수행
        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {
                Log.d("TEST", "이미지 선택완료")

                // 갤러리에서 선택한 이미지 데이터를 비트맵으로 변환
                var instream: InputStream = contentResolver.openInputStream(data?.getData())
                var img: Bitmap = MethodClass.resizeBitmap(BitmapFactory.decodeStream(instream))
                instream.close()

                // 이미지 비트맵을 담을 File 변수 생성
                imgfile = File(cacheDir, "profile")
                imgfile?.createNewFile()

                // 이미지 비트맵의 데이터를 byte형태로 변환
                var bos: ByteArrayOutputStream = ByteArrayOutputStream()
                img.compress(Bitmap.CompressFormat.JPEG, 100, bos)
                var bitmapdata = bos.toByteArray()

                // 이미지 비트맵의 내용을 File 변수에 씀
                var fos: FileOutputStream = FileOutputStream(imgfile)
                fos.write(bitmapdata)
                fos.flush()
                fos.close()

                // 프로필사진 EditText에 경로명 적어줌
                Log.d("TEST 파일경로", imgfile?.path)
                //edit_profile.setText(data?.getData()?.path)
                img_profile.setImageBitmap(img)
            }
        }
    }

    // 메일 전송 버튼 클릭 이벤트 리스너
    inner class MailsendClick : View.OnClickListener {
        override fun onClick(v: View?) {
            if (edit_mailleft.text.length == 0 || edit_mailright.text.length == 0) {
                Toast.makeText(this@RegisterActivity, "이메일을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }

            var router = RegisterClient.get()
            var call = router.post_mailsend(RetrofitClient.sessionid, edit_mailleft.text.toString(), edit_mailright.text.toString())

            call.enqueue(object: Callback<MailsendModel> {
                override fun onResponse(call: Call<MailsendModel>, res: Response<MailsendModel>) {
                    if (res.code() == 400) {
                        Toast.makeText(this@RegisterActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        return
                    }
                    // 서버가 사용자에게 보여줄 메시지가 있으면 출력
                    if (res.body()?.message != "") {
                        Toast.makeText(this@RegisterActivity, res.body()?.message, Toast.LENGTH_SHORT).show()
                    }
                    if (res.body()?.alreadyMail == true) {
                        Toast.makeText(this@RegisterActivity, "이미 가입된 메일입니다.", Toast.LENGTH_SHORT).show()
                        return
                    }
                    if (res.body()?.certified == true) {
                        Toast.makeText(this@RegisterActivity, "이미 인증되었습니다.", Toast.LENGTH_SHORT).show()
                        return
                    }
                }

                override fun onFailure(call: Call<MailsendModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@RegisterActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })

            //Toast.makeText(this@RegisterActivity, "메일 검사 완료", Toast.LENGTH_SHORT).show()
        }
    }

    // 메일 인증 버튼 클릭 이벤트 리스너
    inner class MailcertClick : View.OnClickListener {
        override fun onClick(v: View?) {
            if (edit_mailcert.text.length == 0) {
                Toast.makeText(this@RegisterActivity, "인증번호를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }

            var router = RegisterClient.get()
            var call = router.post_mailcert(RetrofitClient.sessionid, edit_mailcert.text.toString())

            call.enqueue(object: Callback<MailcertModel> {
                override fun onResponse(call: Call<MailcertModel>, res: Response<MailcertModel>) {
                    if (res.code() == 400) {
                        Toast.makeText(this@RegisterActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        return
                    }

                    // 서버가 사용자에게 보여줄 메시지가 있으면 출력
                    if (res.body()?.message != "") {
                        Toast.makeText(this@RegisterActivity, res.body()?.message, Toast.LENGTH_SHORT).show()
                    }
                    // 아직 인증이 안되었으면 return
                    if (res.body()?.certified == true) {
                        return;
                    }

                }

                override fun onFailure(call: Call<MailcertModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@RegisterActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })

        }
    }

    // 가입 버튼 클릭 이벤트 리스너
    inner class SubmitOnClick : View.OnClickListener {
        @Override
        override fun onClick(v: View?) {
            if (edit_name.text.length == 0) {
                Toast.makeText(this@RegisterActivity, "이름을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_userid.text.length == 0) {
                Toast.makeText(this@RegisterActivity, "아이디를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_password.text.length == 0) {
                Toast.makeText(this@RegisterActivity, "비밀번호를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_password.text.toString() != edit_password2.text.toString()) {
                Toast.makeText(this@RegisterActivity, "비밀번호 확인을 알맞게 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_mailleft.text.length == 0 || edit_mailright.text.length == 0) {
                Toast.makeText(this@RegisterActivity, "이메일을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_bank.text.length == 0) {
                Toast.makeText(this@RegisterActivity, "은행정보를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_bankaccount.text.length == 0) {
                Toast.makeText(this@RegisterActivity, "계좌번호를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (!checkBox1.isChecked()) {
                Toast.makeText(this@RegisterActivity, "서비스 이용약관에 동의해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (!checkBox2.isChecked()) {
                Toast.makeText(this@RegisterActivity, "개인정보 수집 이용에 동의해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (imgfile == null) {
                Toast.makeText(this@RegisterActivity, "프로필 사진을 업로드해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }

            var reqFile: RequestBody = RequestBody.create(MediaType.parse("/image/*"), imgfile)
            var body: MultipartBody.Part = MultipartBody.Part.createFormData("upload", imgfile?.name, reqFile)
            var sessionid = RequestBody.create(MediaType.parse("text/plain"), RetrofitClient.sessionid)
            var username = RequestBody.create(MediaType.parse("text/plain"), edit_name.text.toString())
            var userid = RequestBody.create(MediaType.parse("text/plain"), edit_userid.text.toString())
            var password = RequestBody.create(MediaType.parse("text/plain"), edit_password.text.toString())
            var password2 = RequestBody.create(MediaType.parse("text/plain"), edit_password2.text.toString())
            var mailleft = RequestBody.create(MediaType.parse("text/plain"), edit_mailleft.text.toString())
            var mailright = RequestBody.create(MediaType.parse("text/plain"), edit_mailright.text.toString())
            var mailcert = RequestBody.create(MediaType.parse("text/plain"), edit_mailcert.text.toString())
            var bank = RequestBody.create(MediaType.parse("text/plain"), edit_bank.text.toString())
            var bankaccount = RequestBody.create(MediaType.parse("text/plain"), edit_bankaccount.text.toString())

            var router = RegisterClient.get()
            var call = router.post_register(sessionid, body, username, userid, password, password2, mailleft, mailright, mailcert, bank, bankaccount)
            call.enqueue(object: Callback<RegisterModel> {
                override fun onResponse(call: Call<RegisterModel>, res: Response<RegisterModel>) {
                    if (res.code() == 400) {
                        Toast.makeText(this@RegisterActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        return
                    }

                    // 서버가 사용자에게 보여줄 메시지가 있으면 출력
                    if (res.body()?.message != "") {
                        Toast.makeText(this@RegisterActivity, res.body()?.message, Toast.LENGTH_SHORT).show()
                    }

                    if (res.body()?.complete == true) {
                        Toast.makeText(this@RegisterActivity, res.body()?.userid + "님 회원가입 완료", Toast.LENGTH_SHORT).show()
                        finish()
                    }
                }

                override fun onFailure(call: Call<RegisterModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@RegisterActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })

        }
    }
}

