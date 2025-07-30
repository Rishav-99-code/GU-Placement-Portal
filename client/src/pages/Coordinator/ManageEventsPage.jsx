// frontend/src/pages/Coordinator/ManageEventsPage.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import BackButton from '../../components/common/BackButton';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ title:'', description:'', eventType:'', dateTime:'', venue:'', brochure:null });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch(err) { toast.error('Failed to load events'); }
    setLoading(false);
  };

  useEffect(()=>{ fetchEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.title||!formData.description||!formData.eventType||!formData.dateTime||!formData.venue){ toast.error('Fill all required'); return; }
    const fd = new FormData();
    Object.entries(formData).forEach(([k,v])=>{
      if(k==='brochure' && v) fd.append('brochure', v); else if(k!=='brochure') fd.append(k,v);
    });
    const isEdit = !!formData.id;
    let res;
    if(isEdit){ fd.delete('id'); res = await eventService.updateEvent(formData.id, fd);} else { res = await eventService.createEvent(fd);}
    try {
      await res;
      toast.success('Event created');
      setFormOpen(false);
      setFormData({ title:'', description:'', eventType:'', dateTime:'', venue:'', brochure:null });
      fetchEvents();
    } catch(err){ toast.error('Failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <BackButton to="/coordinator/dashboard" className="text-gray-400 hover:text-gray-200 mb-4" />
      </div>
      <Card className="bg-gray-800 max-w-6xl mx-auto">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-gray-50 text-2xl">Manage Events</CardTitle>
          <Button onClick={()=>setFormOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">Create Event</Button>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading…</p> : events.length===0 ? <p>No events.</p> : (
            <ul className="space-y-3">
              {events.map(ev=> (
                <li key={ev._id} className="border border-gray-700 p-4 rounded">
                  <p className="font-semibold text-lg">{ev.title}</p>
                  <p>{new Date(ev.dateTime).toLocaleString()} – {ev.venue}</p>
                  <p className="text-sm text-gray-400">{ev.eventType}</p>
                  <p className="mt-1">{ev.description}</p>
                  {ev.brochureUrl && <a className="text-blue-400 underline text-sm" href={`http://localhost:5000${ev.brochureUrl}`} target="_blank">Brochure</a>}
                  <div className="mt-2 space-x-2">
                    <Button size="sm" variant="outline" onClick={()=>{
                      setFormData({ title:ev.title, description:ev.description, eventType:ev.eventType, dateTime:ev.dateTime.slice(0,16), venue:ev.venue, brochure:null, id:ev._id });
                      setFormOpen(true);
                    }}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={async ()=>{
                      if(!confirm('Delete this event?')) return;
                      try { await eventService.deleteEvent(ev._id); toast.success('Deleted'); fetchEvents(); } catch(err){ toast.error('Failed'); }
                    }}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {formOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-full max-w-lg space-y-3 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-gray-50 mb-2">Create Event</h2>
            <Input placeholder="Title" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="bg-gray-700 text-gray-100" />
            <textarea placeholder="Description" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="bg-gray-700 text-gray-100 p-2 rounded" />
            <Input placeholder="Event Type (Hackathon, Workshop…)" value={formData.eventType} onChange={e=>setFormData({...formData, eventType:e.target.value})} className="bg-gray-700 text-gray-100" />
            <Input type="datetime-local" value={formData.dateTime} onChange={e=>setFormData({...formData, dateTime:e.target.value})} className="bg-gray-700 text-gray-100" />
            <Input placeholder="Venue" value={formData.venue} onChange={e=>setFormData({...formData, venue:e.target.value})} className="bg-gray-700 text-gray-100" />
            <input type="file" accept="application/pdf" onChange={e=>setFormData({...formData, brochure:e.target.files[0]})} className="text-gray-100" />
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="ghost" type="button" onClick={()=>setFormOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageEventsPage; 