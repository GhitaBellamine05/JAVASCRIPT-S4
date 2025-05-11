import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axsvgpmqtpteqzzzzqqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4c3ZncG1xdHB0ZXF6enp6cXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NjI3MzQsImV4cCI6MjA2MjUzODczNH0.ab8KYIKgxpw67_omgPaVV-hw9EPFY_9MNG7OhAABQj8';

const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseService = {
    // Save playlist to database
    savePlaylist: async (userId, playlist) => {
        const { data, error } = await supabase
            .from('playlists')
            .insert([
                {
                    user_id: userId,
                    name: playlist.name,
                    tracks: playlist.tracks
                }
            ]);
        return { data, error };
    },

    // Get user's playlists
    getPlaylists: async (userId) => {
        const { data, error } = await supabase
            .from('playlists')
            .select('*')
            .eq('user_id', userId);
        return { data, error };
    },

    // Update playlist
    updatePlaylist: async (playlistId, playlist) => {
        const { data, error } = await supabase
            .from('playlists')
            .update({
                name: playlist.name,
                tracks: playlist.tracks
            })
            .eq('id', playlistId);
        return { data, error };
    },

    // Delete playlist
    deletePlaylist: async (playlistId) => {
        const { data, error } = await supabase
            .from('playlists')
            .delete()
            .eq('id', playlistId);
        return { data, error };
    }
}; 