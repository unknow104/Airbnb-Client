import React, { useState } from 'react';
import { Form, Input, Button} from 'antd';
import 'react-quill/dist/quill.snow.css';
import { amenityService } from '../../../../services/amenityService';
import { useNavigate } from 'react-router-dom';
import { openNotificationIcon } from '../../../../Components/NotificationIcon/NotificationIcon';

export default function AddAmenityPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setSelectedImage(file);
  };

  const onFinish = async (values) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('imageUrl', selectedImage);
      console.log('Form submitted:', formData);
      const res = await amenityService.addAmenity(formData)
        .then((res) => {
          form.resetFields();
          console.log(res);
          navigate('/manager/amenity');
          openNotificationIcon('success', 'Thành công', 'Thêm mới tiện ích thành công');
        });
    } catch (err) {
      console.error('Error adding amenity:', err);
      openNotificationIcon('error', 'Thất bại', 'Thêm mới thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const labelCol = { span: 4 };
  const wrapperCol = { span: 16 };

  return (
    <div className='w-full'>
      <h1 className='uppercase font-bold text-primary text-[20px] text-center my-5'>Thêm mới tiện ích</h1>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên tiện ích của bạn' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Icon"
          name="imageUrl"
          rules={[{ required: true, message: 'Vui lòng tải ảnh lên' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: labelCol.span, span: wrapperCol.span }}>
          <Button className='bg-primary text-white font-bold w-32' htmlType="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
