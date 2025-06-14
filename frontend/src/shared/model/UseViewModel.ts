import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';

import type { PartialVMWithMetaType, ViewModelType } from '../config/types';
import { urlTransformer } from '../lib/URLTransformer';

import type { AbstractViewModel } from './AbstractViewModel';
import { getNotifier } from '../lib/NotifierStore';

export function useViewModel<
    SHARED_STATE,
    STATE extends ViewModelType<SHARED_STATE>,
    VIEW_MODEL extends AbstractViewModel<STATE>,
>(): {
    currentState: Readonly<STATE> | null;
    initialState: Promise<PartialVMWithMetaType<STATE>> | PartialVMWithMetaType<STATE>;
    viewModel: VIEW_MODEL;
} {
    const navigate = useNavigate();

    const { data, viewModel, mount, unMount } = useLoaderData<{
        data: Promise<PartialVMWithMetaType<STATE>> | PartialVMWithMetaType<STATE>;
        viewModel: VIEW_MODEL;
        mount?: () => void;
        unMount?: () => void;
    }>();

    const [currentState, setCurrentState] = useState<Readonly<STATE> | null>(null);

    const handleRedirects = useCallback(
        ({ state, redirect }: PartialVMWithMetaType<STATE>) => {
            if (Object.keys(state.location).length && !redirect) {
                const currentLocation = urlTransformer.getViewConfig(location.href);

                if (
                    (location.hash !== state.location.hash ||
                        !isEqual(currentLocation.query, state.location.query)) &&
                    currentLocation.path === state.location.path
                ) {
                    navigate(urlTransformer.createURLFromConfig(state.location), {
                        replace: true,
                    });
                }
            }

            if (redirect) {
                if (!redirect.config?.target?.target || redirect.config.target.target === '_self') {
                    navigate(redirect.to, redirect.config);
                } else {
                    window.open(redirect.to, redirect.config.target.target);
                }
            }
        },
        [navigate],
    );

    const handleNotifications = useCallback(({ notification }: PartialVMWithMetaType<STATE>) => {
        setTimeout(() => {
            if (notification) {
                getNotifier()[notification.type]({
                    message: notification.content.children,
                });
            }
        });
    }, []);

    const observer = useCallback(
        (data: PartialVMWithMetaType<STATE>) => {
            setCurrentState(data.state);
            handleNotifications(data);
            handleRedirects(data);
        },
        [setCurrentState, handleRedirects, handleNotifications],
    );

    useEffect(() => {
        if (data instanceof Promise) {
            data.then(d => {
                handleRedirects(d);
                handleNotifications(d);
            });
        } else {
            handleRedirects(data);
            handleNotifications(data);
        }
    }, [data]);

    useEffect(() => {
        if (mount) {
            mount();
        }
        viewModel.observer = observer;

        return () => {
            if (viewModel.beforeUnload) {
                viewModel.beforeUnload();
            }

            viewModel.observer = null;
            setCurrentState(null);
            if (unMount) {
                unMount();
            }
        };
    }, []);

    return { currentState: currentState, initialState: data, viewModel };
}
