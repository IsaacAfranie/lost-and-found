import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useItems(filters = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const type = filters.type || 'all';
  const category = filters.category || '';
  const location = filters.location || '';
  const status = filters.status || 'open';
  const search = filters.search || '';
  const startDate = filters.startDate || '';
  const endDate = filters.endDate || '';
  const limit = filters.limit || 0;

  useEffect(() => {
    let isSubscribed = true;

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase.from('items').select('*');

        if (type && type !== 'all') {
          query = query.eq('type', type);
        }

        if (category) {
          query = query.eq('category', category);
        }

        if (location) {
          query = query.eq('location', location);
        }

        if (status) {
          query = query.eq('status', status);
        }

        if (search) {
          query = query.or(
            `title.ilike.%${search}%,description.ilike.%${search}%`
          );
        }

        if (startDate) {
          query = query.gte('date_lost', startDate);
        }

        if (endDate) {
          query = query.lte('date_lost', endDate);
        }

        query = query.order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (!isSubscribed) return;

        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        if (isSubscribed) {
          setError(err.message);
          setItems([]);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isSubscribed = false;
    };
  }, [type, category, location, status, search, startDate, endDate, limit]);

  return { items, loading, error };
}
