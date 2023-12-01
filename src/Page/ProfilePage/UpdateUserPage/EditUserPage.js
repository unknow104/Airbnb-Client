import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Radio, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/userService';
import dayjs from 'dayjs';
import { openNotificationIcon } from '../../../Components/NotificationIcon/NotificationIcon';

export default function EditUserPage() {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [user, setUser] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);



  useEffect(() => {
    const fetchDetailProduct = async () => {
      try {
        const response = await userService.getInformation(id);
        setUser(response.data);
        setImageUrl(response.data.image);
        form.setFieldsValue({
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          image: response.data.image,
          birthday: dayjs(response.data.birthday, 'DD/MM/YYYY'),
          gender: response.data.gender,
          status: response.data.status,
        });
      } catch (error) {
        console.log(error);
        openNotificationIcon('error', 'Lỗi', 'Có lỗi khi cập nhập!');
      }
    };
    fetchDetailProduct();
  }, []);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('phone', values.phone);
      formData.append('email', values.email);
      formData.append('image', values.image);
      formData.append('birthday', dayjs(values.birthday).format('DD/MM/YYYY'));
      formData.append('gender', values.gender);
      await userService.update(id, formData);
      form.resetFields();
      navigate('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeContent = (value) => {
    console.log(value);
    setContent(value);
  };

  const labelCol = { span: 4 };
  const wrapperCol = { span: 16 };

  return (
    <div className="w-full h-max mt-32">
      <h1 className="uppercase font-bold text-primary text-[20px] text-center my-5">
        Cập nhật thông tin của bạn.
      </h1>

      <Form form={form} onFinish={onFinish} initialValues={{ gender: 'gender' }}>
        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="birthday"
          rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <DatePicker name="birthday" format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Radio.Group defaultValue="gender">
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          disabled
          name="status"
          rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: labelCol.span, span: wrapperCol.span }}>
          <Button className="font-semibold text-white bg-gradient-to-r from-pink-600 to-red-500" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
