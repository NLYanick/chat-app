function AuthLayout({ children }) {
  return (
    <div className='flex flex-col items-center gap-12 shadow-lg p-8 rounded-lg bg-(--secondary-color) w-full max-w-md'>
      {children}
    </div>
  );
}

export default AuthLayout;