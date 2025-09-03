import { useState } from 'react';
import { UserIcon, UploadIcon, XIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
export function Profile() {
  const {
    userName,
    userEmail,
    userWeight,
    userHeight
  } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button className={`pb-3 ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('profile')}>
            Profile
          </button>
          <button className={`pb-3 ${activeTab === 'measurements' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('measurements')}>
            Measurements
          </button>
          <button className={`pb-3 ${activeTab === 'preferences' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab('preferences')}>
            Preferences
          </button>
        </div>
      </div>
      {activeTab === 'profile' && <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <p className="text-sm text-gray-600 mb-6">
              Update your personal details
            </p>
            <div className="flex items-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mr-6 flex items-center justify-center overflow-hidden">
                <UserIcon className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="font-medium">Profile Picture</p>
                <div className="flex space-x-2">
                  <button className="bg-white border border-gray-300 text-sm px-3 py-1 rounded-md hover:bg-gray-50 flex items-center">
                    <UploadIcon className="h-4 w-4 mr-1" />
                    Upload New
                  </button>
                  <button className="bg-white border border-gray-300 text-sm px-3 py-1 rounded-md hover:bg-gray-50 flex items-center">
                    <XIcon className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  JPG, GIF or PNG. Max size of 2MB.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input type="text" defaultValue={userName.split(' ')[0]} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input type="text" defaultValue={userName.split(' ')[1]} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input type="email" defaultValue={userEmail} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
              Save Changes
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Sync Settings</h2>
            <p className="text-sm text-gray-600 mb-6">
              Configure how your data is stored and synced
            </p>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-medium">Use Backend Storage</p>
                <p className="text-sm text-gray-600">
                  When enabled, your data will be synced with the backend server
                </p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
              <span>Status: Online</span>
            </div>
            <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-50">
              <div className="h-4 w-4 mr-2" />
              Sync Now
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Data Management</h2>
            <p className="text-sm text-gray-600 mb-6">
              Export or import your workout data
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Your data is currently stored in your browser's localStorage. You
              can export it to a JSON file for backup or transfer to another
              device.
            </p>
            <div className="flex space-x-4">
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50">
                <UploadIcon className="h-4 w-4 mr-2 transform rotate-180" />
                Export Data
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50">
                <UploadIcon className="h-4 w-4 mr-2" />
                Import Data
              </button>
            </div>
          </div>
        </div>}
      {activeTab === 'measurements' && <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-6">Body Measurements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <div className="flex">
                <input type="number" defaultValue={userWeight} className="flex-grow border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                  lbs
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input type="text" defaultValue={userHeight} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
            Save Changes
          </button>
        </div>}
      {activeTab === 'preferences' && <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-6">App Preferences</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-600">
                  Use dark theme for the app interface
                </p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Workout Reminders</p>
                <p className="text-sm text-gray-600">
                  Get notifications for scheduled workouts
                </p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-blue-600">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Progress Updates</p>
                <p className="text-sm text-gray-600">
                  Weekly summaries of your workout progress
                </p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-blue-600">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
            Save Preferences
          </button>
        </div>}
    </div>;
}
