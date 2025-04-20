import React from "react";
interface TextCardProps {
    title: string;
    content: string;    
}
const TextCard = ({ title, content }: TextCardProps) => {
  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600">{content}</p>
    </div>
  );
};

export default TextCard;