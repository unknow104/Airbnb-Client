import React from 'react';
import { openNotificationIcon } from '../NotificationIcon/NotificationIcon';

import './Banner.scss';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
function Banner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toHostPage = () => {
    navigate('/register-owner');
  }
  return (
    <div className="w-full relative lg:rounded-[1.2rem]  py-[8rem] flex items-center overflow-hidden">
      <img
        src="https://images.squarespace-cdn.com/content/v1/5e72c8bfe21ad940ba788673/1626985544757-CHEO1GWU6S7KC4Y5VJCE/what-is-airbnb-thumbnail.jpg"
        alt=""
        className="absolute w-full h-full object-cover"
      />
      <div className="overlay w-full h-full absolute top-0 left-0"></div>
      <div className="flex mb:justify-center sm:justify-center lg:justify-start lg:pl-[10rem] z-10 mb:w-full sm:w-full lg:w-auto">
        <div className="mb:text-center sm:text-center lg:text-left">
          <h1 className="text-[3rem] font-bold text-white">Trở thành chủ nhà</h1>
          <p className="text-white text-[0.8rem] font-[500] mb-4 mt-2">
            Kiếm thêm thu nhập và kết thêm nhiều bạn mới <br />{' '}
            bằng cách chia sẻ không gian của bạn.
          </p>
          <button onClick={toHostPage} className="font-bold text-[0.8rem] rounded-[0.5rem] py-[0.8rem] px-[1.2rem] bg-white">
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
