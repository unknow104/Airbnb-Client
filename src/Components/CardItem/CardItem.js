import React, { useEffect, useState } from 'react';
import './CardItem.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaStar, FaHeart } from 'react-icons/fa';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image } from 'antd';
import { localStorageService } from '../../services/localStorageService';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/vi';
import { favoriteService } from '../../services/favoriteService';


function CardItem({ roomInfor }) {
  // Đặt múi giờ cho Việt Nam
  moment.locale('vi');
  moment.tz.setDefault('Asia/Ho_Chi_Minh');
  const { t } = useTranslation();
  const [user, setuser] = useState(localStorageService.get('USER')?.userDTO);
  const [isLiked, setIsLiked] = useState(false); // Thêm state để theo dõi trạng thái like
  // Kiểm tra người dùng đã like chưa
  const checkIfLiked = async (roomId) => {
    try {
      const response = await favoriteService.get(user.id);
      const wishlistItems = response.data;
      // Kiểm tra xem roomId có trong danh sách mong muốn không
      const isLiked = wishlistItems.some(item => item.roomDTO.id === roomId);
      
      if (isLiked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error checking if liked:', error);
    }
  }
  // Định dạng giá thành VND
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(roomInfor.price);
  const [isNewRoom, setIsNewRoom] = useState(false);
  useEffect(() => {
    const tinhSoNgayChenhLech = (timestamp) => {
      const ngayHienTai = new Date();
      let ngayTaoPhong;
      if (typeof timestamp === 'string') {
        // Chuyển đổi chuỗi thành đối tượng Date
        ngayTaoPhong = new Date(timestamp);
      } else if (timestamp instanceof Date) {
        // Không cần chuyển đổi nếu đã là đối tượng Date
        ngayTaoPhong = timestamp;
      } else {
        // Xử lý các trường hợp khác nếu cần
        return null;
      }
      const chenhLechThoiGian = ngayHienTai.getTime() - ngayTaoPhong.getTime();
      return chenhLechThoiGian / (1000 * 3600 * 24); // Chuyển đổi từ mili giây sang ngày
    };
    // Tính toán và cập nhật trạng thái isNewRoom
    if (roomInfor?.created_at) {
      const soNgayChenhLech = tinhSoNgayChenhLech(roomInfor?.created_at);
      setIsNewRoom(soNgayChenhLech <= 7);
    }
    checkIfLiked(roomInfor.id);
  }, [roomInfor?.created_at]);
  const defaultImage = 'https://a0.muscache.com/im/pictures/237d7dae-4306-466c-aa4c-ae06b2853f94.jpg?im_w=720'
  const renderSwiperItem = () => {
    return roomInfor.images.length > 0
      ? roomInfor.images.map((image, index) => (
        <SwiperSlide
          key={index}
          className="max-h-[270px] rounded-[0.8rem] hover:rounded-[0.8rem]  object-cover h-full w-full"
        >
          <div className="flex items-center  hover:rounded-[0.8rem] justify-center h-full w-full">
            <Image
              src={image}
              alt=""
              className="rounded-[0.8rem] object-cover h-full"
            />
          </div>
        </SwiperSlide>
      ))
      : (
        <SwiperSlide
          className="max-h-[270px] rounded-[0.8rem] object-cover h-full w-full hover:rounded-[0.8rem]"
        >
          <div className="flex items-center justify-center h-full w-full">
            <img
              src={defaultImage}
              alt=""
              className="rounded-[0.8rem] object-cover max-h-full"
            />
          </div>
        </SwiperSlide>
      );
  };
  return (
    <div className='relative text-black hover:text-black hover:rounded-[0.8rem]  bg-white rounded-[2rem]'>
      <div className="h-[270px] ">
        <Swiper
          loop={true}
          cssMode={true}
          navigation={true}
          mousewheel={true}
          keyboard={true}
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          className="mySwiper h-full"
        >
          {renderSwiperItem()}
        </Swiper>
      </div>
      <FaHeart
        className={`text-black hover:text-white/50 hover:rounded-[0.8rem]  absolute top-2 right-2 z-10 cursor-pointer ${isLiked && user.id ? 'text-red-500' : 'text-black'}`}
        strokeWidth={2}
        size={24}
      />
      <Link
        to={`/detail-room/${roomInfor.id}`}
        className=""
      >
        <div className="mt-[8px]">
          <div className="w-full flex justify-between">
            <h1 className="text-[1rem] font-[500]">{roomInfor.name.length > 20 ? roomInfor.name.slice(0, 20) + "..." : roomInfor.name}</h1>
            <div className="flex justify-center items-center">
              <FaStar size="0.8rem" className="mr-2 text-yellow-500" />
              <span className="text-[1rem] font-[300]">{roomInfor?.totalStar && roomInfor.totalStar.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-[0.8rem] text-left font-[400] text-[black] opacity-60">
            Khách tối đa: {roomInfor.maxGuests}
          </p>
          <p className="text-[0.8rem] text-left font-[400] text-[black] opacity-60">
            {moment(roomInfor.created_at).format('Do-MMMM-YYYY')}
          </p>
          <p className="text-[0.8rem] text-left text-[black] opacity-60">{roomInfor.codeLocation}</p>
          <div className="flex justify-between">
            <p className="text-[0.9rem] mr-2 font-[500] text-[black]">{formattedPrice}/<span className="text-[0.8rem] font-[400] text-[black]">đêm</span></p>
            {isNewRoom && roomInfor.created_at ? (
              <>
                <span className="text-[0.8rem] font-[500] rounded bg-yellow-500 text-white px-1">Phòng mới</span>
              </>
            ) : (
              <>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardItem;
