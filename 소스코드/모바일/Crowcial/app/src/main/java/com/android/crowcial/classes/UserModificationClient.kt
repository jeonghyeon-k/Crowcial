package com.android.crowcial.classes

import com.android.crowcial.interfaces.UserModificationRouter

// RegisterRouter 인터페이스에 명시된 REST API를 처리하는 클래스이다.
class UserModificationClient {
    companion object {
        var routerInterface: UserModificationRouter? = null

        fun get(): UserModificationRouter {
            if (routerInterface == null) {
                routerInterface = RetrofitClient.retrofit.create(UserModificationRouter::class.java)
            }

            return routerInterface!!
        }
    }
}