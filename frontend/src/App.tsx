import React, { useState, useEffect } from 'react';
import { Profile, profilesApi } from './services/api';
import ProfileInput from './components/ProfileInput';
import ProfileTable from './components/ProfileTable';
import MessageTemplates from './components/MessageTemplates';
import LoginStatus from './components/LoginStatus';
import './App.css';

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [templatesOpen, setTemplatesOpen] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await profilesApi.getAll();
      setProfiles(response.data);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LinkedIn Recruiter Followups
          </h1>
          <p className="text-gray-600">
            Manage and track your LinkedIn recruiter connections and follow-ups
          </p>
        </header>

        <div className="mb-6">
          <button
            onClick={() => setTemplatesOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Edit Message Templates
          </button>
        </div>

        <LoginStatus />

        <ProfileInput onProfilesAdded={loadProfiles} />

        {loading ? (
          <div className="text-center py-8">Loading profiles...</div>
        ) : (
          <ProfileTable profiles={profiles} onRefresh={loadProfiles} />
        )}

        <MessageTemplates isOpen={templatesOpen} onClose={() => setTemplatesOpen(false)} />
      </div>
    </div>
  );
}

export default App;
