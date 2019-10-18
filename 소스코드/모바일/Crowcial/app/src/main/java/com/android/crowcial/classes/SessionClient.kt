package com.android.crowcial.classes

import com.android.crowcial.interfaces.SessionRouter

// SessionRouter 인터페이스에 명시된 REST API를 처리하는 클래스이다.
class SessionClient {
    companion object {
        var routerInterface: SessionRouter? = null

        fun get(): SessionRouter {
            if (routerInterface == null) {
                routerInterface = RetrofitClient.retrofit.create(SessionRouter::class.java)
            }

            return routerInterface!!
        }
    }
}