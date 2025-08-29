import React from "react";
import { useNavigate } from "react-router-dom";

const acts = [
  {
    title: "सूचना का अधिकार अधिनियम, 2005",
    description: "यह अधिनियम नागरिकों को सरकारी विभागों से जानकारी प्राप्त करने का अधिकार देता है, जिससे शासन में पारदर्शिता और जवाबदेही सुनिश्चित होती है।",
    image: "/images/act1.jpg",
    link: "https://hi.wikipedia.org/wiki/सूचना_का_अधिकार_अधिनियम,_2005",
  },
  {
    title: "उपभोक्ता संरक्षण अधिनियम, 2019",
    description: "यह अधिनियम उपभोक्ताओं के अधिकारों की रक्षा करता है और विवाद समाधान के लिए वैधानिक व्यवस्था प्रदान करता है।",
    image: "/images/act2.jpg",
    link: "https://hi.wikipedia.org/wiki/उपभोक्ता_संरक्षण_अधिनियम,_2019",
  },
  {
    title: "पर्यावरण संरक्षण अधिनियम, 1986",
    description: "यह अधिनियम पर्यावरण की रक्षा और प्रदूषण नियंत्रण के लिए व्यापक कानूनी ढांचा प्रदान करता है।",
    image: "/images/act3.jpg",
    link: "https://hi.wikipedia.org/wiki/पर्यावरण_संरक्षण_अधिनियम,_1986",
  },
  {
    title: "शिक्षा का अधिकार अधिनियम, 2009",
    description: "यह अधिनियम 6 से 14 वर्ष के बच्चों को निशुल्क और अनिवार्य शिक्षा का मौलिक अधिकार प्रदान करता है।",
    image: "/images/act4.jpg",
    link: "https://hi.wikipedia.org/wiki/शिक्षा_का_अधिकार_अधिनियम,_2009",
  },
  {
    title: "भारतीय दंड संहिता, 1860",
    description: "यह अधिनियम भारत में अपराधों की परिभाषा और उनके लिए दंड निर्धारित करता है।",
    image: "/images/act5.jpg",
    link: "https://hi.wikipedia.org/wiki/भारतीय_दंड_संहिता",
  },
  {
    title: "सूचना प्रौद्योगिकी अधिनियम, 2000",
    description: "यह अधिनियम भारत में साइबर अपराधों और इलेक्ट्रॉनिक लेन-देन को नियंत्रित करता है।",
    image: "/images/act6.jpg",
    link: "https://hi.wikipedia.org/wiki/सूचना_प्रौद्योगिकी_अधिनियम,_2000",
  },
  {
    title: "वस्तु एवं सेवा कर अधिनियम, 2017",
    description: "यह अधिनियम पूरे भारत में एक समान अप्रत्यक्ष कर प्रणाली को लागू करता है।",
    image: "/images/act7.jpg",
    link: "https://hi.wikipedia.org/wiki/वस्तु_एवं_सेवा_कर",
  },
  {
    title: "मोटर वाहन अधिनियम, 1988 (संशोधित 2019)",
    description: "यह अधिनियम भारत में सड़क यातायात के नियमों और वाहनों की सुरक्षा को नियंत्रित करता है।",
    image: "/images/act8.jpg",
    link: "https://hi.wikipedia.org/wiki/मोटर_वाहन_अधिनियम,_1988",
  },
  {
    title: "कार्यस्थल पर महिलाओं का यौन उत्पीड़न (रोकथाम, निषेध और प्रतितोष) अधिनियम, 2013",
    description: "यह अधिनियम कार्यस्थलों पर महिलाओं की गरिमा और सुरक्षा को सुनिश्चित करता है।",
    image: "/images/act9.jpg",
    link: "https://hi.wikipedia.org/wiki/कार्यस्थल_पर_महिलाओं_का_यौन_उत्पीड़न",
  },
];

export default function Acts() {
  const navigate = useNavigate();

  const handleCardClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white py-10 px-4 md:px-10">
      <h1 className="text-4xl font-bold text-center text-green-800 mb-12">
        भारत के महत्वपूर्ण अधिनियम
      </h1>
      <div className="grid gap-10 md:grid-cols-3">
        {acts.map((act, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(act.link)}
            className="bg-white cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-green-200 hover:scale-105"
          >
            <img
              src={act.image}
              alt={act.title}
              className="h-52 w-full object-cover rounded-t-2xl"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-green-900 mb-2">
                {act.title}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {act.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}