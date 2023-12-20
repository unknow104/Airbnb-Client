import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, DatePicker, Col, Row, Modal } from 'antd';

import './Register.scss';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../../Redux/auth/authSlice';
import { authService } from '../../services/authService';
import { useState } from 'react';
import { IoIosMailOpen } from 'react-icons/io';
import { openNotificationIcon } from '../../Components/NotificationIcon/NotificationIcon';
import { localStorageService } from '../../services/localStorageService';
import { useEffect } from 'react';

function RegisterPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setIsLoading(true)
    const infor = {
      name: values.name,
      email: email,
      password: password,
      phone: values.phone,
      birthday: values.birthday.format('DD/MM/YYYY'),
      gender: values.gender,
    };
    await authService.registerUser(infor)
      .then((res) => {
        setModalOpen(true);
        setIsLoading(false)

      })
      .catch((err) => {
        setIsLoading(false)

        if (err.response.data.message === 'email already taken') {
          openNotificationIcon('warning', 'Email đã được sử dụng', `Trở lại đăng nhập với email: ${email}!`);
          navigate('/login');
        } else {
          console.log(err.response.data.message);
        }

      });

  };

  const onFinishFailed = (errorInfo) => { };

  const { Option } = Select;
  const handleVerify = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("token", confirmCode);

    await authService.confirm(formData)
      .then((res) => {
        console.log(res);
        if (res === 'confirmed') {
          setModalOpen(false);
          dispatch(loginUser({ email: email, password: password }));
        } else {
          openNotificationIcon('warning', 'Ký tự bị lỗi', 'Vui lòng nhập lại thông tin!');
        }

      })
      .catch((err) => {
        console.log(err);

      });
  }
  const handleDeleteUserNotConfirm = async () => {

    await authService.delete(email)
      .then((res) => {
        console.log(res);
        setModalOpen(false);

      })
      .catch((err) => {
        console.log(err);

      });
  }
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const role = localStorageService.get('USER')?.userDTO?.role?.[0];
    console.log(role);
    if (isLoggedIn && role) {
      if (role === "CUSTOMER") {
        navigate("/");
      } else {
        navigate("/manager")
      }
    }
  }, [isLoggedIn, navigate]);
  return (
    <div className="login flex items-center justify-center h-screen mb:p-0 sm:p-0 lg:p-[24px]">
      <div className="flex bg-white items-center relative w-[70rem] border rounded-[0.5rem] login-wrapper p-5 mb:h-screen sm:h-screen md:h-screen lg:h-[100%]  animate__animated animate__fadeInUp">
        <div className=" mb:w-full sm:w-full lg:w-2/4 h-screen flex justify-center items-center">
          <div className="animate__delay-1s animate__animated animate__fadeInUp w-[320px]">
            <h1 className='mx-[90px] font-semibold'>Đăng kí tài khoản</h1>
            <Form
              name="basic"
              className="register-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <p className="">Họ và tên</p>
              <Form.Item
                className="mb-4"
                name="name"
                rules={[
                  {
                    required: true,
                    message: t('Vui lòng nhập họ và tên!'),
                  },
                ]}
              >
                <Input
                  style={{ width: '100%' }}
                  className="input border px-[14px] py-[14px] rounded-[0.5rem]"
                  placeholder="Họ và tên"
                />
              </Form.Item>

              <Row span={24} style={{ width: '100%' }}>
                <Col span={12} style={{ paddingRight: '0.2rem' }}>
                  <p className="">Ngày sinh</p>
                  <Form.Item
                    className="mb-4"
                    name="birthday"
                    wrapperCol={{ sm: 24 }}
                    style={{ width: '100%', marginRight: '1rem' }}
                  >
                    <DatePicker className="datepicker-register w-full " format={'DD/MM/YYYY'} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <p className="">Giới tính</p>
                  <Form.Item
                    className="mb-4"
                    wrapperCol={{ sm: 24 }}
                    style={{ width: '100%', borderRadius: 'none', marginRight: 0 }}
                    name="gender"
                  >
                    <Select className="w-full dropdowregister " placeholder={"Giới tính"}>
                      <Option value="true">Nam</Option>
                      <Option value="false">Nữ</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <p className="">Số điện thoại</p>
              <Form.Item
                className="mb-4"
                name="phone"
                rules={[
                  { max: 10, message: "Số điện thoại không được quá 10 số" },
                  {
                    required: true,
                    message: "Vui lòng số điện thoại của bạn!",
                  },
                  {
                    pattern: /^(?:\d*)$/,
                    message: "Vui lòng đúng định dạng!",
                  },
                ]}
              >
                <Input
                  style={{ width: '100%' }}
                  className="input border px-[14px] py-[14px] rounded-[0.5rem]"
                  placeholder="Vui lòng nhập số điện thoại"
                />
              </Form.Item>

              <p className="">Email</p>
              <Form.Item
                className="mb-4 w-full"
                name="email"
                values={email}
                onChange={(e) => setEmail(e.target.value)}
                rules={[
                  {
                    type: 'email',
                    message: t('Định dạng của email không hợp lệ !'),
                  },
                  {
                    required: true,
                    message: t('Vui lòng nhập email của bạn !'),
                  },
                ]}
              >
                <Input
                  className="input border px-[14px] py-[14px] rounded-[0.5rem] w-full"
                  placeholder="Email"
                />
              </Form.Item>
              <p className="">Mật khẩu</p>
              <Form.Item
                className="mb-4"
                name="password"
                values={password}
                onChange={(e) => setPassword(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: t('Vui lòng nhập mật của bạn !'),
                  },
                  { max: 30, message: t('Mật khẩu của bạn bị xai định dạng') },
                  { min: 6, message: t('Mật khẩu của bạn không được ngắn quá 6 kí tự !') },
                ]}
              >
                <Input.Password
                  style={{ width: '100%' }}
                  className="border password px-[14px] py-[14px] rounded-[0.5rem]"
                  placeholder="Mật khẩu"
                />
              </Form.Item>
              {/* chưa làm confirm */}
              <p className="">Nhập lại mật khẩu</p>
              <Form.Item
                className="mb-4"
                name="confirmPassword"
                values={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: t('Vui lòng nhập lại nhận mật khẩu!'),
                  },
                  { max: 30, message: t('Mật khẩu của bạn bị xai định dạng') },
                  { min: 6, message: t('Mật khẩu của bạn không được ngắn quá 6 kí tự !') },
                  {
                    validator: (_, value) =>
                      value === password
                        ? Promise.resolve()
                        : Promise.reject(new Error(t('Mật khẩu không giống nhau !'))),
                  },
                ]}
              >
                <Input.Password
                  style={{ width: '100%' }}
                  className="border password px-[14px] py-[14px] rounded-[0.5rem]"
                  placeholder={t('Nhập lại mật khẩu')}
                />
              </Form.Item>

              <Button
                className="hover:blacks w-full rounded-[0.5rem] bg-primary btn-login text-white py-[6px] px-[12px]"
                type="primary"
                size="large"
                htmlType="submit"
                disabled={isLoading}
              >
                {isLoading ? t('Loading...') : t('Đăng kí')}
              </Button>
            </Form>
            <div className="flex justify-between w-full">
              <Link to="/Login" className="mt-5 text-blue text-left text-bold underline">
                {t('Đăng nhập vào Panther')}
              </Link>
              <Link to="/" className="mt-5 text-blue text-left text-bold underline">
                {t('Trang chính')}
              </Link>
            </div>
          </div>
        </div>
        <div className="w-2/4 mb:hidden sm:hidden lg:flex relative bg-[#e86f7d] overflow-hidden h-full flex justify-center items-center rounded-[0.5rem]">
          <div className="glass h-[80%] relative w-[30rem] rouded-[0.5rem] bg-mainColor z-10 animate__delay-1s animate__animated animate__fadeInUp">
            <h1 className="text-[30px] text-left p-5 font-semibold text-black">
              Khám phá những nơi tuyệt vời
            </h1>
            <img src="../img/img.png" className="bottom-0 w-[70%] absolute left-20 " alt="" />
            <p className="text-xl text-center text-black">
              để bắt đầu một hành trình đầy thú vị
            </p>
          </div>
          <img
            className="absolute right-[9rem] bottom-0 z-none"
            src="../img/decoration.png"
            alt=""
          />
        </div>
      </div>
      <Modal
        title="Xác nhận email của bạn"
        centered
        open={modalOpen}
        onOk={() => handleVerify()}
        onCancel={() => handleDeleteUserNotConfirm()}
      >
        <br />
        <p className='mb-1 ml-1'>{t('Nhập mã otp mà chúng tôi đã gửi cho bạn')}</p>
        <Input value={confirmCode} onChange={(e) => setConfirmCode(e.target.value)} placeholder="Mã otp" prefix={<IoIosMailOpen className='ml-4 text-[24px] ' />} />
      </Modal>
    </div>
  );
}

export default RegisterPage;
