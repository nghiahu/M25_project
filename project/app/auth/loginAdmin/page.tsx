"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoLockClosed, IoLogoPinterest } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'

export default function Page() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [warningEmail, setWarningEmail] = useState<boolean>(true);
  const [warningPass, setWarningPass] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<boolean>(false);

  const validUser = {
    email: "nghia120425@gmail.com",
    password: "nghia12345"
  };
  const router = useRouter();
  const handleLogin = () => {
    setWarningEmail(email !== '');
    setWarningPass(password !== '');

    if (email === '' || password === '') {
      return; 
    }

    if (email === validUser.email && password === validUser.password) {
      router.push('/admin/management')
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-8 bg-cover bg-center bg-no-repeat background-image: url('./public/Assets/images/energy-broker-crm+(1).png')">
      <div className="flex justify-center items-center text-[#e4dede] font-bold text-4xl gap-1 w-full">
        <IoLogoPinterest /> Đăng nhập quản lý
      </div>
      <div className="border border-gray-500 rounded-md w-1/3 bg-white p-8">
        <div className={`text-red-500 underline bg-[#ebebbb] p-2 w-4/5 mx-auto text-sm ${loginError ? '' : 'hidden'}`}>
          Email hoặc mật khẩu không đúng, vui lòng thử lại.
        </div>
        <div className="relative mb-6 ml-5">
          <MdEmail className="absolute top-2 left-0 text-gray-700" />
          <input
            className="w-5/6 mt-8 h-9 border-b border-gray-600 pl-6 outline-none"
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={warningEmail ? "hidden" : "absolute text-red-500 underline text-xs mt-2 left-1"}>Email không được để trống</div>
        </div>
        <div className="relative mb-6 ml-5">
          <IoLockClosed className="absolute top-2 left-0 text-gray-700" />
          <input
            className="w-5/6 mt-8 h-9 border-b border-gray-600 pl-6 outline-none"
            type="password"
            placeholder='Mật khẩu'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={warningPass ? "hidden" : "absolute text-red-500 underline text-xs mt-2 left-1"}>Mật khẩu không được để trống</div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="bg-gradient-to-l from-gray-800 to-white text-white font-semibold px-8 py-2 border border-white transition-all hover:bg-white hover:text-gray-800 hover:border-gray-800"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  )
}
