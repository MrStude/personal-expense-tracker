
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { apiPut, apiUploadPhoto } from '../lib/api.js';

export function UserProfile() {
  const { user, setUser } = useAuthContext();
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    photo: user?.photo || '',
  });
  const [photoFile, setPhotoFile] = useState(null);

  if (!user) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
      // Upload to backend
      try {
        const res = await apiUploadPhoto(file);
        setForm((prev) => ({ ...prev, photo: res.url }));
      } catch (err) {
        setError('Photo upload failed');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const data = await apiPut('/auth/profile', {
        name: form.name,
        email: form.email,
        photo: form.photo,
      });

      setUser(data.user);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      setForm({
        name: data.user.name || '',
        email: data.user.email || '',
        photo: data.user.photo || '',
      });
      setEditMode(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to get correct image URL
  const getPhotoUrl = (photo) => {
    if (!photo) return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.name || 'User');
    if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
    // Assume relative path from backend
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
    return apiBase + photo;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-xl shadow-md w-full max-w-xs mx-auto">
      <img
        src={getPhotoUrl(form.photo)}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow"
      />
      {editMode ? (
        <form className="w-full flex flex-col gap-4 mt-2" onSubmit={handleSave}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="input input-bordered w-full rounded-lg px-3 py-2 border border-border bg-background text-foreground"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="input input-bordered w-full rounded-lg px-3 py-2 border border-border bg-background text-foreground"
            required
          />
          <label className="block text-sm font-medium text-muted-foreground">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary"
          />
          <div className="flex gap-2 justify-center">
            <button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-60">
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" disabled={isSaving} className="bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 disabled:opacity-60" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">{form.name || 'User Name'}</h2>
          <p className="text-sm text-muted-foreground">{form.email || 'user@email.com'}</p>
          <button
            className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
