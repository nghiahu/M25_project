import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faBell, faMagnifyingGlass, faUser,faBagShopping,faEnvelope} from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, } from "@/components/ui/navigation-menu"
import Link from 'next/link';
import { FaFacebookSquare, FaInstagramSquare, FaTiktok, FaTwitter } from 'react-icons/fa';
export default function Page() {
  return (
   <>
    <div className='bg-black flex justify-center'>
        <div className='bg-black flex w-[90%] justify-between py-[10px] text-sm'>
        <div className='flex text-white '>
            <div>Hotline mua hàng: 096432864 (8:00 - 11:00, Tất cả các ngày trong tuần)</div>
            <div className='pl-3 border-l-2 ml-3 cursor-pointer' >Liên hệ</div>
        </div>
        <div className='flex text-white items-center gap-3'>
            <div className='relative'>
            <FontAwesomeIcon className='cursor-pointer' icon={faBell} height={20} width={20}/>
            <div className='absolute bg-red-700 w-5 h-5 grid  rounded-full place-content-center left-2 bottom-1 '>0</div>
            </div>
            <div className='cursor-pointer'>Thông báo của tôi</div>
        </div>
        </div>
    </div>

<div className='flex justify-center border border-gray-300'>
    <div className='flex w-[90%] py-3 '>
        <div>
            <Image className='cursor-pointer' src="https://theme.hstatic.net/200000690725/1001078549/14/logo.png?v=447" alt='' height={220} width={220}></Image>
        </div>
        <div className='flex w-[75%] justify-center items-center gap-[4%] text-base font-semibold'>
            <div className='cursor-pointer'>Sản phẩm mới</div>
            <div className='cursor-pointer'>Sale</div>
            <div className='cursor-pointer'>
            <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                <NavigationMenuTrigger>Áo nam</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <div className='md:w-[100%] lg:w-[210px] p-2 text-gray-500 font-light flex flex-col gap-[10px]'>
                        <div><NavigationMenuLink>Áo Polo</NavigationMenuLink></div>
                        <div><NavigationMenuLink>Áo sơ mi</NavigationMenuLink></div>
                        <div><NavigationMenuLink>Áo thun</NavigationMenuLink></div>
                        <div><NavigationMenuLink>Áo khoác</NavigationMenuLink></div>
                        <div><NavigationMenuLink>Bộ nỉ</NavigationMenuLink></div>
                    </div>
                </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
            </NavigationMenu>
            </div>
            <div className='cursor-pointer'>
            <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                <NavigationMenuTrigger>Quần nam</NavigationMenuTrigger>
                <NavigationMenuContent>
                <div className='md:w-[100%] lg:w-[210px] p-2 text-gray-500 font-light flex flex-col gap-[10px]'>
                        <div><NavigationMenuLink>Quần dài kaki</NavigationMenuLink></div>
                        <div><NavigationMenuLink>Quần âu</NavigationMenuLink></div>
                        <div><NavigationMenuLink>Quần jeans</NavigationMenuLink></div>
                        <div><NavigationMenuLink>Quần short</NavigationMenuLink></div>
                    </div>
                </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
            </NavigationMenu>
            </div>
            <div className='cursor-pointer'>
            <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                <NavigationMenuTrigger>Bộ sưu tập</NavigationMenuTrigger>
                <NavigationMenuContent>
                <div className='md:w-[100%] lg:w-[210px] p-2 text-gray-500 font-light flex flex-col gap-[10px]'>
                        <div><NavigationMenuLink>Bộ sưu tập năm 2024</NavigationMenuLink></div>
                        <div><NavigationMenuLink>Bộ sưu tập năm 2023</NavigationMenuLink></div>
                        <div><NavigationMenuLink>Bộ sưu tập năm 2022</NavigationMenuLink></div>
                    </div>
                </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
            </NavigationMenu>
            </div>
            <div className='cursor-pointer'>Hệ thống cửa hàng</div>
        </div>
        <div className='flex items-center w-[10%] justify-between'>
        <FontAwesomeIcon className='cursor-pointer' icon={faMagnifyingGlass} height={22} width={22}/>
        <FontAwesomeIcon className='cursor-pointer' icon={faUser} height={22} width={22}/>
        <div className='relative cursor-pointer'>
        <FontAwesomeIcon icon={faBagShopping} height={22} width={22}/>
        <div className='absolute bg-red-600 w-5 h-5 grid  rounded-full place-content-center left-3 bottom-2 text-white cursor-pointer'>0</div>
        </div>
        </div>
    </div>
    </div>

    {/* End Header and Navigate */}

    <div className='mt-24 flex justify-center'>
        <div className='flex justify-center w-[20%] text-2xl antialiased font-semibold items-center gap-[7%] cursor-pointer'>
        <div>Đăng nhập</div>
        <div className='text-3xl font-thin'>|</div>
        <div className='text-gray-400 hover:text-black duration-500'>Đăng ký</div>
        </div>
    </div>
    <div className='flex justify-center '>
        <div  className='w-[40%] flex flex-col'>
            <div className='flex flex-col mt-10 gap-8'>
            <input type="text" className='w-[100%] h-14 bg-gray-200 pl-8 font-thin border border-gray-200 focus:bg-white outline-none' placeholder='Vui lòng nhập email của bạn'/>
            <input type="password" className='w-[100%] h-14 bg-gray-200 pl-8 font-thin border border-gray-200 focus:bg-white outline-none' placeholder='Vui lòng nhập mật khẩu của bạn'/>
            </div>
            <div className='flex mt-10 gap-7'>
                <button className='bg-black text-white font-semibold py-3 px-5 rounded-md'>Đăng nhập</button>
                <div className='flex flex-col justify-center gap-1'>
                    <div>Bạn chưa có tài khoản? <Link className='text-blue-500' href={""}> Đăng ký</Link></div>
                    <div>Bạn quên mật khẩu?<Link className='text-blue-500' href={""}> Quên mật khẩu?</Link></div>
                </div>
            </div>
        </div>
    </div>

    <div className='mt-28'>
    <div className="bg-slate-100 text-gray-600 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 pt-14 pb-8">
        <div>
          <h2 className="font-bold text-lg mb-3">Thời trang nam TORANO</h2>
          <p>Hệ thống thời trang cho phái mạnh hàng đầu Việt Nam, hướng tới phong cách nam tính, lịch lãm và trẻ trung.</p>
          <div className="flex space-x-3 mt-4 text-xl">
            <FaFacebookSquare className='h-5 w-6'/>
            <FaTwitter className='h-5 w-6'/>
            <FaInstagramSquare className='h-5 w-6'/>
            <FaTiktok className='h-5 w-6'/>
            <FontAwesomeIcon className='h-5 w-6' icon={faEnvelope} />
          </div>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-3">Thông tin liên hệ</h2>
          <p>Địa chỉ: Tầng 8, tòa nhà Ford, số 313 Trường Chinh, quận Thanh Xuân, Hà Nội</p>
          <p>Điện thoại: 0964942121</p>
          <p>Fax: 0904636356</p>
          <p>Email: cskh@torano.vn</p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-3">Nhóm liên kết</h2>
          <ul>
            <li>Tim kiếm</li>
            <li>Giới thiệu</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách bảo mật</li>
            <li>Tuyển dụng</li>
            <li>Liên hệ</li>
          </ul>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-3">Đăng ký nhận tin</h2>
          <div className="flex mt-1">
            <input type="text" className="p-2 border border-gray-300 rounded-l-lg flex-grow" placeholder="Nhập email của bạn" />
            <button className="bg-black text-white px-4 py-2 rounded-r-lg">ĐĂNG KÝ</button>
          </div>
        </div>
      </div>
    </div>
    </div>
   </>
  )
}
