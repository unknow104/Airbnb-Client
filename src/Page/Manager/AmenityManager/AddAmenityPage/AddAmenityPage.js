import React, { useState } from 'react';
import { Form, Input, Button, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { blogService } from '../../../../services/blogService';
import { amenityService } from '../../../../services/amenityService';
import { useDispatch } from 'react-redux';
import { localStorageService } from '../../../../services/localStorageService';
import { useNavigate } from 'react-router-dom';

export default function AddAmenityPage() {
  const [form] = Form.useForm();
  let [imageUrlSrc, setImageUrlSrc] = useState("")
  const [user,setUser] = useState(localStorageService.get("USER"))
  const navigate = useNavigate()

  const onFinish = (values) => {
    console.log('Form submitted:', values);
  
    const formData = new FormData();
    formData.append('id', 0);
    formData.append('name', values.name);
    formData.append('imageUrl', values.imageUrl);
    console.log(formData)
    amenityService.addAmenity(formData)
      .then((res) => {
        form.resetFields()
        console.log(res);
        navigate('/manager/amenity')
      })
      .catch((err) => {
            console.log(err);
      });
  };





  const labelCol = { span: 4 };
  const wrapperCol = { span: 16 };

  return (
    <div className='w-full'>
      <h1 className='uppercase font-bold text-primary text-[20px] text-center my-5'>New Amenity</h1>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the name of the amenity' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="imageUrl"
          name="imageUrl"
          rules={[{ required: true, message: 'Please enter the name of the amenity' }]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input onChange={setImageUrlSrc}/>
          
        </Form.Item>
        <span>
          <img src="imageUrlSrc"/>
          <Image  src={imageUrlSrc} alt='Icon Here'/>
        </span>
        

        {/* <Form.Item
          label="Hình ảnh"
          name="imageUrl"
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          rules={[
            () => ({
              validator(_, value) {
                if (selectedImage || value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Vui lòng chọn hình ảnh'));
              },
            }),
          ]}
        >
        <input type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Item> */}

        <Form.Item wrapperCol={{ offset: labelCol.span, span: wrapperCol.span }}>
          <Button className='bg-primary text-white font-bold w-32' htmlType="submit">
            Add Amenity
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
