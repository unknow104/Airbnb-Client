import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Modal } from 'antd';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { IoIosAddCircleOutline } from 'react-icons/io'
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/userService';
import { localStorageService } from '../../../services/localStorageService';
import { roomService } from '../../../services/RoomService';
import { openNotificationIcon } from '../../../Components/NotificationIcon/NotificationIcon';

export default function HouseManager() {
  const { Column } = Table;
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(3);
  const [houses, setHouses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState();
  const [idUser, setIdUser] = useState(localStorageService.get('USER')?.userDTO.id);
  const [reloadPage, setReloadPage] = useState(false)
  useEffect(() => {
    const getHouses = async () => {
      try {
        const items = await userService.getOwnersRoom(idUser);
        setHouses(items.data);
      } catch (error) {
        console.log(error);
      }
    };
    getHouses();
  }, [reloadPage]);

  const handleDelete = (record) => {
    setSelectedHouse(record.id);
    setModalVisible(true);
  };

  const handleDeleteHouse = async () => {

    try {
      const respone = await roomService.delete(selectedHouse);
      setReloadPage(!reloadPage)
      openNotificationIcon("success", "Thành công", "Xóa phòng thành công")
    } catch (error) {
      openNotificationIcon("error", "Lỗi", "Xóa phòng bị lỗi")
    }
    setModalVisible(false);
  };

  return (
    <div className="w-full">
      <div className="headerManager mb-5 flex justify-between">
        <h1 className='font-medium text-3xl'>Phòng của bạn</h1>
        <button onClick={() => { navigate('/manager/house-add') }} className="text-white bg-primary font-medium rounded-lg text-sm px-4 py-2 flex items-center hover:scale-110 transition-all">Add <IoIosAddCircleOutline className='ml-2 text-[20px]' /> </button>
      </div>
      <Table
        dataSource={houses}
        pagination={{
          total: houses?.length,
          pageSize: pageSize,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
      >
        <Column title="Tên" dataIndex="name" key="name" />
        <Column
          title="Ảnh"
          dataIndex="images"
          key="images"
          render={(images) => (
            <img src={images[0]} className="w-[70px] h-[70px] object-cover rounded-lg" alt="house" />
          )}
        />
        <Column title="Địa chỉ" dataIndex="codeLocation" key="codeLocation" />
        <Column title="Mô tả thêm" dataIndex="description" key="description" />
        <Column
          title="Giá phòng"
          dataIndex="price"
          key="price"
          render={(price) => <Tag color="green">{price.toLocaleString()} VNĐ</Tag>}
        />

        <Column
          title=""
          key="action"
          render={(text, record) => (
            <div className='flex'>
              <Space size="middle" className='mr-3'>
                <AiOutlineEdit
                  onClick={() => {
                    navigate(`/manager/house-update/${record.id}`)
                  }}
                  className="text-[20px] hover:scale-125 hover:text-red-700 transition-all"
                />
              </Space>
              <Space size="middle">
                <AiOutlineDelete
                  onClick={() => {
                    handleDelete(record);
                  }}
                  className="text-[20px] hover:scale-125 hover:text-red-700 transition-all"
                />
              </Space>
            </div>
          )}
        />
      </Table>

      <Modal
        title={`Bạn có muốn xóa phòng này ?`}
        visible={modalVisible}
        onOk={handleDeleteHouse}
        onCancel={() => setModalVisible(false)}
      ></Modal>
    </div>
  );
}
