package com.android.crowcial.activities

import android.app.ProgressDialog
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.BottomNavigationView
import android.support.v7.widget.LinearLayoutManager
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.widget.AdapterView
import android.widget.Toast
import com.android.crowcial.R
import com.android.crowcial.adapters.ProjectAdapter
import com.android.crowcial.classes.LoginClient
import retrofit2.Callback
import com.android.crowcial.classes.ProjectClient
import com.android.crowcial.classes.RetrofitClient
import com.android.crowcial.datas.LoginUserMoneyModel
import com.android.crowcial.datas.ProjectGetModel
import kotlinx.android.synthetic.main.activity_logined.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream

class LoginedActivity : AppCompatActivity() {
    companion object {
        var imgfile: File? = null
        var bitmap: Bitmap? = null
        var loadingDialog: ProgressDialog? = null
        var loadCount: Int = 0
        var gotoDonatedProject: Boolean = false
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_logined)

        ProjectAdapter.context = this
        ProjectAdapter.activity = this

        // 이벤트 등록
        spin_category.setOnItemSelectedListener(CategorySelected())
        spin_sort.setOnItemSelectedListener(SortSelected())
        nav_bottom.setOnNavigationItemSelectedListener(BottomNavigationClick())
        btn_logout.setOnClickListener(LogoutClick())
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        Log.d("TEST", "LoginedActivity onActivityResult() " + resultCode)
        when (resultCode) {
            1 -> {
                showProjects()
            }
            2 -> {
                // 후원금 회수가 완료되면 사용자의 돈을 새롭게 표시하고 다시 후원한 프로젝트의 액티비티를 실행
                var router = LoginClient.get()
                var call = router.get_usermoney(RetrofitClient.usernum)

                call.enqueue(object: Callback<LoginUserMoneyModel> {
                    override fun onResponse(call: Call<LoginUserMoneyModel>, res: Response<LoginUserMoneyModel>) {
                        RetrofitClient.usermoney = res.body()?.money!!
                        txt_money.text = String.format("%,d", res.body()?.money)
                        //txt_money.text = res.body()?.money.toString()

                        // 후원한 프로젝트 액티비티 실행
                        gotoDonatedProject = true
                        showProjects()
                    }

                    override fun onFailure(call: Call<LoginUserMoneyModel>, t: Throwable) {
                        Log.d("TEST", "onFailure()")
                        Toast.makeText(this@LoginedActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                    }
                })
            }
        }
    }

    // 메인 화면에서 보여줘야 할 정보들을 보여주는 작업을 함
    fun showProjects() {
        // loadingDialog가 null이 아니면 이미 화면이 로딩중이므로 return 시킨다.
        if (loadingDialog != null) {
            return
        }

        loadingDialog = ProgressDialog(this@LoginedActivity)
        loadingDialog?.setTitle("로딩중")
        loadingDialog?.setMessage("조금만 기다려주세요...")
        loadingDialog?.show()

        // 사용자의 이름 표시
        txt_userid.text = RetrofitClient.username

        // 사용자의 프로필 이미지 표시
        if (bitmap != null) {
            img_profile.setImageBitmap(bitmap)
        }

        // 사용자의 돈 표시
        var router = LoginClient.get()
        var call = router.get_usermoney(RetrofitClient.usernum)

        call.enqueue(object: Callback<LoginUserMoneyModel> {
            override fun onResponse(call: Call<LoginUserMoneyModel>, res: Response<LoginUserMoneyModel>) {
                RetrofitClient.usermoney = res.body()?.money!!
                txt_money.text = String.format("%,d", res.body()?.money)
                //txt_money.text = res.body()?.money.toString()
            }

            override fun onFailure(call: Call<LoginUserMoneyModel>, t: Throwable) {
                Log.d("TEST", "onFailure()")
                Toast.makeText(this@LoginedActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
            }
        })

        // 리사이클러뷰에 프로젝트들 정보 표시
        var router2 = ProjectClient.get()
        var call2 = router2.get_project_content(RetrofitClient.usernum, spin_category.selectedItemId, spin_sort.selectedItemId)

        call2.enqueue(object: Callback<ProjectGetModel> {
            override fun onResponse(call: Call<ProjectGetModel>, res: Response<ProjectGetModel>) {

                ProjectAdapter.projectCount = res.body()?.projects?.size!!
                ProjectAdapter.projects = res.body()?.projects
                ProjectAdapter.positions = Array<Int>(10000, { i -> 0 }) // 프로젝트의 번호를 가지고 position 위치를 알 수 있는 배열 변수이다.
                ProjectAdapter.bitmaps = Array<Bitmap?>(ProjectAdapter.projectCount, {i -> null})
                loadCount = 0

                // 보여줄 프로젝트가 없으면 로딩 다이얼로그 취소
                if (ProjectAdapter.projectCount == 0) {
                    recyclerView_project.adapter = ProjectAdapter()
                    recyclerView_project.layoutManager = LinearLayoutManager(this@LoginedActivity)
                    loadingDialog?.cancel()
                    loadingDialog = null
                }

                // 프로젝트의 이미지를 비트맵으로 가져옴
                for (i in 0..ProjectAdapter.projectCount.minus(1)) {
                    var router = ProjectClient.get()
                    var call = router.get_projectImage(ProjectAdapter.projects?.elementAt(i)?.project_image!!)

                    call.enqueue(object: Callback<ResponseBody> {
                        override fun onResponse(call: Call<ResponseBody>, res: Response<ResponseBody>) {
                            if (res.isSuccessful) {
                                // 캐시에서 project라는 이름으로 파일을 생성
                                var imgfile: File = File(cacheDir, "project")
                                imgfile?.createNewFile()

                                // 파일을 읽고 LoginedActivity의 imgfile, bitmap에 저장함
                                var inputStream: InputStream? = null
                                var outputStream: FileOutputStream? = null
                                val fileReader = ByteArray(4096)
                                val fileSize = res.body()?.contentLength()
                                var fileSizeDownloaded: Long = 0

                                inputStream = res.body()?.byteStream()
                                outputStream = FileOutputStream(imgfile)

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
                                var bitmap = BitmapFactory.decodeFile(imgfile?.path)
                                ProjectAdapter.bitmaps?.set(i, bitmap)
                                loadCount++

                                if (loadCount >= ProjectAdapter.projectCount) {
                                    // 리사이클러뷰의 어댑터 생성하고 적용
                                    recyclerView_project.adapter = ProjectAdapter()
                                    recyclerView_project.layoutManager = LinearLayoutManager(this@LoginedActivity)

                                        GlobalScope.launch(Dispatchers.Main) {
                                            // 리사이클러뷰의 모든 아이템을 bind 해주기 위해서 위치를 일일히 바꿔준다.
                                            for (i in 0..ProjectAdapter.projectCount-1) {
                                                recyclerView_project.scrollToPosition(i)
                                                delay(10)
                                            }

                                            recyclerView_project.scrollToPosition(0)
                                            delay(10)
                                            loadingDialog?.cancel()
                                            loadingDialog = null

                                            // 후원한 프로젝트 목록을 보여줌
                                            if (gotoDonatedProject) {
                                                gotoDonatedProject = false
                                                var intent = Intent(this@LoginedActivity, DonatedProjectActivity::class.java)
                                                startActivityForResult(intent, 1)
                                            }
                                        }
                                }

                            }
                        }

                        override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                            Log.d("TEST", "onFailure()")
                            t.printStackTrace()
                            Toast.makeText(this@LoginedActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
                        }
                    })
                }
            }

            override fun onFailure(call: Call<ProjectGetModel>, t: Throwable) {
                Log.d("TEST", "onFailure()")
                t.printStackTrace()
                Toast.makeText(this@LoginedActivity, "서버 연결 실패", Toast.LENGTH_SHORT).show()
            }
        })
    }

    inner class CategorySelected : AdapterView.OnItemSelectedListener {
        override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
            showProjects()
        }

        override fun onNothingSelected(parent: AdapterView<*>?) {

        }
    }

    inner class SortSelected : AdapterView.OnItemSelectedListener {
        override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
            showProjects()
        }

        override fun onNothingSelected(parent: AdapterView<*>?) {

        }
    }

    // 바텀 네비게이션뷰 아이템 클릭 이벤트 등록
    inner class BottomNavigationClick : BottomNavigationView.OnNavigationItemSelectedListener {
        override fun onNavigationItemSelected(item: MenuItem): Boolean {
            when (item.itemId) {
                // 사용자가 후원한 프로젝트들의 목록과 금액을 보여줌
                R.id.item_givedproject -> {
                    gotoDonatedProject = true // showProjects() 메소드 안에서 gotoDonatedProject가 true이면 false로 바꾸고 후원한 프로젝트 액티비티를 띄워준다.
                    spin_category.setSelection(0)
                    showProjects()
                }
                // 프로젝트 등록 액티비티를 띄워줌
                R.id.item_post -> {
                    var intent = Intent(this@LoginedActivity, ProjectPostActivity::class.java)
                    startActivityForResult(intent, 1)
                }
                // 사용자의 정보를 수정할 수 있는 액티비티를 띄워줌
                R.id.item_user -> {
                    var intent = Intent(this@LoginedActivity, UserModificationActivity::class.java)
                    startActivityForResult(intent, 1)
                }
            }

            return true
        }
    }

    // 로그아웃 버튼
    inner class LogoutClick : View.OnClickListener {
        override fun onClick(v: View?) {
            RetrofitClient.usernum = ""
            RetrofitClient.userid = ""
            RetrofitClient.username = ""
            RetrofitClient.usermoney = 0
            RetrofitClient.imagename = ""

            // 저장된 ID와 PW를 SharedPreferences에서 지움
            val pref = getSharedPreferences("session", MODE_PRIVATE)
            val editor = pref.edit()
            editor.clear()
            editor.commit()

            // 기존의 모든 액티비티를 닫고 새로운 액티비티를 시작함
            finishAffinity()
            val intent = Intent(this@LoginedActivity, MainActivity::class.java)
            startActivity(intent)
        }
    }
}
