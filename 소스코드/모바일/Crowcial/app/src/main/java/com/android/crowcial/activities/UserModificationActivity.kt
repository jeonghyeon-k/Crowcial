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
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.classes.UserExitClient
import com.android.crowcial.classes.UserModificationClient
import com.android.crowcial.datas.*
import com.android.crowcial.methods.MethodClass
import kotlinx.android.synthetic.main.activity_user_modification.*
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream

class UserModificationActivity : AppCompatActivity() {
    companion object {
        var imgfile: File? = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_modification)

        // 기본적으로 보여줘야 할 내용들을 서버에서 가져옴
        var router = UserModificationClient.get()
        var call = router.get_user(RetrofitClient.usernum)

        call.enqueue(object: Callback<UserGetModel> {
            override fun onResponse(call: Call<UserGetModel>, res: Response<UserGetModel>) {
                Log.d("TEST", "onSuccess()")
                edit_name.text.append(res.body()?.username)
                edit_bank.text.append(res.body()?.userbank)
                edit_bankaccount.text.append(res.body()?.userbankaccount)

                // 사용자의 프로필 이미지 표시
                imgfile = LoginedActivity.imgfile // 기본적으로 처음 키면 LoginedActivity에서 불러왔던 이미지 파일과 같음
                if (LoginedActivity.bitmap != null) {
                    img_profile.setImageBitmap(LoginedActivity.bitmap)
                }
            }

            override fun onFailure(call: Call<UserGetModel>, t: Throwable) {
                Log.d("TEST", "onFailure()")
                Toast.makeText(this@UserModificationActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
            }
        })

        // 이벤트 등록
        btn_upload.setOnClickListener(UploadClick())
        btn_submit.setOnClickListener(SubmitOnClick())
        btn_userexit.setOnClickListener(WithdrawClick())
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
        // 인텐트를 통해 실행된 갤러리에서 파일을 정상적으로 선택하면 수행
        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {

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
                //imageView3.setImageBitmap(img)
                img_profile.setImageBitmap(BitmapFactory.decodeFile(imgfile?.path))
            }
        }
    }

    // 가입 버튼 클릭 이벤트 리스너
    inner class SubmitOnClick : View.OnClickListener {
        @Override
        override fun onClick(v: View?) {
            if (edit_name.text.length == 0) {
                Toast.makeText(this@UserModificationActivity, "이름을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_password.text.length == 0) {
                Toast.makeText(this@UserModificationActivity, "새로운 비밀번호를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_password.text.toString() != edit_password2.text.toString()) {
                Toast.makeText(this@UserModificationActivity, "비밀번호 확인을 알맞게 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_bank.text.length == 0) {
                Toast.makeText(this@UserModificationActivity, "은행 이름을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_bankaccount.text.length == 0) {
                Toast.makeText(this@UserModificationActivity, "계좌번호를 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }

            // 서버에 사용자 정보 업데이트 요청을 함
            var reqFile: RequestBody = RequestBody.create(MediaType.parse("/image/*"), imgfile)
            var body: MultipartBody.Part = MultipartBody.Part.createFormData("upload", imgfile?.name, reqFile)
            var usernum = RequestBody.create(MediaType.parse("text/plain"), RetrofitClient.usernum)
            var username = RequestBody.create(MediaType.parse("text/plain"), edit_name.text.toString())
            var password = RequestBody.create(MediaType.parse("text/plain"), edit_password.text.toString())
            var userbank = RequestBody.create(MediaType.parse("text/plain"), edit_bank.text.toString())
            var userbankaccount = RequestBody.create(MediaType.parse("text/plain"), edit_bankaccount.text.toString())

            var router = UserModificationClient.get()
            var call = router.post_user(body, usernum, username, password, userbank, userbankaccount)

            call.enqueue(object: Callback<UserPostModel> {
                override fun onResponse(call: Call<UserPostModel>, res: Response<UserPostModel>) {
                    Log.d("TEST", "onSuccess()")
                    Toast.makeText(this@UserModificationActivity, "회원 정보 수정 완료", Toast.LENGTH_SHORT).show()

                    // 사용자의 이름, 사진 등의 정보를 수정된 정보로 변경
                    RetrofitClient.username = edit_name.text.toString()
                    LoginedActivity.bitmap = BitmapFactory.decodeFile(imgfile?.path)

                    // 변경된 PW를 SharedPreferences에 저장해둠. (다음에 앱을 켰을때 자동 로그인)
                    val pref = getSharedPreferences("session", MODE_PRIVATE)
                    val editor = pref.edit()
                    editor.putString("password", edit_password.text.toString())
                    editor.commit()

                    setResult(1) // LoginedActivity의 showProjects()를 실행하도록 resultCode를 1로 설정
                    finish()
                }

                override fun onFailure(call: Call<UserPostModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@UserModificationActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })

        }
    }

    // 회원탈퇴 신청 버튼
    inner class WithdrawClick : View.OnClickListener {
        override fun onClick(v: View?) {
            var router = UserExitClient.get(); // 회원 탈퇴 신청 router 설정
            var call = router.post_userexit(RetrofitClient.usernum);

            call.enqueue(object: Callback<UserExitModel> {
                override fun onResponse(call: Call<UserExitModel>, res: Response<UserExitModel>) {
                    if (res.body()?.complete == false) {
                        Toast.makeText(this@UserModificationActivity, "회원탈퇴 신청 실패", Toast.LENGTH_LONG).show()
                        return
                    }
                    Toast.makeText(this@UserModificationActivity, "회원탈퇴 신청이 완료되었습니다.", Toast.LENGTH_LONG).show()
                }
                override fun onFailure(call: Call<UserExitModel>, t:Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@UserModificationActivity,"서버 연결 실패", Toast.LENGTH_LONG).show()
                }
            })
        }
    }
}
