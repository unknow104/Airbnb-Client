// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { roomService } from "../../../../services/RoomService";
import { Form, Input, Checkbox, Row, Col, Select } from "antd";

const { Option } = Select;

export default function UpdateHouseManager() {
  const { id } = useParams();
  const [roomDetail, setRoomDetail] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    roomService
      .getHouseById(id)
      .then((res) => {
        setRoomDetail(res.data);
        form.setFieldsValue({
          // Set initial form values based on the received data
          name: res.data.name || "",
          description: res.data.description || "",
          price: res.data.price || 0,
          codeLocation: res.data.codeLocation || undefined,
          address: res.data.address.fullAddress || "",
          maxGuests: res.data.maxGuests || 1,
          numLivingRooms: res.data.numLivingRooms || 0,
          numBathrooms: res.data.numBathrooms || 0,
          numBedrooms: res.data.numBedrooms || 0,
          allowPet: res.data.allowPet || false,
          washingMachine: res.data.washingMachine || false,
          television: res.data.television || false,
          airConditioner: res.data.airConditioner || false,
          wifi: res.data.wifi || false,
          kitchen: res.data.kitchen || false,
          parking: res.data.parking || false,
          pool: res.data.pool || false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, form]);



  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("codeLocation", values.codeLocation);
    formData.append("address", values.address);
    formData.append('washingMachine', values.washingMachine ? 'true' : 'false');
    formData.append('television', values.television ? 'true' : 'false');
    formData.append('airConditioner', values.airConditioner ? 'true' : 'false');
    formData.append('wifi', values.wifi ? 'true' : 'false');
    formData.append('kitchen', values.kitchen ? 'true' : 'false');
    formData.append('parking', values.parking ? 'true' : 'false');
    formData.append('pool', values.pool ? 'true' : 'false');
    formData.append("allowPet", values.allowPet ? "true" : "false");
    formData.append("maxGuests", values.maxGuests);
    formData.append("numLivingRooms", values.numLivingRooms);
    formData.append("numBathrooms", values.numBathrooms);
    formData.append("numBedrooms", values.numBedrooms);
    formData.append("images", []);

    roomService
      .update(id, formData)
      .then((res) => {
        console.log("Phòng được cập nhật:", res);
        navigate("/manager/house");
      })
      .catch((err) => {
        console.log("Cập nhật thất bại:", err);
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
      <h1 className="font-semibold mx-auto text-center text-2xl">
        {t("Cập Nhật Phòng Trọ")}
      </h1>
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
              name="maxGuests"
              rules={[
                { required: true, message: t("Vui lòng nhập số khách tối đa") },
              ]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Col>
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
        </Row>

        <Row gutter={16}>
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

        <Form.Item label={t("Tiện Ích")} wrapperCol={{ span: 16 }}>
          <Row>
            <Col span={8}>
              <Checkbox
                checked={form.getFieldValue("washingMachine")}
                onChange={(e) => {
                  console.log(e.target.checked);
                  form.setFieldsValue({ washingMachine: e.target.checked });
                }}
                name="washingMachine"
              >
                {t("Máy giặt")}
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox
                checked={form.getFieldValue("television")}
                onChange={(e) =>
                  form.setFieldsValue({ television: e.target.checked })
                }
                name="television"
              >
                {t("Tivi")}
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox
                checked={form.getFieldValue("airConditioner")}
                onChange={(e) =>
                  form.setFieldsValue({ airConditioner: e.target.checked })
                }
                name="airConditioner"
              >
                {t("Máy lạnh")}
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox
                checked={form.getFieldValue("wifi")}
                onChange={(e) =>
                  form.setFieldsValue({ wifi: e.target.checked })
                }
                name="wifi"
              >
                {t("Wifi miễn phí")}
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox
                checked={form.getFieldValue("kitchen")}
                onChange={(e) =>
                  form.setFieldsValue({ kitchen: e.target.checked })
                }
                name="kitchen"
              >
                {t("Có bếp riêng")}
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox
                checked={form.getFieldValue("parking")}
                onChange={(e) =>
                  form.setFieldsValue({ parking: e.target.checked })
                }
                name="parking"
              >
                {t("Chỗ đổ xe")}
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox
                checked={form.getFieldValue("pool")}
                onChange={(e) =>
                  form.setFieldsValue({ pool: e.target.checked })
                }
                name="pool"
              >
                {t("Hồ bơi")}
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox
                checked={form.getFieldValue("hotAndColdMachine")}
                onChange={(e) =>
                  form.setFieldsValue({ hotAndColdMachine: e.target.checked })
                }
                name="hotAndColdMachine"
              >
                {t("Vòi sen nóng lạnh")}
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox
                checked={form.getFieldValue("allowPet")}
                onChange={(e) =>
                  form.setFieldsValue({ allowPet: e.target.checked })
                }
                name="allowPet"
              >
                {t("Cho phép mang thú cưng")}
              </Checkbox>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <button
            className="px-3 py-2 rounded-lg bg-primary text-whitefont-medium hover:bg-[#FF2171] font-bold text-white transition-all"
            htmlType="submit"
          >
            Cập Nhật
          </button>
        </Form.Item>
      </Form>
    </div>
  );
}
