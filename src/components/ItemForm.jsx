import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { CATEGORIES, LOCATIONS, ITEM_TYPE } from '../utils/constants';
import '../styles/ItemForm.css';

export default function ItemForm({ onSuccess }) {
  const { session, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    type: ITEM_TYPE.LOST,
    title: '',
    description: '',
    category: CATEGORIES[0],
    location: LOCATIONS[0],
    date_lost: new Date().toISOString().split('T')[0],
    contact: '',
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleTypeToggle = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
    }));
  };

  const uploadImage = async (file, userId) => {
    const ext = file.name.split('.').pop();
    const fileName = `items/${userId}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('item-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('item-images')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { session: currentSession }, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const userId = currentSession?.user?.id;
      if (!userId) {
        throw new Error('Your session expired. Please sign in again.');
      }

      if (!formData.title.trim()) throw new Error('Title is required');
      if (!formData.contact.trim()) throw new Error('Contact information is required');

      let imageUrl = null;

      if (formData.image) {
        imageUrl = await uploadImage(formData.image, session.user.id);
      }

      const itemPayload = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        date_lost: formData.date_lost,
        image_url: imageUrl,
        contact: formData.contact,
        user_id: session.user.id,
        status: 'open',
      };

      const { data, error } = await supabase
        .from('items')
        .insert([itemPayload])
        .select();

      if (error) throw error;

      // Reset form
      setFormData({
        type: ITEM_TYPE.LOST,
        title: '',
        description: '',
        category: CATEGORIES[0],
        location: LOCATIONS[0],
        date_lost: new Date().toISOString().split('T')[0],
        contact: '',
        image: null,
      });
      setImagePreview(null);
      setSuccess(true);

      if (onSuccess) {
        setTimeout(() => onSuccess(data[0]), 1500);
      } else {
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      {authLoading && <div className="alert alert-info">Loading...</div>}

      <div className="form-section">
        <label className="form-label">Item Type</label>
        <div className="type-toggle">
          <button
            type="button"
            className={`toggle-btn ${formData.type === ITEM_TYPE.LOST ? 'active' : ''}`}
            onClick={() => handleTypeToggle(ITEM_TYPE.LOST)}
          >
            Lost Item
          </button>
          <button
            type="button"
            className={`toggle-btn ${formData.type === ITEM_TYPE.FOUND ? 'active' : ''}`}
            onClick={() => handleTypeToggle(ITEM_TYPE.FOUND)}
          >
            Found Item
          </button>
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">
          Title <span className="required">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Black backpack with laptop"
          className="form-input"
          required
        />
      </div>

      <div className="form-section">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the item in detail..."
          className="form-input form-textarea"
          rows="4"
        />
      </div>

      <div className="form-grid">
        <div className="form-section">
          <label className="form-label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label className="form-label">Location Last Seen</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date_lost"
            value={formData.date_lost}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-section">
          <label className="form-label">
            Contact Info <span className="required">*</span>
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Name and phone/email"
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">Image</label>
        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
            id="image-input"
          />
          <label htmlFor="image-input" className="file-label">
            Click to upload or drag and drop
          </label>
        </div>
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setFormData((prev) => ({ ...prev, image: null }));
              }}
              className="remove-image"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Item posted successfully!</div>}

      <button
        type="submit"
        disabled={loading}
        className="submit-btn"
      >
        {loading ? 'Posting...' : 'Post Item'}
      </button>
    </form>
  );
}
