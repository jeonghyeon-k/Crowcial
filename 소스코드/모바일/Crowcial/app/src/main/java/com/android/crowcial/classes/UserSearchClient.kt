package com.android.crowcial.classes

import com.android.crowcial.interfaces.LoginRouter
import com.android.crowcial.interfaces.UserSearchRouter

// LoginRouter 인터페이스에 명시된 REST API를 처리하는 클래스이다.
class UserSearchClient {
    companion object {
        var routerInterface: UserSearchRouter? = null

        fun get(): UserSearchRouter {
            if (routerInterface == null) {
                routerInterface = RetrofitClient.retrofit.create(UserSearchRouter::class.java)
            }

            return routerInterface!!
        }
    }
}