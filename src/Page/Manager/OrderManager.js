import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Tag } from 'antd';
import { localStorageService } from '../../services/localStorageService';
import { userService } from '../../services/userService';
import { order } from '../../Constant/constant';
import { orderService } from '../../services/orderService';
import { openNotificationIcon } from '../../Components/NotificationIcon/NotificationIcon';

export default function OrderManager() {
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [orders, setOrders] = useState([]);
  const [idUser, setIdUser] = useState(localStorageService.get('USER')?.userDTO.id);
  const [orderStatus, setOrderStatus] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [orderIdSelected, setOrderIdSelected] = useState(null);

  useEffect(() => {
    userService
      .getOrderByOwner(idUser)
      .then((res) => {
        console.log(res);
        setOrders(res.data);
        setIsDataLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [idUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case order.CONFIRM:
        return "blue";
      case order.BOOKED:
        return "yellow";
      case order.CHECK_IN:
        return "green";
      case order.CHECK_OUT:
        return "orange";
      default:
        return "red";
    }
  };
  const columns = [
    {
      title: 'Phòng/căn hộ',
      dataIndex: 'roomDTO',
      key: 'roomDTO',
      render: (roomDTO) => roomDTO.name
    },

    {
      title: 'Số lượng khách',
      dataIndex: 'numGuests',
      key: 'numGuests',
    },
    {
      title: 'Ngày nhận phòng',
      dataIndex: 'receivedDate',
      key: 'receivedDate',
    },
    {
      title: 'Ngày trả phòng',
      dataIndex: 'checkoutDate',
      key: 'checkoutDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: '',
      key: 'actions',
      render: (text, record) => {
        return (
          <Button disabled={record.status === order.CANCEL || record.status === order.CHECK_OUT} type="" className='bg-[#068FFF] text-white disabled:bg-gray-200 disabled:cursor-not-allowed ' danger onClick={() => showModal(record.id, record.status)}>
            Cập nhập
          </Button>
        );
      }
    },
  ];
  const showModal = (orderId, status) => {
    setOrderIdSelected(orderId);
    setOrderStatus(status);
    setIsCancelModalVisible(true);
  };

  const handleCancel = () => {
    setIsCancelModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsCancelModalVisible(false);
  };

  const handleUpdateStatus = async (status) => {
    setIsCancelModalVisible(false);
    await orderService.update(orderIdSelected, status)
      .then((res) => {
        openNotificationIcon("success", "Thành công", "Cập nhập thành công")
        if (isDataLoaded) {
          userService
            .getOrderByOwner(idUser)
            .then((res) => {
              setOrders(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
          console.log(idUser);
        }
      })
      .catch((err) => {
        openNotificationIcon("error", "Lỗi", "Cập nhập phòng bị lỗi")
        console.log(err);
      });
  };
  return (
    <div>
      <h1 className='font-medium text-3xl mb-3'>Phòng đã đặt</h1>
      <div className="container mx-auto">
        <Table dataSource={orders} columns={columns} pagination={{
          total: orders?.length,
          pageSize: pageSize,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }} />
        <Modal
          title="Order Update Status"
          centered
          visible={isCancelModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <div className='text-center flex-col flex space-y-3'>
            {orderStatus === order.BOOKED &&
              <button className='px-4 py-2 bg-[#1c6c59] rounded-lg text-white' onClick={() => handleUpdateStatus(order.CONFIRM)}>XÁC NHẬN</button>}
            {orderStatus === order.CONFIRM &&
              <button className='px-4 py-2 bg-[#1c6c59] rounded-lg text-white' onClick={() => handleUpdateStatus(order.CHECK_IN)}>NHẬN PHÒNG</button>}
            {orderStatus === order.CHECK_IN &&
              <button className='px-4 py-2 bg-[#1c6c59] rounded-lg text-white' onClick={() => handleUpdateStatus(order.CHECK_OUT)}>TRẢ PHÒNG</button>}
            <button className='px-4 py-2 bg-primary rounded-lg text-white' onClick={() => handleUpdateStatus(order.CANCEL)}>HỦY</button>
          </div>
        </Modal>
      </div>
    </div>
  );
}