// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { roomService } from "../../../../services/RoomService";
import { Form, Input, Checkbox, Row, Col, Select } from "antd";
import { openNotificationIcon } from "../../../../Components/NotificationIcon/NotificationIcon";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

export default function UpdateHouseManager() {
  const { id } = useParams();
  const [roomDetail, setRoomDetail] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    roomService
      .getHouseById(id)
      .then((res) => {
        console.log(res);
        setRoomDetail(res.data);
        form.setFieldsValue({
          // Set initial form values based on the received data
          name: res.data.name || "",
          description: res.data.description || "",
          price: res.data.price || 0,
          codeLocation: res.data.codeLocation || undefined,
          address: res.data.address.fullAddress || "",
          maxGuest: res.data.maxGuest || 1,
          numLivingRooms: res.data.numLivingRooms || 0,
          numBathrooms: res.data.numBathrooms || 0,
          numBedrooms: res.data.numBedrooms || 0,
          allowPet: res.data.allowPet || false,
          washingMachine: res.data.washingMachine,
          television: res.data.television || false,
          airConditioner: res.data.airConditioner || false,
          wifi: res.data.wifi || false,
          kitchen: res.data.kitchen || false,
          parking: res.data.parking || false,
          pool: res.data.pool || false,
          hotAndColdMachine: res.data.hotAndColdMachine || false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, form]);



  const onFinish = (values) => {
    setIsLoading(true);
    console.log(values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("codeLocation", values.codeLocation);
    formData.append("address", values.address);
    formData.append("hotAndColdMachine", values.hotAndColdMachine ? true : false); // Chuyển đổi thành kiểu boolean
    formData.append('washingMachine', values.washingMachine ? true : false);
    formData.append('television', values.television ? true : false);
    formData.append('airConditioner', values.airConditioner ? true : false);
    formData.append('wifi', values.wifi ? true : false);
    formData.append('kitchen', values.kitchen ? true : false);
    formData.append('parking', values.parking ? true : false);
    formData.append('pool', values.pool ? true : false);
    formData.append("allowPet", values.allowPet ? true : false);
    formData.append("maxGuest", values.maxGuest)
    formData.append("numLivingRooms", values.numLivingRooms);
    formData.append("numBathrooms", values.numBathrooms);
    formData.append("numBedrooms", values.numBedrooms);
    formData.append("images", []);

    roomService
      .update(id, formData)
      .then((res) => {
        console.log("Phòng được cập nhật:", res);
        openNotificationIcon("success", "Thành công", "Cập nhập phòng thành công")
        navigate("/manager/house");
      })
      .catch((err) => {
        console.log("Cập nhật thất bại:", err);
        openNotificationIcon("error", "Thất bại", "Cập nhập phòng thất bại")
      });
  };

  const handleStreetChange = (e) => {
    form.setFieldsValue({
      address:
        e.target.value +
        ", " +
        form.getFieldValue("nameWard") +
        ", " +
        form.getFieldValue("nameDistrict") +
        ", " +
        form.getFieldValue("nameProvince"),
    });
  };


  return (
    <div className="update-house-manager-container">
      <div className="flex">
        <Form.Item>
          <Link to="/manager/house">
            <button className="px-3 py-2 rounded-lg bg-gray-300 text-black font-medium hover:bg-gray-400 hover:text-white transition-all">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          </Link>
        </Form.Item>
        <h1 className="font-semibold mx-auto text-center text-2xl">
          {t("Cập Nhật Phòng Trọ")}
        </h1>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={t("Tên")}
          name="name"
          rules={[{ required: true, message: t("Vui lòng nhập tên") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("Mô Tả")}
          name="description"
          rules={[
            { required: true, message: t("Vui lòng nhập mô tả") },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label={t("Địa Chỉ")}
          name="address"
          rules={[{ required: true, message: t("Vui lòng chọn địa chỉ") }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={t("Giá")}
              name="price"
              rules={[{ required: true, message: t("Vui lòng nhập giá") }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t("Số Khách Tối Đa")}
              name="maxGuest"
              rules={[
                { required: true, message: t("Vui lòng nhập số khách tối đa") },
              ]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={t("Số Phòng Khách")}
              name="numLivingRooms"
              rules={[
                {
                  required: true,
                  message: t("Vui lòng nhập số phòng khách"),
                },
              ]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t("Số Phòng Tắm")}
              name="numBathrooms"
              rules={[
                {
                  required: true,
                  message: t("Vui lòng nhập số phòng tắm"),
                },
              ]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t("Số Phòng Ngủ")}
              name="numBedrooms"
              rules={[
                {
                  required: true,
                  message: t("Vui lòng nhập số phòng ngủ"),
                },
              ]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={t("Tiện Ích")} wrapperCol={{ span: 18 }}>
          <Row>
            <Col span={6}>
              <Form.Item name="washingMachine" valuePropName="checked">
                <Checkbox
                >
                  {t("Máy giặt")}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="television" valuePropName="checked">
                <Checkbox
                >
                  {t("Tivi")}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="airConditioner" valuePropName="checked">
                <Checkbox
                >
                  {t("Máy lạnh")}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="wifi" valuePropName="checked">
                <Checkbox
                >
                  {t("Wifi miễn phí")}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="kitchen" valuePropName="checked">
                <Checkbox
                >
                  {t("Có bếp riêng")}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="parking" valuePropName="checked">
                <Checkbox
                >
                  {t("Chỗ đổ xe")}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="pool" valuePropName="checked">
                <Checkbox
                >
                  {t("Hồ bơi")}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="hotAndColdMachine" valuePropName="checked">
                <Checkbox
                >
                  {t("Vòi sen nóng lạnh")}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="allowPet" valuePropName="checked">
                <Checkbox
                >
                  {t("Cho phép mang thú cưng")}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <div className="flex gap-5">
          <Form.Item>
            <button
              className="px-3 py-2 rounded-lg bg-primary text-white font-medium hover:bg-[#068FFF] hover:text-white transition-all"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Cập nhập phòng"}
            </button>
          </Form.Item>
          <Form.Item>
            <Link to="/manager/house">
              <button className="px-3 py-2 rounded-lg bg-gray-300 text-black font-medium hover:bg-gray-400 hover:text-white transition-all">
                Trở lại
              </button>
            </Link>
          </Form.Item>
        </div>

      </Form>
    </div>
  );
}
