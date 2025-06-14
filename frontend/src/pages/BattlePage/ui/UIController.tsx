import { Flex, Spin, Typography } from 'antd';
import { Suspense, type FC } from 'react';
import { Await } from 'react-router';
import { useViewModel } from 'src/shared/model/UseViewModel';
import type { SharedStateType, StateType } from '../model/ViewModel/types';
import type { ViewModel } from '../model/ViewModel';
import { GameWidget } from './GameWidget';

export const UIController: FC = () => {
    const { currentState, initialState, viewModel } = useViewModel<
        SharedStateType,
        StateType,
        ViewModel
    >();

    return (
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
                            <Flex
                                vertical
                                gap={8}
                            >
                                <GameWidget
                                    startTime={state.battle.battle.startAt}
                                    endTime={state.battle.battle.endAt}
                                    serverNow={state.battle.now}
                                    tapCount={state.battle.battleStats.taps}
                                    donstCount={state.battle.user.alwaysZero}
                                    onTap={viewModel.tap}
                                    onFinish={viewModel.onBattleFinished}
                                />

                                {state.results && (
                                    <Typography.Text
                                        style={{
                                            margin: '0 auto',
                                        }}
                                    >
                                        {state.results.winner?.isCurrentUser
                                            ? `Вы победили c ${state.results.winner.score} очками`
                                            : `Победил ${state.results.winner?.username} c ${state.results.winner?.score} очками`}
                                    </Typography.Text>
                                )}
                            </Flex>
                        </div>
                    );
                }}
            </Await>
        </Suspense>
    );
};
