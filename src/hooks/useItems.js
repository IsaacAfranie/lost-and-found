import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useItems(filters = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase.from('items').select('*');

        // Apply filters
        if (filters.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }

        if (filters.category) {
          query = query.eq('category', filters.category);
        }

        if (filters.location) {
          query = query.eq('location', filters.location);
        }

        if (filters.status) {
          query = query.eq('status', filters.status);
        }

        if (filters.search) {
          query = query.or(
            `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
          );
        }

        if (filters.startDate) {
          query = query.gte('date_lost', filters.startDate);
        }

        if (filters.endDate) {
          query = query.lte('date_lost', filters.endDate);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        setError(err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [JSON.stringify(filters)]);

  return { items, loading, error };
}
