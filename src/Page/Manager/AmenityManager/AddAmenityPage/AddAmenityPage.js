import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import { amenityService } from '../../../../services/amenityService';
import { localStorageService } from '../../../../services/localStorageService';
import { useNavigate } from 'react-router-dom';

export default function AddAmenityPage() {
  const [form] = Form.useForm();
  const [user] = useState(localStorageService.get("USER"));
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Form submitted:', values);
    const formData = new FormData();
    formData.append('id', 0);
    formData.append('name', values.name);
    // Check if imageUrl is a File object
    if (values.imageUrl && values.imageUrl.file) {
      formData.append('imageUrl', values.imageUrl.file);
    }
    console.log(formData);
    amenityService.addAmenity(formData)
      .then((res) => {
        form.resetFields();
        console.log(res);
        navigate('/manager/amenity');
      })
      .catch((err) => {
        console.log(err);
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
          label="imageUrl"
          name="imageUrl"
          rules={[{ required: true, message: 'Vui lòng tải ảnh lên' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Upload
            maxCount={1}
            beforeUpload={() => false}
            listType="picture-card"
          >
            <Button icon={<UploadOutlined />}>Icon</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: labelCol.span, span: wrapperCol.span }}>
          <Button className='bg-primary text-white font-bold w-32' htmlType="submit">
            Thêm mới
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
