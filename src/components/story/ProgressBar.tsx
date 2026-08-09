/* Reading progress. The scroll engine writes scaleX on this element inside the
   shared frame — it is deliberately not its own listener. */
export function ProgressBar() {
  return (
    <div
      data-progress-bar=""
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-accent"
    />
  );
}

export default ProgressBar;
