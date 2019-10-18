package com.android.crowcial.classes

import com.android.crowcial.interfaces.LoginRouter

// LoginRouter 인터페이스에 명시된 REST API를 처리하는 클래스이다.
class LoginClient {
    companion object {
        var routerInterface: LoginRouter? = null

        fun get(): LoginRouter {
            if (routerInterface == null) {
                routerInterface = RetrofitClient.retrofit.create(LoginRouter::class.java)
            }

            return routerInterface!!
        }
    }
}