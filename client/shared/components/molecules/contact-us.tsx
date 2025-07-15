'use client';
import React from 'react';
import Heading from '../atoms/heading';
import NewsLetter from '../atoms/newsletter';
const Contact = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div>
      <div className="to-current text-2xl pt-10 border-t">
        <Heading text1={'CONTACT'} text2={'US'} />
      </div>

      <div className="flex flex-col justify-center sm:flex-row gap-10 my-10 mb-28">
        <div className="w-full sm:max-w-[480px] bg-gray-400"></div>

        <div className="flex flex-col justify-center items-start gap-4">
          <p className="font-semibold text-altext-gray-600">Our Location</p>
          <p className="text-gray-500">
            7298 King Lodge
            <br />
            North Elton, Illinois 78154
          </p>

          <p className="text-gray-800">
            Tel: <span className="text-gray-500">+1 800 123 1234</span>
          </p>
          <p className=" text-gray-800">
            Email: <span className="text-gray-500">admin@votresite.com</span>
          </p>

          <p className="text-gray-500">Careers at Forever</p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>

          <button
            className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white  transition-all duration-500 "
            onClick={scrollToTop}
          >
            Explore
          </button>
        </div>
      </div>

      <NewsLetter />
    </div>
  );
};

export default Contact;
