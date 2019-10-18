package com.android.crowcial.activities

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import com.android.crowcial.R
import kotlinx.android.synthetic.main.activity_calendar.*

class CalendarActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_calendar)

        calendarView.setOnDateChangeListener { view, year, month, dayOfMonth ->
            ProjectPostActivity.year = year.toString()
            if (month+1 < 10) {
                ProjectPostActivity.month = "0" + (month+1).toString() // 월은 1을 더해줘야 해당 월이 나오는듯 하다
            } else {
                ProjectPostActivity.month = (month+1).toString()
            }

            if (dayOfMonth < 10) {
                ProjectPostActivity.day = "0" + dayOfMonth.toString()
            } else {
                ProjectPostActivity.day = dayOfMonth.toString()
            }
            var date = ProjectPostActivity.year + "/" + ProjectPostActivity.month + "/" + ProjectPostActivity.day
            Log.d("Calendar", date)
            setResult(2)
            finish()
        }
    }
}
