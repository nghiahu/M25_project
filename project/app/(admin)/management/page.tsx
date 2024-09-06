"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { BiReset, BiSolidCategory } from 'react-icons/bi';
import { BsFillPersonFill, BsGraphDownArrow, BsGraphUpArrow } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa';
import { FaCartFlatbed } from 'react-icons/fa6';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { LuSearch } from 'react-icons/lu';
import { MdAttachMoney, MdSpaceDashboard } from 'react-icons/md';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const data: any = useSelector((state: any) => state);

  const handleLogout = () => {
    localStorage.removeItem('LogInId');
    router.push("/loginAdmin");
  };

  useEffect(() => {
    const idLogin = localStorage.getItem('LogInId');
    if (!idLogin) {
      router.push("/loginAdmin");
    }
    // dispatch(getAllUser());
    // console.log(data);
  }, []);

  const isProductpage = false;
  const isUserpage = false;
  const isOrderpage = false;
  const isAdminpage = true; 
  const isAdminCategory = false;

  return (
    <div className='bg-gray-300 h-screen w-full'>
      <div className='w-1/5 h-screen bg-gray-900 fixed'>
        <div className='text-white text-2xl font-bold flex items-center gap-2 ml-10 py-10'>
          Torano
        </div>
        <div className='space-y-4'>
          <Link href="/admin" className={`${isProductpage || isUserpage || isOrderpage || isAdminCategory ? 'text-gray-500' : 'text-white'} flex items-center gap-4 py-2 px-6`}>
            <MdSpaceDashboard />Bảng điều khiển
          </Link>
          <Link href="/adUser" className='flex items-center gap-4 text-gray-500 py-2 px-6'><FaUsers />Người dùng</Link>
          <Link href="/adProduct" className='flex items-center gap-4 text-gray-500 py-2 px-6'><FaCartFlatbed />Sản phẩm</Link>
          <Link href="/adOrder" className='flex items-center gap-4 text-gray-500 py-2 px-6'><HiClipboardDocumentList />Đơn hàng</Link>
          <Link href="/adCategory" className='flex items-center gap-4 text-gray-500 py-2 px-6'><BiSolidCategory />Danh mục</Link>
        </div>
        <hr className='border-gray-600 my-8 mx-6'/>
        <div className='flex items-center text-gray-500 gap-4 px-6 cursor-pointer' onClick={handleLogout}>
          <RiLogoutBoxRLine />Đăng xuất
        </div>
      </div>

      <div className='ml-1/5'>
        <div className='flex bg-gray-200 h-16 items-center'>
          <div className='text-xl font-bold pl-20 w-1/2'>
            {isAdminpage ? 'Welcome back' : (isProductpage ? 'Sản phẩm' : (isUserpage ? 'Người dùng' : (isOrderpage ? 'Đơn hàng' : 'Danh mục')))}
          </div>
          <div className='flex items-center w-1/2'>
            <div className='relative flex-1 pl-16'>
              <LuSearch className='absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500' />
              <input type="text" placeholder='Search' className='h-10 rounded-full pl-12 pr-4 bg-gray-300 w-full outline-none' />
            </div>
            <IoMdNotificationsOutline className='text-2xl mx-6'/>
            <div className='flex items-center gap-3'>
              <img className='w-12 h-12 rounded-full bg-gray-500' src="/Assets/images/account-icon-8.png" alt=""/>
              <div className='font-medium'>Pinyin</div>
            </div>
          </div>
        </div>

        {isAdminpage && !isProductpage && !isUserpage && !isOrderpage && !isAdminCategory && (
          <div className='flex gap-6 mt-6'>
            <div className='flex-1 space-y-6'>
   
              <div className='bg-gray-900 text-white rounded-xl p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <MdAttachMoney className='text-6xl'/>
                    <div>
                      <div className='text-xl font-bold'>Tổng lợi nhuận</div>
                      <div className='text-gray-400'>731 đơn hàng</div>
                    </div>
                  </div>
                  <div className='text-4xl font-bold'>$9,328.55</div>
                </div>
                <div className='flex gap-6 mt-4'>
                  <div className='flex items-center gap-2'>
                    <BsGraphUpArrow className='text-green-500'/>+15.6%
                  </div>
                  <div className='flex items-center gap-2'>
                    +1.4k <span>trong tuần</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-6 w-1/3'>
              <div className='text-lg font-bold mb-4'>Danh mục hàng đầu</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
