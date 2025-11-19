import React, { useState } from 'react';
import { profilesApi } from '../services/api';

interface ProfileInputProps {
  onProfilesAdded: () => void;
}

const ProfileInput: React.FC<ProfileInputProps> = ({ onProfilesAdded }) => {
  const [profiles, setProfiles] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await profilesApi.add(profiles);
      const results = response.data.results;
      
      const successCount = results.filter((r: any) => r.success).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        setSuccess(`Successfully added ${successCount} profile(s)`);
      }
      if (failCount > 0) {
        setError(`Failed to add ${failCount} profile(s)`);
      }

      setProfiles('');
      onProfilesAdded();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add profiles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Add LinkedIn Profiles</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="profiles" className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile URLs (comma-separated)
          </label>
          <textarea
            id="profiles"
            value={profiles}
            onChange={(e) => setProfiles(e.target.value)}
            placeholder="https://www.linkedin.com/in/profile1, https://www.linkedin.com/in/profile2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter one or more LinkedIn profile URLs separated by commas
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !profiles.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Add Profiles'}
        </button>
      </form>
    </div>
  );
};

export default ProfileInput;

