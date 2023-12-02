import React, { useEffect, useRef, useState } from 'react'
import { localStorageService } from '../../services/localStorageService';
import { Button, Image, Table, Tabs, Upload, message } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import OrderPage from '../OrderPage/OrderPage';
import { FaHeart } from 'react-icons/fa';
import { IoMdCart } from 'react-icons/io';
import { userService } from '../../services/userService';
import { favoriteService } from '../../services/favoriteService';
import { Link, useLocation } from 'react-router-dom';
import { openNotificationIcon } from '../../Components/NotificationIcon/NotificationIcon';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';


export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setuser] = useState(localStorageService.get('USER'));
  const [infor, setinfor] = useState({});
  const [listFavorite, setListFavorite] = useState();
  const [reloadPage, setReloadPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    getUser();
    getFavorite();
  }, [reloadPage]);
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
  const getFavorite = () => {
    favoriteService
      .get(user?.userDTO?.id)
      .then((res) => {
        console.log(res);
        setListFavorite(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/detail-room/${record?.roomDTO?.id}`}>{record?.roomDTO?.name}</Link>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => <span>${record?.roomDTO?.price}</span>,
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      render: (text, record) => (
        <img className='bg-cover w-[100px] h-[100px] rounded-lg ' src={record?.roomDTO?.images[0]} alt="Room" />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => <span>{record?.roomDTO?.description}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => handleRemoveFavorite(record?.roomDTO?.id)}>Remove</Button>
      ),
    },
  ];

  const handleRemoveFavorite = async (idroom) => {
    try {
      const response = await favoriteService.remove(user?.userDTO?.id, idroom)
      setReloadPage(!reloadPage)
      openNotificationIcon("success", "Thành công", "Bỏ yêu thích thành công")
    } catch (error) {
      openNotificationIcon("error", "Lỗi", "Bỏ yêu thích lỗi")
      console.log(error);
    }
  };

  const [imageInfo, setImageInfo] = useState({
    image: null,
    name: '',
  });

  const handleImagesChange = (info) => {
    setSelectedFile(info.target.files[0])


    // const selectedImage = info;
    // setImageInfo({
    //   image: selectedFile.thumbUrl, // hoặc selectedImage.url tùy thuộc vào dữ liệu trả về từ API
    //   name: selectedFile.name || 'ABC', // hoặc lấy từ dữ liệu khác tùy thuộc vào API
    // });

    if (selectedFile) {
      const formData = new FormData();
      formData.append("imageUrl", selectedFile);

      userService
        .setImage(user.userDTO.id, formData)
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          navigate("/profile")
          openNotificationIcon("success", "Thành công", "Đã thay đổi ảnh đại diện của bạn!")
        })
        .catch((err) => {
          setIsLoading(false);
          openNotificationIcon("error", "Lỗi", "Có lỗi thay đổi ảnh đại diện của bạn!")
          console.log("error", err.response.data.message);
        });
    }

    // if (info.status === 'done') {
    //   // Bạn có thể thực hiện các hành động sau khi tải ảnh lên thành công ở đây
    //   console.log(`${info.name} file uploaded successfully`);



    // }
    // if (info.status === 'error') {
    //   console.log(`${info.name} file upload failed.`);
    // }

  };



  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'profile';
  return (
    <div className='container mx-auto pt-28 pb-10 bg-white'>
      <div className="bg-gray-100 min-h-screen rounded-lg">
        <div className="container mx-auto py-10 rounded-lg bg-cover" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/vivid-blurred-colorful-wallpaper-background_58702-3798.jpg?w=900&t=st=1691678392~exp=1691678992~hmac=43eeaa7f69b2aebacc7d96446027ae499e180298cb30fd23b870dc5d6798b92d')" }}>
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1 flex justify-end">
              <label className="w-32 h-32 relative rounded-full overflow-hidden" htmlFor='images'>
                {infor.image ? (
                  <>
                    <img
                      src={infor.image}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <span className="text-white text-4xl">{infor.name[0].toUpperCase()}</span>
                    </div>
                  </>
                ) : (
                  <div className='w-full h-full border-dashed border-2 border-gray-300 flex items-center justify-center'>
                    <input
                      type="file"
                      id='images'
                      className='hidden'
                      onChange={handleImagesChange}
                    />
                    <label htmlFor='images' className='cursor-pointer'>
                      <PlusOutlined className='text-4xl text-gray-500' />
                    </label>
                  </div>
                )}
              </label>
            </div>
            <div className="col-span-3 flex flex-col justify-center items-start">
              <h2 className="text-3xl font-bold">{infor?.name}</h2>
              <p className="text-gray-600">{infor?.email}</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-5">
          <Tabs defaultActiveKey={activeTab} className='mx-10'>
            <TabPane tab={
              <Link to="/profile?tab=profile">
                <span className='flex items-center' >
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="24px" height="24px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10 4h4c3.771 0 5.657 0 6.828 1.172C22 6.343 22 8.229 22 12c0 3.771 0 5.657-1.172 6.828C19.657 20 17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172C2 17.657 2 15.771 2 12c0-3.771 0-5.657 1.172-6.828C4.343 4 6.229 4 10 4Zm3.25 5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Zm1 3a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Zm1 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75ZM11 9a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm-2 8c4 0 4-.895 4-2s-1.79-2-4-2s-4 .895-4 2s0 2 4 2Z" >
                    </path>
                  </svg>
                  <h2 className='ml-2'>Hồ sơ</h2>
                </span></Link>
            } key="profile">
              <div className=" py-4 grid grid-cols-3 gap-4">
                <div className="col-span-1 bg-white shadow rounded p-4">
                  {/* Personal Information */}
                  <h3 className="text-xl font-bold mb-4">Thông tin cơ bản</h3>
                  <div className='space-y-4'>
                    <div className='flex items-center'>
                      <p className='w-32'>Họ và tên</p>
                      <span className='font-medium'>{infor?.name}</span>
                    </div>
                    <div className='flex items-center'>
                      <p className='w-32'>Số điện thoại</p>
                      <span className='font-medium'>{infor?.phone}</span>
                    </div>
                    <div className='flex items-center'>
                      <p className='w-32'>Địa chỉ email</p>
                      <span className='font-medium'>{infor?.email}</span>
                    </div>
                    <div className='flex items-center'>
                      <p className='w-32'>Ngày sinh</p>
                      <span className='font-medium'>{infor?.birthday}</span>
                    </div>
                    <div className='flex items-center'>
                      <p className='w-32'>Giới tính</p>
                      <span className='font-medium'>{infor?.gender ? "Nam" : "Nữ"}</span>
                    </div>
                    <button
                      className='underline font-semibold'
                      onClick={() => {
                        navigate(`/profile/edit-user/${infor?.id}`)
                      }}
                    >
                      Cập nhập tài khoản
                    </button>
                  </div>
                  {/* Add more personal information here */}
                </div>
                <div className="col-span-2 bg-white shadow rounded p-4 h-[450px]">
                  {/* Empty column */}
                  <img className='w-full h-full bg-cover' src='https://img.freepik.com/free-vector/flat-design-travel-twitch-background_23-2149081581.jpg?w=900&t=st=1691678223~exp=1691678823~hmac=98d58011db4925f96a1b22d38972aed1e7fb79b43f369c948f9456bb49d390d3' />
                </div>
              </div>
            </TabPane>
            <TabPane tab={
              <Link to="/profile?tab=liked">
                <span className='flex items-center' >
                  <FaHeart className='w-[19px] h-[19px]' />
                  <span className='ml-2'>Yêu thích</span>
                </span> </Link>
            } key="liked">
              {/* Content for Posts tab */}
              <div className="p-4">
                <div className="bg-white shadow rounded p-4">
                  <p>Phòng bạn đã yêu thích</p>
                  <Table
                    dataSource={listFavorite}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                      total: listFavorite?.length,
                      pageSize: 3,
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                  />
                </div>
              </div>
            </TabPane>
            <TabPane tab={
              <Link to="/profile?tab=order">
                <span className='flex items-center' >
                  <IoMdCart className='w-[22px] h-[22px]' />
                  <span className='ml-2'>Chuyến đi</span>
                </span>
              </Link>
            } key="order">
              {/* Content for Photos tab */}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-[-4.5rem]">Phòng bạn đã đặt</h3>
                <OrderPage />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );

};
