export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(" ");
}

export function smoothScroll(targetY: number, duration: number) {
  // 获取当前滚动的位置
  const start = window.pageYOffset;
  // 计算距离
  const distance = targetY - start;
  // 记录动画开始的时间
  let startTime: number | null = null;

  // 创建一个动画函数
  const animation = (currentTime: number) => {
    // 如果 startTime 没有设置
    if (!startTime) startTime = currentTime;
    // 计算动画已经运行了多久
    const elapsedTime = currentTime - startTime;
    // 计算进度
    const progress = Math.min(elapsedTime / duration, 1);
    // 计算当前的滚动位置
    const currentPosition = start + distance * progress;
    // 设置滚动位置
    window.scrollTo(0, currentPosition);

    // 如果动画还没有结束
    if (elapsedTime < duration) {
      // 继续执行动画
      requestAnimationFrame(animation);
    }
  };

  // 执行动画
  requestAnimationFrame(animation);
}
