import React from "react";

export default function Help() {
  const contacts = [
    {
      name: "आपदा प्रबंधन विभाग (Disaster Management)",
      phone: "1078",
      email: "ndma@nic.in",
    },
    {
      name: "महिला हेल्पलाइन (Women Helpline)",
      phone: "1091 / 181",
      email: "women-helpline@gov.in",
    },
    {
      name: "बच्चों के लिए हेल्पलाइन (Childline)",
      phone: "1098",
      email: "childline@childlineindia.org.in",
    },
    {
      name: "स्वास्थ्य और परिवार कल्याण मंत्रालय",
      phone: "1800-180-1104",
      email: "healthhelp@nic.in",
    },
    {
      name: "उपभोक्ता हेल्पलाइन (Consumer Affairs)",
      phone: "1800-11-4000 / 14404",
      email: "consumeraffairs@gov.in",
    },
    {
      name: "पुलिस सहायता (Police)",
      phone: "100",
      email: "police-support@gov.in",
    },
    {
      name: "आग और बचाव सेवा (Fire & Rescue)",
      phone: "101",
      email: "firedept@gov.in",
    },
    {
      name: "एम्बुलेंस सेवा (Ambulance)",
      phone: "102 / 108",
      email: "ambulance@gov.in",
    },
    {
      name: "डिजिटल इंडिया हेल्पलाइन",
      phone: "1800-111-555",
      email: "digitalindia@meity.gov.in",
    },
    {
      name: "रेलवे हेल्पलाइन (Railway)",
      phone: "139",
      email: "railhelp@indianrailways.gov.in",
    },
    {
      name: "साइबर क्राइम हेल्पलाइन",
      phone: "1930",
      email: "cybercrime@gov.in",
    },
    {
      name: "वरिष्ठ नागरिक हेल्पलाइन",
      phone: "14567",
      email: "seniorcitizen@gov.in",
    },
    {
      name: "आयुष्मान भारत हेल्पलाइन",
      phone: "14555 / 1800-111-565",
      email: "pmjay@ndhm.gov.in",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-800 mb-4">मदद केंद्र (Help Center)</h1>
        <p className="text-gray-700 text-base max-w-2xl mx-auto">
          सभी सरकारी योजनाओं, आपातकालीन सेवाओं और आवश्यक संपर्क विवरण यहां दिए गए हैं। आप किसी भी सहायता के लिए नीचे दिए गए संपर्कों पर कॉल या ईमेल कर सकते हैं।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {contacts.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-green-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-5"
          >
            <h2 className="text-xl font-semibold text-green-900 mb-3">{item.name}</h2>
            <p className="text-gray-800 mb-1">
              📞 <span className="font-medium">फोन:</span> {item.phone}
            </p>
            <p className="text-gray-800">
              📧 <span className="font-medium">ईमेल:</span> {item.email}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 text-sm text-gray-600">
        यदि कोई नंबर कार्य नहीं करता है, तो कृपया संबंधित विभाग की आधिकारिक वेबसाइट पर जाएं।
      </div>
    </div>
  );
}