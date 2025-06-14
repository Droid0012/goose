import { useCallback, useState, type FC } from 'react';

import { useViewModel } from 'src/shared/model/UseViewModel';

import type { ViewModel } from '../model/ViewModel';
import type { AuthForm, SharedStateType, StateType } from '../model/ViewModel/types';
import { Button, Card, Form, Input, Spin } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export const UIController: FC = () => {
    const { viewModel } = useViewModel<SharedStateType, StateType, ViewModel>();
    const [isPending, setIsPending] = useState(false);

    const onFinish = useCallback(
        async (form: AuthForm) => {
            setIsPending(true);
            await viewModel.auth(form);
            setIsPending(false);
        },
        [viewModel],
    );

    return (
        <div
            className=""
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                height: '100vh',
                alignItems: 'center',
                justifyItems: 'center',
            }}
        >
            <Spin
                spinning={isPending}
                size="large"
            >
                <Card
                    title={'Вход в систему'}
                    style={{
                        minWidth: '400px',
                    }}
                >
                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        style={{ maxWidth: 360 }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Введите имя пользователя!' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Имя поьзователя"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Введите пароль!' }]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Пароль"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                block
                                type="primary"
                                htmlType="submit"
                            >
                                Войти
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        </div>
    );
};
