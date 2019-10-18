package com.android.crowcial.classes

import com.android.crowcial.interfaces.ProjectRouter

// RegisterRouter 인터페이스에 명시된 REST API를 처리하는 클래스이다.
class ProjectClient {
    companion object {
        var routerInterface: ProjectRouter? = null

        fun get(): ProjectRouter {
            if (routerInterface == null) {
                routerInterface = RetrofitClient.retrofit.create(ProjectRouter::class.java)
            }

            return routerInterface!!
        }
    }
}