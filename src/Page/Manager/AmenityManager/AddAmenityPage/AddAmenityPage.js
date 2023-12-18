import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import { amenityService } from '../../../../services/amenityService';
import { localStorageService } from '../../../../services/localStorageService';
import { useNavigate } from 'react-router-dom';
import { openNotificationIcon } from '../../../../Components/NotificationIcon/NotificationIcon';

export default function AddAmenityPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [imageChange, setImageChange] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (value) => {
    const files = [...value.fileList];
    setImageChange(files[0])
  };
  const onFinish = (values) => {
    setIsLoading(true)
    console.log('Form submitted:', values);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('imageUrl', imageChange.originFileObj);

    console.log(formData);
    amenityService.addAmenity(formData)
      .then((res) => {
        form.resetFields();
        console.log(res);
        navigate('/manager/amenity');
        openNotificationIcon("susses", "Thành công", "Thêm mới tiện ích thành công");
      })
      .catch((err) => {
        console.log(err);
        console.error('Error adding amenity:', err);
      });
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
          <Upload
            maxCount={1}
            beforeUpload={() => false}
            listType="picture-card"
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Icon</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: labelCol.span, span: wrapperCol.span }}>
          <Button className='bg-primary text-white font-bold w-32' htmlType="submit">
            {isLoading ? 'Loading...' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
