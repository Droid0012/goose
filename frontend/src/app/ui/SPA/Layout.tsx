import { Layout, notification, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Suspense } from 'react';
import { Await, Outlet } from 'react-router';

import type { ViewModel } from 'src/app/model/ViewModel';
import type { AppStateType } from 'src/app/model/ViewModel/types';
import { useViewModel } from 'src/shared/model/UseViewModel';

import './Layout.module.scss';
import { setNotifier } from 'src/shared/lib/NotifierStore';

export const DevLayout = () => {
    const { initialState } = useViewModel<object, AppStateType, ViewModel>();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [api, contextHolder] = notification.useNotification({
        pauseOnHover: true,
        placement: 'bottomRight',
    });

    setNotifier(api);

    return (
        <Suspense>
            <Await resolve={initialState}>
                {() => {
                    return (
                        <>
                            {contextHolder}
                            <Layout
                                style={{
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                    minHeight: '100vh',
                                }}
                            >
                                <Content style={{ padding: '0 24px', minHeight: 280 }}>
                                    <Outlet />
                                </Content>
                            </Layout>
                        </>
                    );
                }}
            </Await>
        </Suspense>
    );
};
