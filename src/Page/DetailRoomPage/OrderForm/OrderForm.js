import React, { useState } from "react";
import { DatePicker, message, Space, } from "antd";
import { InputNumber } from "antd";
import { localStorageService } from "../../../services/localStorageService";

import { t } from "i18next";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { openNotificationIcon } from "../../../Components/NotificationIcon/NotificationIcon";

export default function OrderRoom(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [startDay, setStartDay] = useState();
  const [endDay, setEndDay] = useState();
  const [quantityPerson, setQuantityPerson] = useState(1);
  const [idUser, setIdUser] = useState(
    localStorageService.get("USER")?.userDTO.id
  );
  const onChangeInputNumber = (value) => {
    setQuantityPerson(value);
  };

  const onChangeRangePicker = (dates, dateStrings) => {
    setStartDay(dateStrings[0]);
    setEndDay(dateStrings[1]);
  };
  const handleOrder = () => {
    if (!idUser) {
      openNotificationIcon('error', 'Lỗi', 'Vui lòng đăng nhập trước khi đặt phòng');
      navigate('/login')
      return;
    }
    if (!startDay || !endDay) {
      openNotificationIcon('error', 'Lỗi', 'Vui lòng chọn ngày và giờ trước khi đặt phòng.');
      return;
    }
    const orderData = {
      idUser: idUser,
      status: "pending",
      receivedDate: startDay,
      checkoutDate: endDay,
      numGuests: quantityPerson,
    };
    console.log(orderData);
    navigate(`/confirmOrder/${props.room.id}`, {
      state: { dataContext: orderData },
    });
  };
  // Định dạng giá thành VND
  const formattedPrice = (values) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(values);
  const isDisableDate = (date, daybooking) => {
    if (date && date.isBefore(moment().startOf("day"))) {
      return true;
    }
    for (let i = 0; i < daybooking.length; i++) {
      const start = moment(daybooking[i].startDate);
      const end = moment(daybooking[i].endDate);
      if (date.isAfter(start) && date.isBefore(end)) {
        return true;
      }
    }
    return false;
  };
  const calculateTotalPrice = () => {
    if (!startDay || !endDay) {
      return 0;
    }
    const numNights = moment(endDay).diff(moment(startDay), 'days');
    const totalPrice = props.room?.price * numNights;
    return totalPrice;
  };
  const calculateTax = () => {
    if (!startDay || !endDay) {
      return 0;
    }
    const numNights = moment(endDay).diff(moment(startDay), 'days');
    const tax = (props.room?.price * numNights) * 0.143;
    return tax;
  }
  return (
    <div
      className="w-full rounded-[15px] mt-10 h-[500px] shadow-2xl">
      <section className="bg-cover top-32 rounded-[15px] p-6">
        <div className="flex items-center justify-between">
          <p className="font-bold">
            <span className="font-bold text-[22px]">{formattedPrice(props.room?.price)}</span> <span className="font-normal">/đêm</span>
          </p>
        </div>
        <div className=" rounded-[15px] my-4 py-4">
          <div className="">
            <p className="mb-2 mx-2 font-semibold">
              Số lượng khách
            </p>
            <div className="transition duration-300 rounded-full h-full flex justify-start">
              <InputNumber
                id="guests"
                className=" h-[50px] w-[120px] rounded-full"
                min={1}
                max={props.room?.maxGuests}
                defaultValue={1}
                onChange={onChangeInputNumber}
              />
            </div>
            <div className="lg:block  md:hidden sm:hidden mb:hidden py-3 transition duration-300 rounded-full h-full flex flex-wrap justify-center items-center">
              <Space direction="vertical" size={12}>
                <DatePicker.RangePicker
                  disabledDate={(date) => isDisableDate(date, props?.date)}
                  onChange={onChangeRangePicker}
                  ranges={{
                    'Hôm nay': [moment(), moment()],
                    'Tuần này': [moment(), moment().endOf('week')],
                    'Tháng này': [moment(), moment().endOf('month')],
                    'Tuỳ chỉnh': [moment(startDay), moment(endDay)],
                  }}
                />
              </Space>
            </div>
          </div>
        </div>
        <div className="my-5">
          <div className=" ">
            <button
              className={`w-full py-3 bg-primary text-white rounded-[15px] transition-all`}
              onClick={handleOrder}
            >
              Đặt phòng
            </button>
          </div>
        </div>
        <div>
          {startDay && endDay && (
            <div>
              <div className="flex justify-between my-3">
                <p className="w-40">Thời gian:</p>
                <p>{moment(endDay).diff(moment(startDay), 'days')}  đêm</p>
              </div>
              <div className="flex justify-between my-3">
                <p className="w-40">Phí dịch vụ Airbnb:</p>
                <p>- {formattedPrice(calculateTax())}</p>
              </div>
              <div className="flex justify-between my-3">
                <p className="w-40">Dịch vụ:</p>
                {/* Thêm mã nguồn để hiển thị thông tin về dịch vụ nếu có */}
                <p>0đ</p>
              </div>
              <div className="flex justify-between my-3">
                <p className="w-40 font-bold">Tổng cộng:</p>
                <p>{formattedPrice(calculateTotalPrice() - calculateTax())}</p>
              </div>
            </div>
          )}
        </div>
      </section >
    </div >
  );
}
