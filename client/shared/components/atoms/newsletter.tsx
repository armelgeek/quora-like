'use client';
import React from 'react';
const NewsLetter = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
    alert('Subscribed successfully!');
  };

  return (
    <div className="text-center my-10">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now
      </p>
      <p className="text-gray-500 mt-3">
        Be the first to know about new arrivals, sales & promos!
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full sm:flex-1 outline-none "
          required
        />
        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4 "
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
