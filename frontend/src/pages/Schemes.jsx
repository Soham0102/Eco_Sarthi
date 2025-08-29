import React from "react";


const schemes = [
  {
    title: "प्रधानमंत्री आवास योजना",
    description:
      "प्रधानमंत्री आवास योजना का उद्देश्य सभी के लिए आवास उपलब्ध कराना है। इस योजना के अंतर्गत शहरी और ग्रामीण क्षेत्रों में गरीबों को पक्के मकान मुहैया कराए जाते हैं। इसमें लाभार्थियों को सब्सिडी भी प्रदान की जाती है ताकि वे अपने घर का सपना साकार कर सकें।",
    image: "/images/scheme1.jpg",
    link: "https://hi.wikipedia.org/wiki/प्रधानमंत्री_आवास_योजना",
  },
  {
    title: "स्वच्छ भारत अभियान",
    description:
      "स्वच्छ भारत अभियान एक राष्ट्रीय स्तर पर चलाया गया स्वच्छता मिशन है जिसका उद्देश्य भारत को खुले में शौच से मुक्त करना और स्वच्छता के प्रति जन-जागरूकता फैलाना है। इस अभियान में व्यक्तिगत शौचालयों के निर्माण, कूड़ा प्रबंधन और सफाई पर जोर दिया गया है।",
    image: "/images/scheme2.jpg",
    link: "https://hi.wikipedia.org/wiki/स्वच्छ_भारत_अभियान",
  },
  {
    title: "आयुष्मान भारत योजना",
    description:
      "आयुष्मान भारत भारत सरकार की एक स्वास्थ्य बीमा योजना है जिसके तहत आर्थिक रूप से कमजोर परिवारों को ₹5 लाख तक का निशुल्क इलाज प्रदान किया जाता है। यह योजना सरकारी और सूचीबद्ध निजी अस्पतालों में लागू है।",
    image: "/images/Scheme3.jpg",
    link: "https://hi.wikipedia.org/wiki/आयुष्मान_भारत_योजना",
  },
  {
    title: "प्रधानमंत्री उज्ज्वला योजना",
    description:
      "इस योजना का उद्देश्य गरीब परिवारों को स्वच्छ ईंधन प्रदान करना है। इसके अंतर्गत बीपीएल परिवारों की महिलाओं को मुफ्त गैस कनेक्शन और सिलेंडर उपलब्ध कराए जाते हैं जिससे खाना पकाने के पारंपरिक और हानिकारक तरीकों से छुटकारा मिल सके।",
    image: "/images/Scheme4.jpg",
    link: "https://hi.wikipedia.org/wiki/प्रधानमंत्री_उज्ज्वला_योजना",
  },
  {
    title: "प्रधानमंत्री जन धन योजना",
    description:
      "यह योजना वित्तीय समावेशन को बढ़ावा देने के लिए शुरू की गई थी। इसके तहत हर नागरिक का बैंक खाता खोला जाता है जिसमें ज़ीरो बैलेंस की सुविधा, डेबिट कार्ड और बीमा कवर जैसी सेवाएं शामिल हैं।",
    image: "/images/Scheme5.jpg",
    link: "https://hi.wikipedia.org/wiki/प्रधानमंत्री_जन_धन_योजना",
  },
  {
    title: "बेटी बचाओ बेटी पढ़ाओ",
    description:
      "यह योजना बालिका भ्रूण हत्या को रोकने और बालिकाओं की शिक्षा को बढ़ावा देने के उद्देश्य से शुरू की गई है। इसका लक्ष्य लड़कियों को समान अधिकार और अवसर प्रदान करना है।",
    image: "/images/Scheme6.jpg",
    link: "https://hi.wikipedia.org/wiki/बेटी_बचाओ_बेटी_पढ़ाओ_योजना",
  },
  {
    title: "सुकन्या समृद्धि योजना",
    description:
      "यह योजना बालिका के नाम पर बचत खाता खोलने की सुविधा देती है जिससे माता-पिता अपनी बेटी की शिक्षा और विवाह के लिए आर्थिक रूप से तैयार हो सकें। इसमें टैक्स में छूट और उच्च ब्याज दर की सुविधा दी जाती है।",
    image: "/images/Scheme7.jpg",
    link: "https://hi.wikipedia.org/wiki/सुकन्या_समृद्धि_योजना",
  },
  {
    title: "स्टार्टअप इंडिया",
    description:
      "स्टार्टअप इंडिया एक पहल है जिसका उद्देश्य युवाओं को स्टार्टअप शुरू करने के लिए आवश्यक सहायता, प्रशिक्षण और वित्तीय सहयोग प्रदान करना है। इससे देश में उद्यमिता को बढ़ावा मिलता है।",
    image: "/images/Scheme8.jpg",
    link: "https://hi.wikipedia.org/wiki/स्टार्टअप_इंडिया",
  },
  {
    title: "डिजिटल इंडिया मिशन",
    description:
      "डिजिटल इंडिया मिशन का उद्देश्य भारत को डिजिटल रूप से सशक्त समाज और ज्ञान आधारित अर्थव्यवस्था बनाना है। इसके अंतर्गत इंटरनेट कनेक्टिविटी, डिजिटल सेवाएं, ऑनलाइन शिक्षा, और सरकारी सेवाओं का डिजिटलीकरण शामिल है।",
    image: "/images/Scheme9.jpg",
    link: "https://hi.wikipedia.org/wiki/डिजिटल_इंडिया",
  },
  {
    title: "राष्ट्रीय स्वास्थ्य मिशन",
    description:
      "इस मिशन का उद्देश्य ग्रामीण और शहरी क्षेत्रों में गुणवत्तापूर्ण स्वास्थ्य सेवाओं की पहुंच को सुनिश्चित करना है। इसमें मातृ एवं शिशु स्वास्थ्य, टीकाकरण और स्वास्थ्य केंद्रों को सशक्त बनाने पर विशेष ध्यान दिया जाता है।",
    image: "/images/Scheme10.jpg",
    link: "https://hi.wikipedia.org/wiki/राष्ट्रीय_स्वास्थ्य_मिशन",
  },
  {
    title: "स्टैंड-अप इंडिया योजना",
    description:
      "यह योजना अनुसूचित जाति, जनजाति और महिला उद्यमियों को ऋण सुविधा प्रदान करने के लिए शुरू की गई है ताकि वे अपना व्यवसाय या उद्योग शुरू कर सकें।",
    image: "/images/Scheme11.jpg",
    link: "https://hi.wikipedia.org/wiki/स्टैंड_अप_इंडिया_योजना",
  },
  {
    title: "दीनदयाल उपाध्याय ग्रामीण कौशल योजना",
    description:
      "इस योजना का उद्देश्य ग्रामीण युवाओं को रोजगारोन्मुखी कौशल प्रशिक्षण देना है ताकि वे स्वरोजगार या नौकरी के योग्य बन सकें। यह योजना विशेष रूप से गरीबी रेखा के नीचे रहने वाले युवाओं के लिए चलाई जाती है।",
    image: "/images/Scheme12.jpg",
    link: "https://hi.wikipedia.org/wiki/दीनदयाल_उपाध्याय_ग्रामीण_कौशल_योजना",
  },
];

export default function Schemes() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="py-12 px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-14 underline decoration-indigo-400">
          भारत सरकार की प्रमुख योजनाएँ
        </h1>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme, index) => (
            <div
              key={index}
              onClick={() => window.open(scheme.link, "_blank")}
              className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <img
                src={scheme.image}
                alt={scheme.title}
                className="h-52 w-full object-cover rounded-t-2xl"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
                  {scheme.title}
                </h2>
                <p className="text-gray-700 text-base">{scheme.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}