'use client'

import Image from 'next/image';
import React, { useState } from 'react';

function CustomImageRenderer({ data }:any) {
  const [showModal, setShowModal] = useState(false);
  const src = data.file.url;

  const handleImageClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡
    setShowModal(true); // 显示模态窗口
  };

  return (
    <div className='relative w-full'>
      <div onClick={handleImageClick} className="cursor-pointer">
        <Image alt='image' layout='responsive' width={1024} height={768} objectFit="contain" src={src} />
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={() => setShowModal(false)}
        >
          <div className="max-w-full max-h-full overflow-auto">
            <Image alt='image' src={src} layout='intrinsic' width={1024} height={768} objectFit="contain" />
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomImageRenderer;
