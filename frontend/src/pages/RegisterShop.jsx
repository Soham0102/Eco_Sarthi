import React, { useState } from "react";
import axios from "axios";

export default function RegisterShop() {
  const [type, setType] = useState("scrap");
  const [form, setForm] = useState({
    name: "",
    owner: "",
    phone: "",
    email: "",
    area: "",
    city: "",
    address: "",
    services: "",
    specialties: "",
    workingHours: "",
    establishedYear: "",
    pickupAvailable: false,
    minimumQuantity: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type: t, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: t === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        services: form.services.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (type === 'scrap') {
        payload.specialties = form.specialties.split(',').map(s => s.trim()).filter(Boolean);
        await axios.post('http://localhost:5000/api/scrap-shops', payload);
      } else {
        await axios.post('http://localhost:5000/api/compost-makers', payload);
      }
      alert('Submitted! Your listing will be reviewed.');
      setForm({
        name: "", owner: "", phone: "", email: "", area: "", city: "", address: "",
        services: "", specialties: "", workingHours: "", establishedYear: "", pickupAvailable: false, minimumQuantity: ""
      });
    } catch (e) {
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Register Your Shop</h1>
          <p className="text-emerald-100">List your Scrap Shop or Compost Maker service</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <label className="mr-4 font-medium">Type:</label>
            <label className="mr-4"><input type="radio" name="type" checked={type==='scrap'} onChange={()=>setType('scrap')} /> <span className="ml-1">Scrap Shop</span></label>
            <label><input type="radio" name="type" checked={type==='compost'} onChange={()=>setType('compost')} /> <span className="ml-1">Compost Maker</span></label>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Business Name" required className="border px-3 py-2 rounded" />
            <input name="owner" value={form.owner} onChange={handleChange} placeholder="Owner Name" required className="border px-3 py-2 rounded" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required className="border px-3 py-2 rounded" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border px-3 py-2 rounded" />
            <input name="area" value={form.area} onChange={handleChange} placeholder="Area" required className="border px-3 py-2 rounded" />
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="border px-3 py-2 rounded" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required className="border px-3 py-2 rounded md:col-span-2" />
            <input name="services" value={form.services} onChange={handleChange} placeholder="Services (comma separated)" required className="border px-3 py-2 rounded md:col-span-2" />
            {type==='scrap' && (
              <input name="specialties" value={form.specialties} onChange={handleChange} placeholder="Specialties (comma separated)" required className="border px-3 py-2 rounded md:col-span-2" />
            )}
            <input name="workingHours" value={form.workingHours} onChange={handleChange} placeholder="Working Hours" className="border px-3 py-2 rounded" />
            <input name="establishedYear" value={form.establishedYear} onChange={handleChange} placeholder="Established Year" className="border px-3 py-2 rounded" />
            {type==='scrap' && (
              <>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="pickupAvailable" checked={form.pickupAvailable} onChange={handleChange} /> Home Pickup Available
                </label>
                <input name="minimumQuantity" value={form.minimumQuantity} onChange={handleChange} placeholder="Minimum Quantity (e.g., 5 kg)" className="border px-3 py-2 rounded" />
              </>
            )}
            <button type="submit" disabled={submitting} className={`md:col-span-2 bg-emerald-600 text-white py-3 rounded-lg ${submitting? 'opacity-60' : 'hover:bg-emerald-700'}`}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


