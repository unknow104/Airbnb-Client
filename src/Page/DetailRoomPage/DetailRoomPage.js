import React, { useEffect, useState } from 'react'
import { roomService } from '../../services/RoomService'
import { useNavigate, useParams } from 'react-router-dom';
import SkeletonDetail from '../../Components/Skeleton/SkeletonDetail';
import { useTranslation } from 'react-i18next';
import { IoBedOutline } from "react-icons/io5";
// import TotalReserce from './TotalReserce'
import './DetailRoomPage.scss';
import OrderForm from './OrderForm/OrderForm';
import Feedback from './Feedback/Feedback';
import { localStorageService } from '../../services/localStorageService';
import { favoriteService } from '../../services/favoriteService';
import { openNotificationIcon } from '../../Components/NotificationIcon/NotificationIcon';
import Map from '../SearchPage/Map';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaHeart } from 'react-icons/fa';

export default function DetailRoomPage() {
  const { id } = useParams();
  const [roomDetail, setRoomDetail] = useState({});
  const [dataDate, setDataDate] = useState();
  const [isFetch, setIsFecth] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const containerStyle = {
    width: '100%',
    height: '500px'
  };
  const options = {
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      }
    ],
  };
  const icon = {
    url: '/img/airbnb.png',
    scaledSize: {
      width: 45,
      height: 45
    },
  };
  const [user, setuser] = useState(localStorageService.get('USER')?.userDTO);

  useEffect(() => {
    setIsFecth(true)
    roomService.getHouseById(id)
      .then((res) => {
        setRoomDetail(res.data);
        console.log(res.data);
        setIsFecth(false)
      })
      .catch((err) => {
        console.log(err);
        setIsFecth(false)
      });
    checkIfLiked(id);
  }, [id, user])
  useEffect(() => {
    roomService.getRoomCalendar(id).then((res) => {
      console.log(res);
      setDataDate(res.data)
    })
      .catch((err) => {
        console.log(err);
      });
  }, [])
  const checkIfLiked = async (idroom) => {
    try {
      const response = await favoriteService.get(user.id);
      const wishlistItems = response.data;
      // Kiểm tra xem roomId có trong danh sách mong muốn không
      const isLiked = wishlistItems.some(item => item.roomDTO && item.roomDTO.id === parseInt(idroom));
      console.log(isLiked);
      // Set giá trị của isLiked vào state
      setIsLiked(isLiked);
    } catch (error) {
      console.error('Lỗi khi kiểm tra phòng đã like chưa', error);
    }
  };
  const handlefavorite = async (idroom) => {
    try {
      if (user) {
        const formData = new FormData();
        formData.append("roomId", idroom);
        const response = await favoriteService.add(user.id, formData)
        openNotificationIcon("success", "Thành công", "Thêm vào thư mục yêu thích thành công")
      } else {
        openNotificationIcon("error", "Lỗi", "Vui lòng đăng nhập vào hệ thống")
      }
    } catch (error) {
      openNotificationIcon("error", "Lỗi", "Bạn đã yêu thích phòng này rồi")
      console.log(error);
    }
  };
  const renderItemUtilities = () => {
    const roomDetails = [
      {
        key: "wifi",
        icon: "https://res.cloudinary.com/dvzingci9/image/upload/v1665892877/airBnB/icon%20offer%20detailpage/icon_ss0rmh.png",
        label: "Wifi",
      },
      {
        key: "pool",
        icon: "https://res.cloudinary.com/dvzingci9/image/upload/v1665892879/airBnB/icon%20offer%20detailpage/Frame-3_zslq3h.png",
        label: t('Pool'),
      },
      {
        key: "television",
        icon: "https://res.cloudinary.com/dvzingci9/image/upload/v1665892879/airBnB/icon%20offer%20detailpage/Frame_nsy3uv.png",
        label: "TV",
      },
      {
        key: "airConditioning",
        icon: "https://res.cloudinary.com/dvzingci9/image/upload/v1665892878/airBnB/icon%20offer%20detailpage/Frame-4_ropqpj.png",
        label: t('Air Conditioning'),
      },
      {
        key: "hotAndColdMachine",
        icon: "https://res.cloudinary.com/dvzingci9/image/upload/v1665892877/airBnB/icon%20offer%20detailpage/Frame-1_e5n14s.png",
        label: t('Hair Dryer'),
      },
      {
        key: "kitchen",
        icon: "https://res.cloudinary.com/dvzingci9/image/upload/v1665892878/airBnB/icon%20offer%20detailpage/Frame-5_vobdtz.png",
        label: t('Kitchen'),
      },
      {
        key: "parking",
        icon: "https://res.cloudinary.com/dvzingci9/image/upload/v1665892879/airBnB/icon%20offer%20detailpage/Frame_nsy3uv.png",
        label: t('Parking'),
      },
    ];

    return (
      <>
        <div className="w-full py-[2.2rem] border-b-[1px] border-[#dadada]">
          <h1 className="text-[1.625rem] font-[600]">{t('what this place offers')}</h1>
          <div className="grid grid-cols-2 w-3/4 gap-y-2 my-5 gap-x-16">
            {renderUtilities(roomDetails)}
          </div>
        </div>
      </>
    );
  };
  const renderUtilities = (details) => {
    return details.map((detail) => {
      if (roomDetail[detail.key]) {
        return (
          <p className="flex items-center font-[300] text-[1rem]" key={detail.key}>
            <img
              src={detail.icon}
              className="w-[1.1rem] h-[1.1rem] mr-[1rem]"
              alt=""
            />
            {detail.label}
          </p>
        );
      }
      return null;
    });
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
                handlefavorite(id);
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
                  <img
                    className="rounded-[0.5rem] h-full w-full row-span-2 col-span-2 object-cover"
                    src={roomDetail.images[0]}
                    alt=""
                  />
                  <img
                    className="rounded-[0.5rem] h-full w-full object-cover"
                    src={roomDetail.images[1]}
                    alt=""
                  />
                  <img
                    className="rounded-[0.5rem] h-full w-full object-cover"
                    src={roomDetail.images[2]}
                    alt=""
                  />
                  <img
                    className="rounded-[0.5rem] h-full w-full object-cover "
                    src={roomDetail.images[3]}
                    alt=""
                  />
                  <img
                    className="rounded-[0.5rem] h-full w-full object-cover"
                    src={roomDetail.images[4]}
                    alt=""
                  />
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
              {/* ================================== AIRCOVER =================================== */}
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
              {/* ================= Where you'll sleep ==================== */}
              <div className="w-full py-[2.2rem] border-b-[1px] border-[#dadada]">
                <h1 className="text-[1.625rem] mb-[1.25rem] font-[600]">
                  Chỗ ở của bạn
                </h1>
                <div className="p-[1.2rem] text-left border rounded-[0.4rem] block">
                  <IoBedOutline size={30} />
                  <h2 className="font-[500] mt-3 mb-1 text-[1rem]">{roomDetail?.numBedrooms} phòng ngủ</h2>
                </div>
              </div>
              {/* ================= what this place offers ==================== */}
              {renderItemUtilities()}
              {/* ================= FeedBack ============= */}
              <Feedback room={roomDetail} />
            </div>
            <div className="pl-[6rem] mb:hidden sm:hidden md:block w-2/5 h-[800px]">
              <OrderForm room={roomDetail} date={dataDate} />
            </div>
          </div>
        </>}
      <div className='container mx-auto pb-5 mb:pt-[0px] sm:pt-[0px] md:pt-[6rem]'>
        {/* <Map address={roomDetail?.address} /> */}
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

  )
}
