import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Radio } from 'antd';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/userService';

export default function EditUserPage() {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [gender, setGender] = useState()
  const [user,setUser] = useState({})
  const {id} = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchDetailProduct = async () => {
      try {
        const response = await userService.getInformation(id)
        setUser(response.data);
        console.log("detail", response);
        form.setFieldsValue({
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          birthday: response.data.birthday,
          gender: response.data.gender,
          status: response.data.status
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
    formData.append('phone', values.phone);
    formData.append('email', values.email);
    formData.append('birthday', values.birthday);
    // formData.append('gender', values.gender);
    userService.update(id, formData)
      .then((res) => {
        form.resetFields();
        console.log(res);
        navigate("/profile")
      }).catch((err) => {
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
    <div className='w-full h-max mt-32'>
      <h1 className='uppercase font-bold text-primary text-[20px] text-center my-5'> Cập nhật thông tin của bạn.</h1>
      <Form form={form} onFinish={onFinish} initialValues={{gender: "gender"}}>
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
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: 'Please enter the short description' },
          ]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter the short description' },
          ]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Birthday"
          name="birthday"
          rules={[
            { required: true, message: 'Please enter the short description' },
          ]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <DatePicker name='birthday' />
        </Form.Item>

        {/* <Form.Item
          label="Gender"
          name="gender"
        
          rules={[
            { required: true, message: 'Please enter the short description' },
          ]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Radio.Group defaultValue="gender">
            <Radio value={1}>Nam</Radio>
            <Radio value={0}>Nữ</Radio>
          </Radio.Group>
        </Form.Item> */}

        <Form.Item
          label="Status"
          name="status"
          rules={[
            { required: true, message: 'Please enter the short description' },
          ]}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <Input readOnly/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: labelCol.span, span: wrapperCol.span }}>
          <Button className='font-semibold text-white bg-gradient-to-r from-pink-600 to-red-500' htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
