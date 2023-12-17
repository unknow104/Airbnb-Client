import React, { useEffect, useState } from 'react';
import { roomService } from '../../services/RoomService';
import { useNavigate, useParams } from 'react-router-dom';
import SkeletonDetail from '../../Components/Skeleton/SkeletonDetail';
import { useTranslation } from 'react-i18next';
import { IoBedOutline, IoListCircle } from 'react-icons/io5';
import './DetailRoomPage.scss';
import OrderForm from './OrderForm/OrderForm';
import Feedback from './Feedback/Feedback';
import { favoriteService } from '../../services/favoriteService';
import { openNotificationIcon } from '../../Components/NotificationIcon/NotificationIcon';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaHeart, FaMinus } from 'react-icons/fa';
import { localStorageService } from '../../services/localStorageService';
import { MdOutlineLiving, MdOutlineBathtub, MdOutlinePets } from "react-icons/md";
import { FaBan } from "react-icons/fa";


export default function DetailRoomPage() {
  const { id } = useParams();
  const [roomDetail, setRoomDetail] = useState({});
  const [dataDate, setDataDate] = useState();
  const [isFetch, setIsFetch] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavoriteChanged, setIsFavoriteChanged] = useState(false);
  const containerStyle = {
    width: '100%',
    height: '500px',
  };
  const options = {
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }],
      },
    ],
  };
  const icon = {
    url: '/img/airbnb.png',
    scaledSize: {
      width: 45,
      height: 45,
    },
  };
  const [user, setUser] = useState(localStorageService.get('USER')?.userDTO);

  useEffect(() => {
    setIsFetch(true);
    roomService
      .getHouseById(id)
      .then((res) => {
        setRoomDetail(res.data);
        setIsFetch(false);
      })
      .catch((err) => {
        console.log(err);
        setIsFetch(false);
      });
    checkIfLiked(id);
  }, [id, user, isFavoriteChanged]);

  useEffect(() => {
    roomService
      .getRoomCalendar(id)
      .then((res) => {
        setDataDate(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const checkIfLiked = async (idroom) => {
    try {
      const response = await favoriteService.get(user.id);
      const wishlistItems = response.data;
      const isLiked = wishlistItems.some(
        (item) => item.roomDTO && item.roomDTO.id === parseInt(idroom)
      );
      setIsLiked(isLiked);
    } catch (error) {
      console.error('Lỗi khi kiểm tra phòng đã like chưa', error);
    }
  };

  const handleFavorite = async (idroom) => {
    try {
      if (user) {
        const formData = new FormData();
        formData.append('roomId', idroom);
        const response = await favoriteService.add(user.id, formData);
        openNotificationIcon(
          'success',
          'Thành công',
          'Thêm vào thư mục yêu thích thành công'
        );
        setIsFavoriteChanged((prevState) => !prevState);
      } else {
        openNotificationIcon(
          'error',
          'Lỗi',
          'Vui lòng đăng nhập vào hệ thống'
        );
      }
    } catch (error) {
      openNotificationIcon(
        'error',
        'Lỗi',
        'Bạn đã yêu thích phòng này rồi'
      );
      console.log(error);
    }
  };

  return (
    <div className='container mx-auto pb-5 mb:pt-[0px] sm:pt-[0px] md:pt-[6rem]'>
      {isFetch ? <SkeletonDetail /> :
        <>
          <div className='flex justify-between mt-5'>
            <h2 className="text-[1.5rem] font-[500]">{roomDetail?.name}</h2>
            <button
              className="flex items-center px-6 py-1 hover:bg-black/5 rounded-2xl underline"
              onClick={() => {
                handleFavorite(id);
              }}
            >
              <FaHeart
                className={`mr-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
              />
              {isLiked ? 'Lưu' : 'Chưa lưu'}
            </button>
          </div>
          <div className="image mt-5 mb:hidden sm:hidden md:block">
            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[450px]">
              {roomDetail?.images && roomDetail.images.length > 0 ? (
                <>
                  {roomDetail.images.slice(0, 5).map((image, index) => (
                    <img
                      key={index}
                      className={`rounded-[0.5rem] h-full w-full ${index === 0 ? 'row-span-2 col-span-2' : ''} object-cover`}
                      src={image}
                      alt={`Room ${index + 1}`}
                    />
                  ))}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="w-full flex h-full">
            <div className="mb:w-full sm:w-full md:w-3/5 lg:w-3/5">
              <p className="text-2xl font-semibold my-[0.7rem] text-[#222222]">
                {roomDetail?.description}
              </p>
              <div className="aircover border-b-[1px] border-[#dadada]">
                <h1 className="font-[700] text-[red] text-[32px]">
                  air<span className="font-[700] text-black text-[32px]">cover</span>
                </h1>
                <div className="w-full mb:py-[1rem] sm:py-[1rem] md:py-[2.2rem] border-b-[1px] border-[#dadada]">
                  <span className="text-[1rem] font-[400] text-[#717171]">
                    {roomDetail?.maxGuests} khách - {roomDetail?.numBedrooms} phòng ngủ - {roomDetail?.numLivingRooms} phòng khách -  {roomDetail?.numBathrooms} nhà tắm
                  </span>
                  <p className="text-[1rem] font-[400] text-[#717171]">{roomDetail?.codeLocation}</p>
                  <p className="text-[1rem] font-[400] text-[#717171]">{roomDetail?.address?.fullAddress}</p>
                </div>
              </div>
              <div className="w-full py-[2.2rem] border-b-[1px] border-[#dadada]">
                <h1 className="text-[1.625rem] mb-[1.25rem] font-[600]">
                  Chỗ ở của bạn
                </h1>
                <div className="p-[1.2rem] text-left border rounded-[0.4rem] block">
                  <div className='flex justify-between'>
                    <div className='flex'>
                      <IoBedOutline size={30} />
                      <h2 className="font-[500] mx-2 text-[1rem]">{roomDetail?.numBedrooms} phòng ngủ</h2>
                    </div>
                    <div className='flex'>
                      <MdOutlineBathtub size={30} />
                      <h2 className="font-[500] mx-2 text-[1rem]">{roomDetail?.numBathrooms} nhà tắm</h2>
                    </div>
                    <div className='flex'>
                      <MdOutlineLiving size={30} />
                      <h2 className="font-[500] mx-2 text-[1rem]">{roomDetail?.numLivingRooms} phòng khách</h2>
                    </div>
                    <div className='flex'>
                      <MdOutlineLiving size={30} />
                      <h2 className="font-[500] mx-2 text-[1rem]">{roomDetail?.numLivingRooms} phòng khách</h2>
                    </div>
                  </div>
                  {roomDetail?.allowPet === true ? (
                    <div className='flex mt-5'>
                      <MdOutlinePets size={30} />
                      <h2 className="font-[500] mx-2 text-[1rem]"> cho phép mang thú cưng</h2>
                    </div>
                  ) : (
                    <div className='flex mt-5'>
                      <FaBan size={30} />
                      <h2 className="font-[500] mx-2 text-[1rem]">cấm thú cưng</h2>
                    </div>
                  )}
                </div>

              </div>
              {/* {renderItemUtilities()} */}
              <div className="w-full py-[2.2rem] border-b-[1px] border-[#dadada]">
                <h1 className="text-[1.625rem] mb-[1.25rem] font-[600]">
                  Tiện ích của phòng
                </h1>
                <div className='flex'>
                  <FaMinus size={20} />
                  {roomDetail?.amenities.map((amenity) => {
                    <h2 className="font-[500] mx-2 text-[1rem]">{amenity.name}</h2>
                  })}
                </div>
              </div>
              <Feedback room={roomDetail} />
            </div>
            <div className="pl-[6rem] mb:hidden sm:hidden md:block w-2/5 h-[800px]">
              <OrderForm room={roomDetail} date={dataDate} />
            </div>
          </div>
        </>
      }
      <div className='container mx-auto pb-5 mb:pt-[0px] sm:pt-[0px] md:pt-[6rem]'>
        <LoadScript
          googleMapsApiKey="AIzaSyAQ4hwi9JTqJKOkuU7JdU0LxsqTYycrQnk">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: roomDetail?.address?.lat, lng: roomDetail?.address?.lng
            }}
            zoom={13}
            options={options}
          >
            <Marker
              icon={icon}
              position={{ lat: roomDetail?.address?.lat, lng: roomDetail?.address?.lng }}
            />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
