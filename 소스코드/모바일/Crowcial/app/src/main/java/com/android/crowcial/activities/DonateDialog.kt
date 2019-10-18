package com.android.crowcial.activities

import android.content.Context
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.Display
import android.view.View
import android.view.Window
import android.widget.Toast
import com.android.crowcial.R
import com.android.crowcial.classes.RetrofitClient
import kotlinx.android.synthetic.main.activity_donate_dialog.*
import android.view.WindowManager





class DonateDialog : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(com.android.crowcial.R.layout.activity_donate_dialog)

        // 다이얼로그가 화면에 표시될 위치와 크기 지정
        setTitle("")
        val display = (getSystemService(Context.WINDOW_SERVICE) as WindowManager).defaultDisplay
        val width = (display.width * 1.0) //Display 사이즈의 100%
        val height = (display.height * 0.4)  //Display 사이즈의 40%
        window.attributes.width = width.toInt()
        window.attributes.height = height.toInt()

        //this.window.setLayout(1600, 1300)
        /*val params = window.attributes
        params.width = 1000
        params.height = 700
        params.x = -20
        params.y = -10
        this.window.attributes = params*/

        // 이벤트 등록
        btn_ok.setOnClickListener(OkClick())
        btn_cancel.setOnClickListener(CancelClick())
    }

    inner class OkClick : View.OnClickListener {
        override fun onClick(v: View?) {
            if (edit_money.text.length == 0) {
                Toast.makeText(this@DonateDialog, "금액을 입력해주세요", Toast.LENGTH_SHORT).show()
                return
            }
            if (edit_money.text.toString() == "0") {
                Toast.makeText(this@DonateDialog, "금액을 입력해주세요", Toast.LENGTH_SHORT).show()
                return
            }
            if (RetrofitClient.usermoney < edit_money.text.toString().toLong()) {
                Toast.makeText(this@DonateDialog, "소지 금액이 부족합니다.", Toast.LENGTH_SHORT).show()
                return
            }

            ProjectDetailActivity.donateMoney = edit_money.text.toString().toLong()
            setResult(1) // ProjectDetailActivity에 resultCode 1로 응답
            finish()
        }
    }

    inner class CancelClick : View.OnClickListener {
        override fun onClick(v: View?) {
            finish()
        }
    }
}
