import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Ar from "../assets/ar.png";
import En from "../assets/en.png";
const languages = [
  { code: "EN", name: "English", flag: En },
  { code: "AR", name: "Arabic", flag: Ar },
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <div className="relative hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 w-25">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-around focus:outline-none"
      >
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-lg">
          <img src={selectedLanguage.flag} alt="" /> 
        </span>
        <span className="mx-3">{selectedLanguage.code}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-24 bg-white shadow-lg rounded-md  py-1 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setSelectedLanguage(language);
                setIsOpen(false);
              }}
              className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-lg mr-2">
                <img src={language.flag} alt={language.flag} />
              </span>
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
