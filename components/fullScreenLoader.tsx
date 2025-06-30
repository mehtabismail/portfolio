export default function FullScreenLoader() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-70'></div>
    </div>
  );
}
