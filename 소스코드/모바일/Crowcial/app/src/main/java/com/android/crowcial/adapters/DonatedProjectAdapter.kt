package com.android.crowcial.adapters

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.support.v4.content.ContextCompat.startActivity
import android.support.v7.widget.RecyclerView
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.android.crowcial.R
import com.android.crowcial.activities.ProjectDetailActivity
import com.android.crowcial.activities.RetrieveDialog
import com.android.crowcial.adapters.ProjectAdapter.Companion.activity
import com.android.crowcial.adapters.ProjectAdapter.Companion.context
import com.android.crowcial.datas.ProjectDonationLookupModel
import com.android.crowcial.datas.ProjectDonationLookupModelData
import com.android.crowcial.datas.ProjectGetModelData
import kotlinx.android.synthetic.main.list_item_donated_project.view.*

class DonatedProjectAdapter() : RecyclerView.Adapter<DonatedProjectAdapter.ItemViewHolder>() {
    companion object {
        // 여기서 context는 DonatedProjectActivity의 context
        var context: Context? = null
        var activity: Activity? = null
        var projects: List<ProjectDonationLookupModelData>? = null
        var projectCount: Int = 0
    }

    override fun getItemCount() = projectCount

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        val adapterView = LayoutInflater.from(parent.context).inflate(R.layout.list_item_donated_project, parent, false)
        return ItemViewHolder(adapterView)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        holder.bind(projects?.elementAt(position)!!, position)
    }

    inner class ItemViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        fun bind(data: ProjectDonationLookupModelData, position: Int) {

            // 리사이클러뷰에 올라갈 때 기본적은 정보들을 변경
            itemView.txt_name.text = data.project_name
            itemView.txt_money.text = data.money.toString()

            // 후원금 회수 아이콘을 클릭하면 회수할 금액을 입력받는 다이얼로그 액티비티를 띄워줌
            itemView.btn_moneyback.setOnClickListener {
                var intent = Intent(context, RetrieveDialog::class.java)
                intent.putExtra("projectnum", data.project_num)
                activity?.startActivityForResult(intent, 2)
            }

            // 상세보기 아이콘을 클릭하면 해당 프로젝트의 정보를 볼 수 있는 액티비티를 띄워줌
            itemView.btn_see.setOnClickListener {
                var intent = Intent(context, ProjectDetailActivity::class.java)
                intent.putExtra("projectnum", data.project_num)
                activity?.startActivityForResult(intent, 1)
            }
        }
    }
}