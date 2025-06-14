import { type FC, Suspense, useCallback, useState } from 'react';
import { Await } from 'react-router';

import { useViewModel } from 'src/shared/model/UseViewModel';

import type { ViewModel } from '../model/ViewModel';
import type { CurrentBattlesListItem, SharedStateType, StateType } from '../model/ViewModel/types';
import { Button, Flex, Space, Spin, Table } from 'antd';
import { CopyOutlined, PlusOutlined } from '@ant-design/icons';

export const UIController: FC = () => {
    const { currentState, initialState, viewModel } = useViewModel<
        SharedStateType,
        StateType,
        ViewModel
    >();

    const [isPending, setIsPending] = useState(false);

    const onAdd = useCallback(async () => {
        setIsPending(true);
        await viewModel.createBattle();
        setIsPending(false);
    }, [viewModel]);

    return (
        <Spin spinning={isPending}>
            <Flex
                vertical
                gap={'middle'}
                style={{
                    padding: '16px',
                }}
            >
                <Button
                    onClick={onAdd}
                    type="primary"
                    icon={<PlusOutlined />}
                    disabled={isPending}
                    style={{
                        alignSelf: 'end',
                    }}
                >
                    Добавить битву
                </Button>
                <Suspense
                    fallback={
                        <Spin
                            fullscreen
                            size="large"
                        />
                    }
                >
                    <Await resolve={initialState}>
                        {({ state: loaderData }: Awaited<typeof initialState>) => {
                            const state = currentState ?? loaderData;

                            return (
                                <Table<CurrentBattlesListItem>
                                    rowKey={record => record.id}
                                    columns={[
                                        {
                                            title: 'Идентификатор',
                                            dataIndex: 'id',
                                            key: 'id',
                                        },
                                        {
                                            title: 'Начало',
                                            dataIndex: 'startAt',
                                            key: 'startAt',
                                        },
                                        {
                                            title: 'Окончание',
                                            dataIndex: 'endAt',
                                            key: 'endAt',
                                        },
                                        {
                                            title: 'Ссылка',
                                            dataIndex: 'gameUrl',
                                            key: 'gameUrl',
                                            render: (_, record) => {
                                                return (
                                                    <Space>
                                                        {' '}
                                                        <a href={record.gameUrl}>Перейти</a>
                                                        <Button
                                                            size="small"
                                                            icon={<CopyOutlined />}
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    record.gameUrl,
                                                                );
                                                            }}
                                                        />
                                                    </Space>
                                                );
                                            },
                                        },
                                    ]}
                                    dataSource={state.viewCurrentBattlesList.list}
                                />
                            );
                        }}
                    </Await>
                </Suspense>
            </Flex>
        </Spin>
    );
};
