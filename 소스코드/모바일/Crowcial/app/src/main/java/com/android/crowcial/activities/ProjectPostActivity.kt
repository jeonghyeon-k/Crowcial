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
import com.android.crowcial.classes.ProjectClient
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.datas.ProjectModel
import com.android.crowcial.methods.MethodClass
import kotlinx.android.synthetic.main.activity_project_post.*
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import retrofit2.Callback
import retrofit2.Response

class ProjectPostActivity : AppCompatActivity() {
    companion object {
        var year: String = ""
        var month: String = ""
        var day: String = ""
        var imgfile: File? = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_project_post)

        year = ""
        month = ""
        day = ""
        imgfile = null

        btn_upload.setOnClickListener(UploadClick())
        img_date.setOnClickListener(DateClick())
        btn_submit.setOnClickListener(SubmitClick())
    }

    // 캘린더 액티비티에서 날짜를 클릭하면 txt_date를 수정함
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
                //edit_profile.setText(data?.getData()?.path)
                img_project.setImageBitmap(img)
            }
        }

        // 캘린더에서 날짜를 선택하면 실행
        if (resultCode == 2) {
            txt_date.text = year + "/" + month + "/" + day
        }
    }

    // 이미지 찾기 버튼 클릭 이벤트 리스너
    inner class UploadClick : View.OnClickListener {
        override fun onClick(v: View?) {
            var imageIntent = Intent(Intent.ACTION_PICK)
            imageIntent.setType(android.provider.MediaStore.Images.Media.CONTENT_TYPE)
            startActivityForResult(imageIntent, 1)
        }
    }

    // 캘린더 클릭 이벤트 리스너
    inner class DateClick: View.OnClickListener {
        override fun onClick(v: View?) {
            var intent = Intent(this@ProjectPostActivity, CalendarActivity::class.java)
            startActivityForResult(intent, 1)
        }
    }

    // 등록 버튼 클릭 이벤트 리스너
    inner class SubmitClick: View.OnClickListener {
        override fun onClick(v: View?) {
            if (edit_name.text.length == 0) {
                Toast.makeText(this@ProjectPostActivity, "이름을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_content.text.length == 0) {
                Toast.makeText(this@ProjectPostActivity, "내용을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (imgfile == null) {
                Toast.makeText(this@ProjectPostActivity, "프로젝트 이미지를 업로드해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (edit_money.text.length == 0) {
                Toast.makeText(this@ProjectPostActivity, "목표 금액을 입력해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }
            if (txt_date.text.length == 0) {
                Toast.makeText(this@ProjectPostActivity, "목표 날짜를 선택해주세요.", Toast.LENGTH_SHORT).show()
                return;
            }

            var reqFile: RequestBody = RequestBody.create(MediaType.parse("/image/*"), imgfile)
            var body: MultipartBody.Part = MultipartBody.Part.createFormData("upload", imgfile?.name, reqFile)
            var sessionid = RequestBody.create(MediaType.parse("text/plain"), RetrofitClient.sessionid)
            var usernum = RequestBody.create(MediaType.parse("text/plain"), RetrofitClient.usernum)
            var name = RequestBody.create(MediaType.parse("text/plain"), edit_name.text.toString())
            var content = RequestBody.create(MediaType.parse("text/plain"), edit_content.text.toString())
            var money = RequestBody.create(MediaType.parse("text/plain"), edit_money.text.toString())
            var category = RequestBody.create(MediaType.parse("text/plain"), (spinner.selectedItemId + 1).toString())
            var year = RequestBody.create(MediaType.parse("text/plain"), year)
            var month = RequestBody.create(MediaType.parse("text/plain"), month)
            var day = RequestBody.create(MediaType.parse("text/plain"), day)

            var router = ProjectClient.get()
            var call = router.post_project_content(sessionid, usernum, name, content, body, money, category, year, month, day)

            call.enqueue(object: Callback<ProjectModel> {
                override fun onResponse(call: Call<ProjectModel>, res: Response<ProjectModel>) {
                    if (res.code() == 400) {
                        Toast.makeText(this@ProjectPostActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        return
                    }
                    if (res.body()?.complete == false) {
                        Toast.makeText(this@ProjectPostActivity, "프로젝트 등록 실패", Toast.LENGTH_SHORT).show()
                        return
                    }

                    Toast.makeText(this@ProjectPostActivity, "프로젝트 등록 성공!", Toast.LENGTH_SHORT).show()
                    setResult(1)
                    finish()
                }

                override fun onFailure(call: Call<ProjectModel>, t: Throwable) {
                    Log.d("TEST", "onFailure()")
                    Toast.makeText(this@ProjectPostActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }
}
