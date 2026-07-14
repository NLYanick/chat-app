function SinglePageLayout({ title, children }) {
  return (
    <div className='flex flex-col gap-8 pb-8 min-w-96'>
      <h1 className='text-4xl font-semibold mt-16 sm:mt-8 mb-4'>{title}</h1>
      
      <div className="flex flex-col gap-8 w-full">
        {children}
      </div>
    </div>
  );
}

export default SinglePageLayout;