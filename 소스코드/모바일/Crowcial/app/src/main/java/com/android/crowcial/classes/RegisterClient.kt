package com.android.crowcial.classes

import com.android.crowcial.interfaces.RegisterRouter

// RegisterRouter 인터페이스에 명시된 REST API를 처리하는 클래스이다.
class RegisterClient {
    companion object {
        var routerInterface: RegisterRouter? = null

        fun get(): RegisterRouter {
            if (routerInterface == null) {
                routerInterface = RetrofitClient.retrofit.create(RegisterRouter::class.java)
            }

            return routerInterface!!
        }
    }
}