import Button from './Button';

function Modal({ isOpen, onClose = () => {}, children }) {

  return (
    <>
      {isOpen && (
        <div className='fixed size-full bg-[#000000AA] flex justify-center items-center'>
          <div className='relative w-80 sm:w-120 min-h-32 sm:min-h-48 bg-(--primary-color-light) rounded-lg p-4 sm:p-6'>
            <div className='flex flex-col items-center justify-center gap-4 h-full min-h-full'>
              <button
                onClick={onClose}
                className='cursor-pointer absolute right-0 top-0 size-10'
              >
                <span className='leading-none text-(--secondary-color) text-4xl'>&times;</span>
              </button>

              {children}

              <Button label="Close" onClick={onClose} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal