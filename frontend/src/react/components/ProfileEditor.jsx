import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import AvatarEditor from 'react-avatar-editor'

const Editor = forwardRef(({ imageSrc, scale, rotate }, ref) => {
  const editorRef = useRef();

  useImperativeHandle(ref, () => ({
    getCroppedImage: () => {
      if (editorRef.current) {
        return editorRef.current.getImage();
      }
      return null;
    }
  }));

  return (
    <AvatarEditor
      ref={editorRef}
      image={imageSrc}
      borderRadius={100}
      border={5}
      scale={scale}
      rotate={rotate}
    />
  );
});


function ProfileEditor({ imageSrc, ref }) {

  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  return (
    <>
      <Editor
        ref={ref}
        imageSrc={imageSrc}
        scale={scale}
        rotate={rotate}
      />
      {/* <AvatarEditor
        ref={editorRef}
        image={imageSrc}
        borderRadius={100}
        border={5}
        scale={scale}
        rotate={rotate}
      /> */}

      <div className='flex flex-col gap-1'>
        <input type="range" name="state" min="0.5" step={0.25} max="5" value={scale} onChange={(e) => setScale(e.target.value)} className='w-48' />
        <span>{scale}</span>
      </div>

      <div className='flex gap-4'>
        <button onClick={() => setRotate(rotate + 90)}>Flip Left</button>
        <button onClick={() => setRotate(rotate + 90)}>Flip Right</button>
      </div>
    </>
  );
}

export default ProfileEditor