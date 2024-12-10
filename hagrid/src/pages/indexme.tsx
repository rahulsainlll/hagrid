import React, { useState } from 'react';
import { 
  ConnectButton, 
  useConnection, 
  useActiveAddress 
} from "@arweave-wallet-kit/react";
import { performIndexMe } from '../actions';
import { cn } from "../lib/utils";

type TabType = 'projects' | 'process' | 'images' | 'txn';

export default function IndexMe() {
  const { connected } = useConnection();
  const address = useActiveAddress();
  const [projectData, setProjectData] = useState<{
    title: string;
    slug: string;
    description: string;
    link: string;
    twitter: string;
    tags: string[];
  }>({
    title: '',
    slug: '',
    description: '',
    link: 'https://',
    twitter: 'https://x.com/',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('projects');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmedTag = currentTag.trim();
      if (trimmedTag && !projectData.tags.includes(trimmedTag)) {
        setProjectData(prev => ({
          ...prev,
          tags: [...prev.tags, trimmedTag]
        }));
        setCurrentTag('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProjectData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const dataToSend = {
        ...projectData,
        link: `https://${projectData.link.replace('https://', '')}`,
        twitter: `https://x.com/${projectData.twitter.replace('https://x.com/', '')}`,
      };

      const go = await performIndexMe(JSON.stringify(dataToSend));
      console.log("Project Indexed: " + JSON.stringify(go));

      setProjectData({
        title: '',
        slug: '',
        description: '',
        link: 'https://',
        twitter: 'https://x.com/',
        tags: []
      });

      alert('Project indexed successfully!');
    } catch (error) {
      console.error('Error indexing project:', error);
      alert('Failed to index project');
    }
  };

  const tabs: { label: string; value: TabType }[] = [
    { label: 'Projects', value: 'projects' },
    { label: 'Process', value: 'process' },
    { label: 'Images', value: 'images' },
    { label: 'Transactions', value: 'txn' },
    // { label: 'Data', value: 'data' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <div>
            <div className="flex justify-center mb-4">
              <ConnectButton showProfilePicture={true} />
            </div>

            {connected ? (
              <div className="p-2 mb-4 text-center border rounded-lg bg-white/5 border-white/10">
                <p className="text-white">
                  Connected: {address ? address.slice(0, 6) + '...' + address.slice(-4) : 'No address'}
                </p>
              </div>
            ) : (
              <div className="p-2 mb-4 text-center border rounded-lg bg-white/5 border-white/10">
                <p className="text-gray-400">Wallet Not Connected</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={projectData.title}
                onChange={handleInputChange}
                required
                placeholder="Project Title"
                className="w-full px-3 py-2 border rounded-lg bg-white/5 border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
              />

              <textarea
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Project Description"
                className="w-full px-3 py-2 border rounded-lg bg-white/5 border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
              />

              <div className="flex">
                <span className="inline-flex items-center px-2 text-sm text-gray-400 border border-r-0 rounded-l-lg bg-white/5 border-white/20">
                  https://
                </span>
                <input
                  type="text"
                  name="link"
                  value={projectData.link.replace('https://', '')}
                  onChange={handleInputChange}
                  placeholder="yourproject"
                  className="flex-grow px-3 py-2 border rounded-r-lg bg-white/5 border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="flex">
                <span className="inline-flex items-center px-2 text-sm text-gray-400 border border-r-0 rounded-l-lg bg-white/5 border-white/20">
                  https://x.com/
                </span>
                <input
                  type="text"
                  name="twitter"
                  value={projectData.twitter.replace('https://x.com/', '')}
                  onChange={handleInputChange}
                  placeholder="yourproject"
                  className="flex-grow px-3 py-2 border rounded-r-lg bg-white/5 border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {projectData.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="flex items-center px-2 py-1 text-sm rounded-full bg-white/10"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-gray-300 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags (Enter or ,)"
                  className="w-full px-3 py-2 border rounded-lg bg-white/5 border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <button
                type="submit"
                disabled={!connected}
                className={`w-full py-2 rounded-lg transition-colors duration-300 ${
                  connected
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                {connected ? 'Index Project' : 'Connect Wallet to Index'}
              </button>
            </form>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-40 text-neutral-400">
            Coming soon...
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 text-white bg-black">
      <div className="w-full max-w-md p-6 border rounded-lg border-white/10">
        <h2 className="mb-6 text-2xl font-bold text-center text-white">Index Your Project</h2>

        <div className="flex mb-6 space-x-1 border-b border-neutral-800">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors rounded-t-lg",
                activeTab === tab.value
                  ? "text-purple-300 bg-neutral-900/50 border-b-2 border-purple-500"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
}