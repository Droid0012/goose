import { Button, Flex, Typography } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface GameWidgetProps {
  startTime: string;
  endTime: string;
  serverNow: string;
  tapCount: number;
  donstCount: boolean;
  onTap: () => Promise<boolean>;
  onFinish: () => Promise<unknown>;
}

export const GameWidget: React.FC<GameWidgetProps> = ({
  startTime,
  endTime,
  serverNow,
  donstCount,
  onTap,
  onFinish,
  ...props
}) => {
  // Парсинг ISO‑строк в timestamp (ms) один раз при изменении пропсов
  const startTs = useMemo(() => Date.parse(startTime), [startTime]);
  const endTs = useMemo(() => Date.parse(endTime), [endTime]);
  const serverNowTs = useMemo(() => Date.parse(serverNow), [serverNow]);
  const valid = useMemo(
    () => !isNaN(startTs) && !isNaN(endTs) && !isNaN(serverNowTs),
    [startTs, endTs, serverNowTs],
  );

  // Флаг вызова onFinish, чтобы не вызывать его несколько раз
  const finishCBCalled = useRef(false);

  // Локальное состояние времени получаем сразу через Date.now()
  const [now, setNow] = useState(Date.now());
  const [status, setStatus] = useState<'waiting' | 'active' | 'ended'>(
    valid ? (Date.now() >= endTs ? 'ended' : Date.now() >= startTs ? 'active' : 'waiting') : 'waiting',
  );
  const [currentTapCount, setCurrentTapCount] = useState(props.tapCount);

  // Функция вычисления нового статуса на основе текущего времени (системное время)
  const computeStatus = (t: number) => {
    if (t >= endTs) return 'ended';
    if (t >= startTs) return 'active';
    return 'waiting';
  };

  // Обновляем время через requestAnimationFrame с использованием Date.now()
  useEffect(() => {
    if (!valid) return;

    let animationFrameId: number;
    const tick = () => {
      const currentTime = Date.now();
      setNow(currentTime);
      const newStatus = computeStatus(currentTime);
      setStatus(newStatus);

      if (currentTime < endTs) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [startTs, endTs, valid]);

  // Вычисление оставшегося времени для отображения
  const renderTime = () => {
    if (!valid) return '—';
    const target = status === 'waiting' ? startTs : endTs;
    const delta = Math.max(0, target - now);
    // В момент нуля вызываем onFinish
    if (delta === 0 && finishCBCalled.current === false) {
      finishCBCalled.current = true;
      onFinish();
    }
    return `${Math.ceil(delta / 1000)}s`;
  };

  // Асинхронный обработчик клика – увеличивает счётчик, если игра активна
  // и вызывает onTap, не блокируя кнопку
  const handleTap = () => {
    if (status !== 'active' || donstCount) return;

    onTap()
      .then(success => {
        if (success) {
          setCurrentTapCount(prev => prev + 1);
        }
      })
      .catch(error => {
        console.error('Ошибка в onTap:', error);
      });
  };

  // Надпись кнопки определяется статусом и оставшимся временем
  const getLabel = () => {
    const messages = {
      waiting: `Ждём начала (${renderTime()})`,
      active: `Тапай! (${renderTime()})`,
      ended: `Время вышло`,
    };
    return messages[status];
  };

  if (!valid) {
    return <Typography.Text>Некорректное время</Typography.Text>;
  }

  return (
    <Flex vertical justify="center" gap={8}>
      <Typography.Text style={{ margin: '0 auto' }}>
        Тапов: {currentTapCount}
      </Typography.Text>
      <Button disabled={status !== 'active'} onClick={handleTap}>
        {getLabel()}
      </Button>
    </Flex>
  );
};
