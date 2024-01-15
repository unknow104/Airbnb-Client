import React from 'react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { localStorageService } from '../../services/localStorageService';
import { useEffect } from 'react';
import { userService } from '../../services/userService';
import Footer from '../../Components/Footer/Footer';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { openNotificationIcon } from '../../Components/NotificationIcon/NotificationIcon';

export const HostPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [infor, setinfor] = useState({})
    const [user, setuser] = useState(localStorageService.get('USER'));
    useEffect(() => {
        getUser();
    }, []);
    const getUser = () => {
        userService
            .getInformation(user?.userDTO?.id)
            .then((res) => {
                setinfor(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const updatehost = () => {
        userService
            .setHost(user?.userDTO?.id)
            .then((res) => {
                openNotificationIcon('success', 'Thành công', 'Đăng kí lên host thành công')
                // Thay đổi giá trị của role thành 'OWNER'
                user.userDTO.role[0] = 'OWNER';
                // Lưu lại giá trị mới vào localStorage
                localStorageService.set('USER', user);

                navigate('/')
            })
            .catch((err) => {
                openNotificationIcon('error', 'Lỗi', 'Vui lòng thử lại')
            })
    }
    return (
        <div>
            <div className='mt-4 mx-10 justify-between flex'>
                <div className='mt-3'>
                    <NavLink to="/">
                        <img
                            alt="airbnb.png"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png"
                            className='w-[7rem]'
                        />
                    </NavLink>
                </div>
                <div className='mt-1 justify-between flex text-lg'>
                    <p className='mt-3 mx-5 font-semibold'>Xin chào, {infor?.name}</p>
                    <button
                        onClick={updatehost}
                        className=' mb-1 p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl'
                    >
                        Đăng ký cho thuê
                    </button>
                </div>
            </div>
            <hr className='mt-2' />
            <div className='mt-4'>
                <div className='mx-auto mt-5 text-center'>
                    <h1 className='text-4xl font-bold'>
                        Đăng ký trở thành đối tác của Panther
                    </h1>
                    <img
                        className='mt-8 w-[1480px]'
                        src='https://a0.muscache.com/im/pictures/65214d06-ffb4-4b70-93c0-01d368e76649.jpg?im_w=2560&im_q=highq'
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}
