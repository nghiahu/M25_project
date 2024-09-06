"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { BiReset, BiSolidCategory } from 'react-icons/bi'
import { BsFillPersonFill, BsGraphDownArrow, BsGraphUpArrow } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa'
import { FaCartFlatbed } from 'react-icons/fa6'
import { HiClipboardDocumentList } from 'react-icons/hi2'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { LuSearch } from 'react-icons/lu'
import { MdAttachMoney, MdSpaceDashboard } from 'react-icons/md'
import { RiLogoutBoxRLine } from 'react-icons/ri'

export default function page() {
  const isProductpage = "";
  const isUserpage = "";
  const isOrderpage = "";
  const isAdminpage = "";
  const isAdminCategory = "";
  const router = useRouter();
  const handleLout=()=>{
    router.push("/auth/loginAdmin")
  }
  return (
    <>
    <div className='bg-gray-300 h-screen w-full'>
      <div className='w-1/5 h-screen bg-gray-900 fixed'>
        <div className='text-white text-2xl font-bold flex items-center gap-2 ml-10 py-10'>
          Torano
        </div>
        <div className='space-y-4'>
          <Link href="/admin" className={`${isProductpage || isUserpage || isOrderpage || isAdminCategory && isAdminpage ? 'text-gray-500' : 'text-white'} flex items-center gap-4 py-2 px-6`}>
            <MdSpaceDashboard />Bảng điều khiển
          </Link>
          <Link href="adUser" className='flex items-center gap-4 text-gray-500 py-2 px-6'><FaUsers />Người dùng</Link>
          <Link href="adProduct" className='flex items-center gap-4 text-gray-500 py-2 px-6'><FaCartFlatbed />Sản phẩm</Link>
          <Link href="adOrder" className='flex items-center gap-4 text-gray-500 py-2 px-6'><HiClipboardDocumentList />Đơn hàng</Link>
          <Link href="adCategory" className='flex items-center gap-4 text-gray-500 py-2 px-6'><BiSolidCategory />Danh mục</Link>
        </div>
        <hr className='border-gray-600 my-8 mx-6'/>
        <div className='flex items-center text-gray-500 gap-4 px-6' onClick={handleLout}>
          <RiLogoutBoxRLine />Đăng xuất
        </div>
      </div>

      <div className='ml-1/5'>
        <div className='flex bg-gray-200 h-16 items-center'>
          <div className='text-xl font-bold pl-20 w-1/2'>
            {isAdminpage && !isProductpage && !isUserpage && !isOrderpage && !isAdminCategory ? 'Welcome back' :
              (isProductpage ? 'Sản phẩm' : (isUserpage ? 'Người dùng' : (isOrderpage ? 'Đơn hàng' : 'Danh mục')))}
          </div>
          <div className='flex items-center w-1/2'>
            <div className='relative flex-1 pl-16'>
              <LuSearch className='absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500' />
              <input type="text" placeholder='Search' className='h-10 rounded-full pl-12 pr-4 bg-gray-300 w-full outline-none' />
            </div>
            <IoMdNotificationsOutline className='text-2xl mx-6'/>
            <div className='flex items-center gap-3'>
              <img className='w-12 h-12 rounded-full bg-gray-500' src="\public\Assets\images\account-icon-8.png" alt=""/>
              <div className='font-medium'>Pinyin</div>
            </div>
          </div>
        </div>

        <div>
          {!isProductpage && !isUserpage && !isOrderpage && !isAdminCategory && isAdminpage ? (
            <>
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

                  <div className='bg-white rounded-xl p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <BsFillPersonFill className='text-6xl'/>
                        <div>
                          <div className='text-xl font-bold'>Lượng truy cập</div>
                          <div className='text-gray-500'>Thời gian trung bình: 4:30</div>
                        </div>
                      </div>
                      <div className='text-4xl font-bold'>12,302</div>
                    </div>
                    <div className='flex gap-6 mt-4'>
                      <div className='flex items-center gap-2'>
                        <BsGraphUpArrow className='text-green-500'/>+12.7%
                      </div>
                      <div className='flex items-center gap-2'>
                        +1.2k <span>trong tuần</span>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white rounded-xl p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <BiReset className='text-6xl'/>
                        <div>
                          <div className='text-xl font-bold'>Đơn hàng</div>
                          <div className='text-gray-500'>2 Hủy đơn</div>
                        </div>
                      </div>
                      <div className='text-4xl font-bold'>$963</div>
                    </div>
                    <div className='flex gap-6 mt-4'>
                      <div className='flex items-center gap-2'>
                        <BsGraphDownArrow className='text-red-500'/>-12.7%
                      </div>
                      <div className='flex items-center gap-2'>
                        -213 <span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-xl p-6 w-1/3'>
                  <div className='text-lg font-bold mb-4'>Danh mục hàng đầu</div>
                  {/* <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer> */}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

