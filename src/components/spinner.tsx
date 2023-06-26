interface SpinnerProps {
  size?: 'large' | 'small';
}

export default function Spinner({ size = 'large' }: SpinnerProps) {
  return (
    <div
      className={`${
        size === 'large' ? 'h-12 w-12 border-4' : 'h-6 w-6 border-2'
      } animate-spin rounded-full border-solid border-apex border-r-transparent`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
