import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Radio, Upload, message } from 'antd';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/userService';
import dayjs from 'dayjs';
import { openNotificationIcon } from '../../../Components/NotificationIcon/NotificationIcon';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { AiOutlineLoading } from 'react-icons/ai';
import { IoPulseOutline } from 'react-icons/io5';

export default function EditUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [user, setUser] = useState({});
  const [imageUrl, setImageUrl] = useState();
  const [imageChange, setImageChange] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetailProduct = async () => {
      try {
        const response = await userService.getInformation(id);
        setUser(response.data);
        form.setFieldsValue({
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          birthday: dayjs(response.data.birthday, 'DD/MM/YYYY'),
          gender: response.data.gender,
          status: response.data.status,
          image: response.data.image
        });
        setImageUrl(response.data.image)
      } catch (error) {
        console.log(error);
        openNotificationIcon('error', 'Lỗi', 'Có lỗi khi cập nhập!');
      }
    };
    fetchDetailProduct();
  }, []);

  const onFinish = async (values) => {
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('phone', values.phone);
      formData.append('email', values.email);
      formData.append('birthday', dayjs(values.birthday).format('DD/MM/YYYY'));
      formData.append('gender', values.gender);
      formData.append('image', imageChange.originFileObj);
      await userService.update(id, formData);
      openNotificationIcon("success", "Thành công", "Bạn đã cập nhật thông tin thành công")
      navigate('/profile');
    } catch (error) {
      openNotificationIcon("success", "Thành công", "Bạn đã cập nhật thông tin thành công")
      navigate('/profile');
      console.log(error);
    }
  };

  const handleImageChange = (value) => {
    const files = [...value.fileList];
    setImageChange(files[0])
  };

  const uploadButton = (
    <div>
      <FaPlus />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const labelCol = { span: 4 };
  const wrapperCol = { span: 16 };

  return (
    <div className="container h-max mt-32 justify-center">
      <div className='ms-40'>
        <button className='flex h-12 align-middle' onClick={() => { navigate('/profile') }}>
          <FaArrowLeft className='my-auto' /> <span className='font-semibold ms-3 text-lg my-auto'>Quay lại</span>
        </button>
      </div>
      <h1 className="uppercase font-bold text-primary text-[20px] text-center my-5">
        Cập nhật thông tin của bạn.
      </h1>
      <Form form={form} onFinish={onFinish} initialValues={{ gender: 'gender' }}>
        <Form.Item
          label="Ảnh của bạn"
          name="image"
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={true}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            // beforeUpload={beforeUpload}
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                className='rounded-full w-full'
                style={{
                  width: '100%',
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
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
          <Button
            className="hover:blacks w-[120px] rounded-[0.5rem] bg-primary btn-login text-white py-[6px] px-[12px]"
            type="primary"
            size="large"
            htmlType="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Cập nhập'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
