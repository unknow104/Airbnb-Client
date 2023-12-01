import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { blogService } from '../../../../services/blogService';
import { useDispatch } from 'react-redux';
import { localStorageService } from '../../../../services/localStorageService';
import { useNavigate, useParams } from 'react-router-dom';
import { amenityService } from '../../../../services/amenityService';

export default function UpdateAmenityPage() {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [amenity,setAmenity] = useState({})
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetailProduct = async () => {
      try {
        const response = await amenityService.getAmenityById(id);
        setAmenity(response.data);
        console.log("detail", response);
        form.setFieldsValue({
          name: response.data.name,
          imageUrl: response.data.imageUrl,          
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetailProduct()
  }, []);

  const onFinish = (values) => {
    console.log('Form submitted:', values);
  
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('imageUrl', values.imageUrl);
    amenityService.update(id, formData)
        .then((res) => {
        form.resetFields()
        console.log(res);
        navigate("/manager/amenity")
    }
  )
  .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeContent = (value) => {
    console.log(value);
    setContent(value);
  };

  const labelCol = { span: 4 };
  const wrapperCol = { span: 16 };

  return (
    <div className='w-full'>
      <h1 className='uppercase font-bold text-primary text-[20px] text-center my-5'>update Amenity</h1>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the title of the blog' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="imageUrl"
          name="imageUrl"
          rules={[
            { required: true, message: 'Please enter the short description' },
          ]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: labelCol.span, span: wrapperCol.span }}>
          <Button className='bg-blue-700' type="primary" htmlType="submit">
            Update Amenity
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
