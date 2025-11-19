import React, { useState, useEffect } from 'react';
import { messagesApi, MessageTemplate } from '../services/api';

interface MessageTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageTemplates: React.FC<MessageTemplatesProps> = ({ isOpen, onClose }) => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await messagesApi.getTemplates();
      setTemplates(response.data);
    } catch (err: any) {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (key: string, value: string) => {
    setTemplates(templates.map(t => t.key === key ? { ...t, value } : t));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      for (const template of templates) {
        await messagesApi.updateTemplate(template.key, template.value);
      }
      setSuccess('Templates saved successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError('Failed to save templates');
    } finally {
      setSaving(false);
    }
  };

  const getTemplateLabel = (key: string) => {
    const labels: Record<string, string> = {
      initial_message: 'Initial Message',
      followup_1: 'First Follow-up (3 days)',
      followup_2: 'Second Follow-up (6 days)',
      followup_3: 'Third Follow-up (9 days)',
    };
    return labels[key] || key;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Edit Message Templates</h2>
          <p className="text-sm text-gray-500 mt-1">
            Use {'{name}'} as a placeholder for the recipient's name
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading templates...</div>
          ) : (
            <>
              {templates.map((template) => (
                <div key={template.key} className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTemplateLabel(template.key)}
                  </label>
                  <textarea
                    value={template.value}
                    onChange={(e) => handleTemplateChange(template.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
                </div>
              ))}

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

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Templates'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageTemplates;

