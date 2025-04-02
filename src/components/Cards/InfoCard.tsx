import React from "react";

interface InfoCardProps {
  Icon: React.ElementType;
  text: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ Icon, text }) => {
  return (
    <div className="relative flex flex-col items-center p-6 bg-neutral-900 rounded-xl shadow-xl 
                    text-amber-50 overflow-hidden group transition-transform duration-300 hover:scale-105">

      {/* Глянцевый эффект */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-zinc-950 
                        bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat hover:bg-[position:200%_0,0_0] 
                        hover:duration-[1500ms]"></div>
      </div>

      {/* Контент */}
      <Icon className="w-12 h-12 text-orange-500" />
      <p className="mt-2 text-lg text-beige-300">{text}</p>
    </div>
  );
};

export default InfoCard;
